import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "../../components/ui/dialog"
import { Button } from "../../components/ui/button"
import { Input } from "../../components/ui/input"
import { Label } from "../../components/ui/label"
import { AlertCircle, FileUp, X } from "lucide-react"
import { useState, useEffect, useRef } from "react"
import { toast } from "react-hot-toast"
import { z } from "zod"
import { Popover, PopoverTrigger, PopoverContent } from "../../components/ui/popover"
import { Calendar as CalendarComponent } from "../../components/ui/calendar"
import { format } from "date-fns"
import ImageCropper from "../cropper/ImageCropper"
import { useKycUpdate } from "../../hooks/Investor/Profile/InvestorProfileHooks"

const kycSchema = z.object({
    dateOfBirth: z.date().refine((val) => !!val, { message: "Date of birth required" }),
    phoneNumber: z.string().min(10, "Enter a valid phone number").max(10, "Enter a valid phone number"),
    address: z.string().min(5, "Enter a valid address"),
    aadharImg: z.instanceof(File, { message: "Aadhar image required" }),
    selfieImg: z.instanceof(File, { message: "Selfie required" }),
})

type KYCFormData = z.infer<typeof kycSchema>

export default function KYCVerificationModal({
    id,
    open,
    onOpenChange,
}: {
    id: string
    open: boolean
    onOpenChange: (v: boolean) => void
}) {
    const [formData, setFormData] = useState({
        dateOfBirth: undefined as Date | undefined,
        phoneNumber: "",
        address: "",
    })
    const [errors, setErrors] = useState<Record<string, string>>({})
    const aadharInputRef = useRef<HTMLInputElement | null>(null);
    const selfieInputRef = useRef<HTMLInputElement | null>(null);


    // Image states
    const [aadharImg, setAadharImg] = useState<File | null>(null)
    const [selfieImg, setSelfieImg] = useState<File | null>(null)
    const [aadharPreview, setAadharPreview] = useState<string | null>(null)
    const [selfiePreview, setSelfiePreview] = useState<string | null>(null)

    // Crop states
    const [cropImage, setCropImage] = useState<string | null>(null)
    const [cropType, setCropType] = useState<"aadhar" | "selfie" | null>(null)

    const { mutate: KYCUpdate } = useKycUpdate()

    // Handle file selection → open cropper
    const handleFileChange = (
        e: React.ChangeEvent<HTMLInputElement>,
        type: "aadhar" | "selfie"
    ) => {
        const file = e.target.files?.[0]
        if (!file) return

        if (!file.type.startsWith("image/")) {
            toast.error("Please select an image file")
            return
        }
        if (file.size > 5 * 1024 * 1024) {
            toast.error("Image size should be less than 5MB")
            return
        }

        const reader = new FileReader()
        reader.onload = () => {
            setCropImage(reader.result as string)
            setCropType(type)
        }
        reader.readAsDataURL(file)
    }

    // Save cropped image (full resolution)
    const handleCropSave = (croppedFile: File, previewUrl: string) => {
        if (!cropType) return

        // Revoke old preview
        if (cropType === "aadhar" && aadharPreview) URL.revokeObjectURL(aadharPreview)
        if (cropType === "selfie" && selfiePreview) URL.revokeObjectURL(selfiePreview)

        if (cropType === "aadhar") {
            setAadharImg(croppedFile)
            setAadharPreview(previewUrl)
            setErrors((prev) => {
                const { aadharImg, ...rest } = prev
                return rest
            })
        } else {
            setSelfieImg(croppedFile)
            setSelfiePreview(previewUrl)
            setErrors((prev) => {
                const { selfieImg, ...rest } = prev
                return rest
            })
        }

        setCropImage(null)
        setCropType(null)
    }

    // Cancel crop
    const handleCropCancel = () => {
        setCropImage(null)
        setCropType(null)

        if (cropType === "aadhar" && aadharInputRef.current) {
            aadharInputRef.current.value = "";
        }
        if (cropType === "selfie" && selfieInputRef.current) {
            selfieInputRef.current.value = "";
        }
    }

    // Remove uploaded image
    const removeImage = (type: "aadhar" | "selfie") => {
        if (type === "aadhar") {
            if (aadharPreview) URL.revokeObjectURL(aadharPreview)
            setAadharImg(null)
            setAadharPreview(null)
            setErrors((prev) => {
                const { aadharImg, ...rest } = prev
                return rest
            })
        } else {
            if (selfiePreview) URL.revokeObjectURL(selfiePreview)
            setSelfieImg(null)
            setSelfiePreview(null)
            setErrors((prev) => {
                const { selfieImg, ...rest } = prev
                return rest
            })
        }
    }

    // Cleanup preview URLs on unmount
    useEffect(() => {
        return () => {
            if (aadharPreview) URL.revokeObjectURL(aadharPreview)
            if (selfiePreview) URL.revokeObjectURL(selfiePreview)
        }
    }, [aadharPreview, selfiePreview])

    // Form input change
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setFormData((prev) => ({ ...prev, [name]: value }))
        setErrors((prev) => {
            const { [name]: _, ...rest } = prev
            return rest
        })
    }

    // Submit handler
    const handleSubmit = async () => {
        setErrors({})

        // Early validation
        if (!formData.dateOfBirth) {
            setErrors((prev) => ({ ...prev, dateOfBirth: "Date of birth required" }))
            toast.error("Date of birth required")
            return
        }
        if (!aadharImg) {
            setErrors((prev) => ({ ...prev, aadharImg: "Aadhar image required" }))
            toast.error("Aadhar image required")
            return
        }
        if (!selfieImg) {
            setErrors((prev) => ({ ...prev, selfieImg: "Selfie required" }))
            toast.error("Selfie required")
            return
        }

        try {
            const dataToValidate: KYCFormData = {
                dateOfBirth: formData.dateOfBirth,
                phoneNumber: formData.phoneNumber,
                address: formData.address,
                aadharImg,
                selfieImg,
            }

            kycSchema.parse(dataToValidate)

            const formDataToSend = new FormData();
            formDataToSend.append("id", id);
            formDataToSend.append("aadharImg", aadharImg);
            formDataToSend.append("selfieImg", selfieImg);

            formDataToSend.append(
                "formData",
                JSON.stringify({
                    dateOfBirth: formData.dateOfBirth.toISOString(),
                    phoneNumber: formData.phoneNumber,
                    address: formData.address,
                })
            );

            KYCUpdate(
                formDataToSend, {
                onSuccess: (res) => {
                    console.log(res);
                    toast.success(res.message);
                },
                onError: (err) => {
                    toast.error(err.message)
                }
            }
            )
            onOpenChange(false)
        } catch (err) {
            if (err instanceof z.ZodError) {
                const newErrors: Record<string, string> = {}
                err.issues.forEach((issue) => {
                    if (issue.path[0]) {
                        newErrors[issue.path[0] as string] = issue.message
                    }
                })
                setErrors(newErrors)
                toast.error(err.issues[0].message)
            } else {
                toast.error("Something went wrong!")
                console.error(err)
            }
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-lg max-h-[90vh] bg-sky-50 rounded-2xl p-6 overflow-hidden flex flex-col">
                <DialogHeader>
                    <DialogTitle className="text-center text-2xl font-semibold">Verify Your Account</DialogTitle>
                </DialogHeader>

                <div className="flex items-start gap-2 text-sm text-muted-foreground mb-3">
                    <AlertCircle className="h-5 w-5 text-blue-500 flex-shrink-0 mt-0.5" />
                    <p>We require verification using a government-issued ID and a selfie.</p>
                </div>

                {/* Form */}
                <div
                    className="space-y-4 overflow-y-auto overflow-x-hidden pr-2"
                    style={{ scrollbarWidth: "thin" }}
                >
                    {/* Date of Birth */}
                    <div>
                        <Label>Date of Birth *</Label>
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button
                                    variant="outline"
                                    className={`w-full justify-start text-left font-normal ${!formData.dateOfBirth && "text-muted-foreground"
                                        } ${errors.dateOfBirth ? "border-red-500" : ""}`}
                                >
                                    {formData.dateOfBirth ? (
                                        format(formData.dateOfBirth, "dd/MM/yyyy")
                                    ) : (
                                        <span>Select date of birth</span>
                                    )}
                                    <FileUp className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                                <CalendarComponent
                                    mode="single"
                                    selected={formData.dateOfBirth}
                                    onSelect={(date) => {
                                        setFormData({ ...formData, dateOfBirth: date ?? undefined })
                                        setErrors((prev) => {
                                            const { dateOfBirth, ...rest } = prev
                                            return rest
                                        })
                                    }}
                                    disabled={(date) =>
                                        date > new Date() || date < new Date("1900-01-01")
                                    }
                                    captionLayout="dropdown"
                                    fromYear={1900}
                                    toYear={new Date().getFullYear()}
                                    initialFocus
                                />
                            </PopoverContent>
                        </Popover>
                        {errors.dateOfBirth && (
                            <p className="text-red-500 text-sm mt-1">{errors.dateOfBirth}</p>
                        )}
                    </div>

                    {/* Phone Number */}
                    <div>
                        <Label>Phone Number *</Label>
                        <Input
                            name="phoneNumber"
                            placeholder="Enter phone number"
                            value={formData.phoneNumber}
                            onChange={handleChange}
                            className={errors.phoneNumber ? "border-red-500" : ""}
                        />
                        {errors.phoneNumber && (
                            <p className="text-red-500 text-sm mt-1">{errors.phoneNumber}</p>
                        )}
                    </div>

                    {/* Address */}
                    <div>
                        <Label>Address *</Label>
                        <Input
                            name="address"
                            placeholder="Enter address"
                            value={formData.address}
                            onChange={handleChange}
                            className={errors.address ? "border-red-500" : ""}
                        />
                        {errors.address && (
                            <p className="text-red-500 text-sm mt-1">{errors.address}</p>
                        )}
                    </div>

                    {/* Upload Aadhar Image */}
                    <div>
                        <Label>Upload Aadhar Image *</Label>
                        {aadharPreview ? (
                            <div className="relative mt-2 inline-block">
                                {/* Small 120x120 Thumbnail */}
                                <img
                                    src={aadharPreview}
                                    alt="Aadhar preview"
                                    className="w-32 h-32 object-cover rounded-lg border-2 border-gray-300 shadow-sm"
                                />
                                <Button
                                    type="button"
                                    variant="destructive"
                                    size="icon"
                                    className="absolute top-1 right-1 h-6 w-6 rounded-full"
                                    onClick={() => removeImage("aadhar")}
                                >
                                    <X className="h-3 w-3" />
                                </Button>
                                <p className="mt-1 text-xs text-gray-500 text-center">
                                    Full-size image will be uploaded
                                </p>
                            </div>
                        ) : (
                            <div className="flex items-center gap-2 mt-2">
                                <Input
                                    ref={aadharInputRef}
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => handleFileChange(e, "aadhar")}
                                    className={errors.aadharImg ? "border-red-500" : ""}
                                />
                                <FileUp className="text-gray-500 flex-shrink-0" />
                            </div>
                        )}
                        {errors.aadharImg && (
                            <p className="text-red-500 text-sm mt-1">{errors.aadharImg}</p>
                        )}
                    </div>

                    {/* Upload Selfie */}
                    <div>
                        <Label>Upload Selfie *</Label>
                        {selfiePreview ? (
                            <div className="relative mt-2 inline-block">
                                {/* Small 120x120 Thumbnail */}
                                <img
                                    src={selfiePreview}
                                    alt="Selfie preview"
                                    className="w-32 h-32 object-cover rounded-lg border-2 border-gray-300 shadow-sm"
                                />
                                <Button
                                    type="button"
                                    variant="destructive"
                                    size="icon"
                                    className="absolute top-1 right-1 h-6 w-6 rounded-full"
                                    onClick={() => removeImage("selfie")}
                                >
                                    <X className="h-3 w-3" />
                                </Button>
                                <p className="mt-1 text-xs text-gray-500 text-center">
                                    Full-size image will be uploaded
                                </p>
                            </div>
                        ) : (
                            <div className="flex items-center gap-2 mt-2">
                                <Input
                                    ref={selfieInputRef}
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => handleFileChange(e, "selfie")}
                                    className={errors.selfieImg ? "border-red-500" : ""}
                                />
                                <FileUp className="text-gray-500 flex-shrink-0" />
                            </div>
                        )}
                        {errors.selfieImg && (
                            <p className="text-red-500 text-sm mt-1">{errors.selfieImg}</p>
                        )}
                    </div>

                    {/* Submit Buttons */}
                    <div className="pt-3 flex justify-end gap-3">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => onOpenChange(false)}
                            className="rounded-xl px-6"
                        >
                            Cancel
                        </Button>
                        <Button
                            className="rounded-xl px-6 bg-blue-600 hover:bg-blue-700"
                            onClick={handleSubmit}
                        >
                            Submit KYC
                        </Button>
                    </div>
                </div>

                {/* Reusable Cropper Modal */}
                {cropImage && cropType && (
                    <ImageCropper
                        imageSrc={cropImage}
                        aspect={cropType === "aadhar" ? 16 / 9 : 1}
                        onSave={handleCropSave}
                        onCancel={handleCropCancel}
                    />
                )}
            </DialogContent>
        </Dialog>
    )
}