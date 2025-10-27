import type React from "react"
import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import axios from "axios"
import { toast } from "react-hot-toast"
import { cn } from "../../lib/utils"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card"
import { Button } from "../../components/ui/button"
import { Input } from "../../components/ui/input"
import { Label } from "../../components/ui/label"
import { z } from "zod"
import AxiosInstance from "../../axios/axios"
import { useSelector } from "react-redux"
import type { Rootstate } from "../../store/store"
import type { UserAuthData } from "../../store/Slice/authDataSlice"
import { useInvestorProfileCompletion } from "../../hooks/AuthHooks"
import { useNavigate } from "react-router-dom"

type FormData = {
    location: string
    linkedInUrl: string
    companyName: string
    experience: string
    profileImg: string
    preferredSector: string[]
    preferredStartupStage: string[]
    investmentMin: string
    investmentMax: string
    portfolioPdf: string
}

const SECTORS = [
    "AI/ML",
    "FinTech",
    "HealthTech",
    "EdTech",
    "AgriTech",
    "E-commerce",
    "SaaS",
    "BlockChain/Crypto",
    "GreenTech",
    "Real Estate/PropTech",
    "FoodTech",
    "Gaming",
    "Social Media",
    "Travel & Hospitality",
    "Logistic & SupplyChain",
    "CyberSecurity",
    "IoT/Hardware",
    "AR/VR",
    "Services",
] as const

const STAGES = [
    "Idea Stage",
    "Prototype Stage",
    "MVP",
    "Beta",
    "Live Project",
    "Seed Stage",
    "Early Growth",
    "Scaling Stage",
    "Established / Revenue Generating",
] as const

const MAX_FILE_SIZE = 5 * 1024 * 1024

function Chip({
    selected,
    children,
    onClick,
    disabled,
}: {
    selected: boolean
    children: React.ReactNode
    onClick: () => void
    disabled?: boolean
}) {
    return (
        <button
            type="button"
            onClick={onClick}
            disabled={disabled}
            className={cn(
                "rounded-full border px-3 py-1.5 text-sm transition focus:outline-none focus:ring-2 focus:ring-primary",
                disabled ? "opacity-60 cursor-not-allowed" : "hover:bg-accent",
                selected
                    ? "bg-primary/10 text-primary border-primary"
                    : "bg-card text-foreground border-border",
            )}
            aria-pressed={selected}
            aria-disabled={disabled}
        >
            {children}
        </button>
    )
}

