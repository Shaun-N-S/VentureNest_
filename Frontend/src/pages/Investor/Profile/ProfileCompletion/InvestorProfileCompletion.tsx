import React, { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../../components/ui/card"
import Step1ProfileDetails from "./Step1ProfileDetails"
import Step2Preferences from "./Step2Preferences"
import { toast } from "react-hot-toast"
import { useSelector } from "react-redux"
import type { Rootstate } from "../../../../store/store"
import type { UserAuthData } from "../../../../store/Slice/authDataSlice"
import { useInvestorProfileCompletion } from "../../../../hooks/Auth/AuthHooks"
import { useNavigate } from "react-router-dom"
import { z } from "zod"
import { SECTOR } from "../../../../types/PreferredSector"
import { STAGES } from "../../../../types/StartupStages"

const MAX_FILE_SIZE = 5 * 1024 * 1024
const MAX_SELECT = 4

export type FormData = {
    location: string
    linkedInUrl: string
    companyName: string
    experience: string
    preferredSector: string[]
    preferredStartupStage: string[]
    investmentMin: string
    investmentMax: string
}

export type FileData = {
    profileImg: File | null
    portfolioPdf: File | null
}

export default function InvestorProfileCompletion() {
    const [step, setStep] = useState(1)
    const [formData, setFormData] = useState<FormData>({
        location: "",
        linkedInUrl: "",
        companyName: "",
        experience: "",
        preferredSector: [],
        preferredStartupStage: [],
        investmentMin: "",
        investmentMax: "",
    })
    const [files, setFiles] = useState<FileData>({
        profileImg: null,
        portfolioPdf: null,
    })
    const [errors, setErrors] = useState<Record<string, string>>({})
    const [fileNames, setFileNames] = useState<{ profileImg?: string; portfolioPdf?: string }>({})
    const investorData: UserAuthData = useSelector((state: Rootstate) => state.authData)
    const { mutate: profileCompletion } = useInvestorProfileCompletion()
    const navigate = useNavigate()

    function handleFileChange(e: React.ChangeEvent<HTMLInputElement>, fileType: "profileImg" | "portfolioPdf") {
        const file = e.target.files?.[0]
        if (!file) return

        // Validate file size
        if (file.size > MAX_FILE_SIZE) {
            toast.error("File size must be less than 5MB")
            e.target.value = "" // Reset input
            return
        }

        // Validate file type
        if (fileType === "profileImg") {
            if (!file.type.startsWith("image/")) {
                toast.error("Please select a valid image file")
                e.target.value = ""
                return
            }
        } else if (fileType === "portfolioPdf") {
            if (file.type !== "application/pdf") {
                toast.error("Please select a valid PDF file")
                e.target.value = ""
                return
            }
        }

        // Store the file
        setFiles((prev) => ({ ...prev, [fileType]: file }))
        setFileNames((prev) => ({ ...prev, [fileType]: file.name }))
        toast.success(`${fileType === "profileImg" ? "Image" : "PDF"} selected successfully!`)
    }

    const Step1Schema = z.object({
        linkedInUrl: z.string().url("Enter a valid LinkedIn URL"),
        companyName: z.string().max(100, "Company name too long").optional().or(z.literal("")),
        experience: z
            .preprocess(
                (v) => (v === "" ? Number.NaN : Number(v)),
                z.number().int().min(0, "Must be 0 or more").max(60, "Too large"),
            )
            .or(z.nan().transform(() => 0)),
        location: z.string().min(2, "Please enter your location"),
    })

    const Step2Schema = z.object({
        preferredSector: z.array(z.string()).min(1, "Select at least one sector").max(MAX_SELECT),
        preferredStartupStage: z.array(z.string()).min(1, "Select at least one stage").max(MAX_SELECT),
        investmentMin: z.preprocess((v) => (v === "" ? Number.NaN : Number(v)), z.number().min(0, "Min must be >= 0")),
        investmentMax: z.preprocess((v) => (v === "" ? Number.NaN : Number(v)), z.number().min(0, "Max must be >= 0")),
    }).refine(
        (vals) =>
            isNaN(Number(vals.investmentMin)) || isNaN(Number(vals.investmentMax))
                ? false
                : Number(vals.investmentMax) >= Number(vals.investmentMin),
        { message: "Max must be greater than or equal to Min", path: ["investmentMax"] },
    )

    function validateStep1(): boolean {
        const result = Step1Schema.safeParse({
            linkedInUrl: formData.linkedInUrl,
            companyName: formData.companyName,
            experience: formData.experience,
            location: formData.location,
        })
        if (!result.success) {
            const map: Record<string, string> = {}
            for (const e of result.error.issues) {
                const k = (e.path[0] as string) || "form"
                if (!map[k]) map[k] = e.message
            }
            setErrors(map)
            toast.error("Please fix the highlighted fields")
            return false
        }
        setErrors({})
        return true
    }

    function validateStep2(): boolean {
        const result = Step2Schema.safeParse({
            preferredSector: formData.preferredSector,
            preferredStartupStage: formData.preferredStartupStage,
            investmentMin: formData.investmentMin,
            investmentMax: formData.investmentMax,
        })
        if (!result.success) {
            const map: Record<string, string> = {}
            for (const e of result.error.issues) {
                const k = (e.path[0] as string) || "form"
                if (!map[k]) map[k] = e.message
            }
            setErrors(map)
            toast.error("Please fix the highlighted fields")
            return false
        }
        setErrors({})
        return true
    }

    function onNextValidate() {
        if (validateStep1()) setStep((s) => s + 1)
    }

    function onSubmitValidate() {
        if (!validateStep2()) return

        // Create FormData object to send files and data together
        const submitData = new FormData()
        
        // Append form data as JSON string
        submitData.append("formData", JSON.stringify(formData))
        submitData.append("investorId", investorData.id)
        
        // Append files if they exist
        if (files.profileImg) {
            submitData.append("profileImg", files.profileImg)
        }
        if (files.portfolioPdf) {
            submitData.append("portfolioPdf", files.portfolioPdf)
        }

        profileCompletion(
            submitData,
            {
                onSuccess: (res) => {
                    navigate('/investor/home')
                    toast.success(res.message)
                },
                onError: (err) => {
                    toast.error(err.message)
                }
            }
        )
    }

    function handlePrev() {
        if (step > 1) setStep((s) => s - 1)
    }

    return (
        <main className="min-h-screen bg-background">
            <div className="mx-auto w-full max-w-3xl px-4 py-8 md:py-12">
                <Card className="border-border bg-card">
                    <CardHeader>
                        <CardTitle>Profile Completion</CardTitle>
                        <CardDescription>Step {step} of 2</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {step === 1 ? (
                            <Step1ProfileDetails
                                formData={formData}
                                setFormData={setFormData}
                                errors={errors}
                                fileNames={fileNames}
                                handleFileChange={handleFileChange}
                                onNext={onNextValidate}
                            />
                        ) : (
                            <Step2Preferences
                                SECTORS={SECTOR}
                                STAGES={STAGES}
                                MAX_SELECT={MAX_SELECT}
                                formData={formData}
                                setFormData={setFormData}
                                errors={errors}
                                fileNames={fileNames}
                                handleFileChange={handleFileChange}
                                onPrev={handlePrev}
                                onSubmit={onSubmitValidate}
                            />
                        )}
                    </CardContent>
                </Card>
            </div>
        </main>
    )
}