export default function InvestorProfileCompletion() {
    const [step, setStep] = useState<number>(1)
    const [formData, setFormData] = useState<FormData>({
        location: "",
        linkedInUrl: "",
        companyName: "",
        experience: "",
        profileImg: "",
        preferredSector: [],
        preferredStartupStage: [],
        investmentMin: "",
        investmentMax: "",
        portfolioPdf: "",
    })
    const [errors, setErrors] = useState<Record<string, string>>({})
    const [uploading, setUploading] = useState<{ profileImg?: boolean; portfolioPdf?: boolean }>({})
    const [fileNames, setFileNames] = useState<{ profileImg?: string; portfolioPdf?: string }>({})
    const investorData: UserAuthData = useSelector((state: Rootstate) => state.authData)
    console.log("inveestor data from redux", investorData)
    const { mutate: profileCompletion } = useInvestorProfileCompletion()
    const navigate = useNavigate();

    async function uploadToCloudinary(file: File, resourceType: "auto" | "image" | "raw" = "auto") {
        try {
            // Validate file size
            if (file.size > MAX_FILE_SIZE) {
                toast.error("File size must be less than 5MB")
                return null
            }

            const formDataUpload = new FormData()
            formDataUpload.append("file", file)
            formDataUpload.append("upload_preset", "investorProfile") // Replace with your preset
            formDataUpload.append("cloud_name", "djfuu8l1u") // Replace with your cloud name

            const response = await axios.post(
                `https://api.cloudinary.com/v1_1/djfuu8l1u/upload`,
                formDataUpload,
            )

            return response.data.secure_url
        } catch (error) {
            console.error("Upload error:", error)
            toast.error("Failed to upload file")
            return null
        }
    }

    function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
        const { name, value } = e.target
        setFormData((prev) => ({ ...prev, [name]: value }))
    }

    async function handleFileChange(
        e: React.ChangeEvent<HTMLInputElement>,
        fileType: "profileImg" | "portfolioPdf",
    ) {
        const file = e.target.files?.[0]
        if (!file) return

        setUploading((prev) => ({ ...prev, [fileType]: true }))
        setFileNames((prev) => ({ ...prev, [fileType]: file.name }))

        const url = await uploadToCloudinary(file, fileType === "profileImg" ? "image" : "raw")

        if (url) {
            setFormData((prev) => ({ ...prev, [fileType]: url }))
            toast.success(`${fileType === "profileImg" ? "Image" : "PDF"} uploaded successfully!`)
        }

        setUploading((prev) => ({ ...prev, [fileType]: false }))
    }

    const MAX_SELECT = 4
    const sectorLimitReached = formData.preferredSector.length >= MAX_SELECT
    const stageLimitReached = formData.preferredStartupStage.length >= MAX_SELECT

    function toggleMulti(name: "preferredSector" | "preferredStartupStage", value: string) {
        setFormData((prev) => {
            const isSelected = prev[name].includes(value)
            if (!isSelected) {
                const currentLen = prev[name].length
                if (currentLen >= MAX_SELECT) {
                    toast.warning(`You can select up to ${MAX_SELECT} only.`)
                    return prev
                }
            }
            const arr = new Set(prev[name])
            if (arr.has(value)) arr.delete(value)
            else arr.add(value)
            return { ...prev, [name]: Array.from(arr) as string[] }
        })
    }

    async function handleSubmit() {
        profileCompletion({ formData, investorId: investorData.id }, {
            onSuccess: (res) => {
                console.log(res)
                navigate('/investor/home')
                toast.success(res.message);
            },
            onError: (err) => {
                console.log(err)
                toast.error(err.message);
            }
        }
        )
    }

    function handleNext() {
        console.log("readched")
        if (step < 2) setStep((s) => s + 1)
    }
    function handlePrev() {
        if (step > 1) setStep((s) => s - 1)
    }

    const Step1Schema = z.object({
        // profileImg: z.string().min(1, "Please choose an image file"),
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

    const Step2Schema = z
        .object({
            preferredSector: z.array(z.string()).min(1, "Select at least 1").max(4, "Up to 4 sectors"),
            preferredStartupStage: z.array(z.string()).min(1, "Select at least 1").max(4, "Up to 4 stages"),
            investmentMin: z.preprocess((v) => (v === "" ? Number.NaN : Number(v)), z.number().min(0, "Min must be >= 0")),
            investmentMax: z.preprocess((v) => (v === "" ? Number.NaN : Number(v)), z.number().min(0, "Max must be >= 0")),
            portfolioPdf: z.string().optional().or(z.literal("")),
        })
        .refine(
            (vals) =>
                isNaN(Number(vals.investmentMin)) || isNaN(Number(vals.investmentMax))
                    ? false
                    : Number(vals.investmentMax) >= Number(vals.investmentMin),
            { message: "Max must be greater than or equal to Min", path: ["investmentMax"] },
        )

    function validateStep1(): boolean {
        const result = Step1Schema.safeParse({
            profileImg: formData.profileImg,
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
            portfolioPdf: formData.portfolioPdf,
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
        if (validateStep1()) {
            handleNext()
            console.log('reached here step 1')
        }

    }
    function onSubmitValidate() {
        if (!validateStep2()) return
        handleSubmit()
    }

    return (
        <main className="min-h-screen bg-background">
            <div className="mx-auto w-full max-w-3xl px-4 py-8 md:py-12">
                <Card className="border-border bg-card">
                    <CardHeader className="space-y-1">
                        <div className="flex items-center justify-between gap-4">
                            <div>
                                <CardTitle className="text-pretty">Profile Completion</CardTitle>
                                <CardDescription>Step {step} of 2</CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="pt-2">
                        <AnimatePresence mode="wait">
                            {step === 1 ? (
                                <motion.div
                                    key="step-1"
                                    initial={{ opacity: 0, y: 24 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -24 }}
                                    transition={{ duration: 0.2, ease: "easeOut" }}
                                    className="grid gap-4"
                                >
                                    {/* Profile Image */}
                                    <div className="grid gap-2">
                                        <Label htmlFor="profileImg">Profile Image</Label>
                                        <Input
                                            id="profileImg"
                                            type="file"
                                            accept="image/*"
                                            disabled={uploading.profileImg}
                                            onChange={(e) => handleFileChange(e, "profileImg")}
                                        />
                                        {uploading.profileImg && (
                                            <p className="text-xs text-primary">Uploading image...</p>
                                        )}
                                        {fileNames.profileImg && !uploading.profileImg && (
                                            <p className="text-xs text-green-600">✓ {fileNames.profileImg}</p>
                                        )}
                                        {errors.profileImg ? (
                                            <p className="text-xs text-destructive">{errors.profileImg}</p>
                                        ) : (
                                            <p className="text-xs text-muted-foreground">Choose an image file (max 5MB).</p>
                                        )}
                                    </div>

                                    {/* LinkedIn */}
                                    <div className="grid gap-2">
                                        <Label htmlFor="linkedInUrl">LinkedIn Profile URL</Label>
                                        <Input
                                            id="linkedInUrl"
                                            name="linkedInUrl"
                                            inputMode="url"
                                            placeholder="https://www.linkedin.com/in/username"
                                            value={formData.linkedInUrl}
                                            onChange={handleChange}
                                            aria-invalid={!!errors.linkedInUrl}
                                        />
                                        {errors.linkedInUrl && <p className="text-xs text-destructive">{errors.linkedInUrl}</p>}
                                    </div>

                                    {/* Company */}
                                    <div className="grid gap-2">
                                        <Label htmlFor="companyName">Company / Firm (optional)</Label>
                                        <Input
                                            id="companyName"
                                            name="companyName"
                                            placeholder="Your firm or company"
                                            value={formData.companyName}
                                            onChange={handleChange}
                                            aria-invalid={!!errors.companyName}
                                        />
                                        {errors.companyName && <p className="text-xs text-destructive">{errors.companyName}</p>}
                                    </div>

                                    {/* Experience */}
                                    <div className="grid gap-2">
                                        <Label htmlFor="experience">Years of Experience</Label>
                                        <Input
                                            id="experience"
                                            name="experience"
                                            type="number"
                                            min={0}
                                            placeholder="e.g., 5"
                                            value={formData.experience}
                                            onChange={handleChange}
                                            aria-invalid={!!errors.experience}
                                        />
                                        {errors.experience && <p className="text-xs text-destructive">{errors.experience}</p>}
                                    </div>

                                    {/* Location */}
                                    <div className="grid gap-2">
                                        <Label htmlFor="location">Location</Label>
                                        <Input
                                            id="location"
                                            name="location"
                                            placeholder="Country / City"
                                            value={formData.location}
                                            onChange={handleChange}
                                            aria-invalid={!!errors.location}
                                        />
                                        {errors.location && <p className="text-xs text-destructive">{errors.location}</p>}
                                    </div>

                                    <div className="flex justify-end">
                                        <Button onClick={onNextValidate} type="button">
                                            Next
                                        </Button>
                                    </div>
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="step-2"
                                    initial={{ opacity: 0, y: 24 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -24 }}
                                    transition={{ duration: 0.2, ease: "easeOut" }}
                                    className="grid gap-4"
                                >
                                    {/* Preferred Sectors */}
                                    <div className="grid gap-2">
                                        <div className="flex items-baseline justify-between">
                                            <Label>Preferred Sectors</Label>
                                            <span className="text-xs text-muted-foreground">
                                                {formData.preferredSector.length}/{MAX_SELECT} selected
                                            </span>
                                        </div>
                                        {errors.preferredSector && <p className="text-xs text-destructive">{errors.preferredSector}</p>}
                                        <div className="rounded-lg border border-primary/20 bg-primary/5 p-3 sm:p-4">
                                            <div className="flex flex-wrap gap-2">
                                                {SECTORS.map((s) => {
                                                    const selected = formData.preferredSector.includes(s)
                                                    const disabled = !selected && sectorLimitReached
                                                    return (
                                                        <Chip
                                                            key={s}
                                                            selected={selected}
                                                            disabled={disabled}
                                                            onClick={() => toggleMulti("preferredSector", s)}
                                                        >
                                                            {s}
                                                        </Chip>
                                                    )
                                                })}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Preferred Startup Stage */}
                                    <div className="grid gap-2">
                                        <div className="flex items-baseline justify-between">
                                            <Label>Preferred Startup Stages</Label>
                                            <span className="text-xs text-muted-foreground">
                                                {formData.preferredStartupStage.length}/{MAX_SELECT} selected
                                            </span>
                                        </div>
                                        {errors.preferredStartupStage && (
                                            <p className="text-xs text-destructive">{errors.preferredStartupStage}</p>
                                        )}
                                        <div className="rounded-lg border border-primary/20 bg-primary/5 p-3 sm:p-4">
                                            <div className="flex flex-wrap gap-2">
                                                {STAGES.map((st) => {
                                                    const selected = formData.preferredStartupStage.includes(st)
                                                    const disabled = !selected && stageLimitReached
                                                    return (
                                                        <Chip
                                                            key={st}
                                                            selected={selected}
                                                            disabled={disabled}
                                                            onClick={() => toggleMulti("preferredStartupStage", st)}
                                                        >
                                                            {st}
                                                        </Chip>
                                                    )
                                                })}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Investment range */}
                                    <div className="grid gap-2">
                                        <Label>Investment Range (USD)</Label>
                                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                                            <div className="grid gap-1.5">
                                                <Label htmlFor="investmentMin" className="text-xs text-muted-foreground">
                                                    Minimum
                                                </Label>
                                                <Input
                                                    id="investmentMin"
                                                    name="investmentMin"
                                                    type="number"
                                                    min={0}
                                                    placeholder="e.g., 5000"
                                                    value={formData.investmentMin}
                                                    onChange={handleChange}
                                                    aria-invalid={!!errors.investmentMin}
                                                />
                                                {errors.investmentMin && <p className="text-xs text-destructive">{errors.investmentMin}</p>}
                                            </div>
                                            <div className="grid gap-1.5">
                                                <Label htmlFor="investmentMax" className="text-xs text-muted-foreground">
                                                    Maximum
                                                </Label>
                                                <Input
                                                    id="investmentMax"
                                                    name="investmentMax"
                                                    type="number"
                                                    min={0}
                                                    placeholder="e.g., 25000"
                                                    value={formData.investmentMax}
                                                    onChange={handleChange}
                                                    aria-invalid={!!errors.investmentMax}
                                                />
                                                {errors.investmentMax && <p className="text-xs text-destructive">{errors.investmentMax}</p>}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Portfolio PDF */}
                                    <div className="grid gap-2">
                                        <Label htmlFor="portfolioPdf">Portfolio (PDF) (optional)</Label>
                                        <Input
                                            id="portfolioPdf"
                                            type="file"
                                            accept=".pdf"
                                            disabled={uploading.portfolioPdf}
                                            onChange={(e) => handleFileChange(e, "portfolioPdf")}
                                        />
                                        {uploading.portfolioPdf && (
                                            <p className="text-xs text-primary">Uploading PDF...</p>
                                        )}
                                        {fileNames.portfolioPdf && !uploading.portfolioPdf && (
                                            <p className="text-xs text-green-600">✓ {fileNames.portfolioPdf}</p>
                                        )}
                                        {errors.portfolioPdf && <p className="text-xs text-destructive">{errors.portfolioPdf}</p>}
                                        {!errors.portfolioPdf && (
                                            <p className="text-xs text-muted-foreground">Upload a PDF file (max 5MB). Optional field.</p>
                                        )}
                                    </div>

                                    <div className="mt-1 flex items-center justify-between">
                                        <Button variant="secondary" type="button" onClick={handlePrev}>
                                            Back
                                        </Button>
                                        <Button type="button" onClick={onSubmitValidate}>
                                            Submit
                                        </Button>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </CardContent>
                </Card>
            </div>
        </main>
    )
}