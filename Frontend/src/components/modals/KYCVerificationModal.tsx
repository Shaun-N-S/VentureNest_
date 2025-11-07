import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "../../components/ui/dialog"
import { Button } from "../../components/ui/button"
import { Input } from "../../components/ui/input"
import { Label } from "../../components/ui/label"
import { AlertCircle, FileUp, Calendar } from "lucide-react"
import { useState, useCallback } from "react"
import Cropper from "react-easy-crop"
import type { Area, Point } from "react-easy-crop"
import { toast } from "react-hot-toast"
import { z } from "zod"
import { Popover, PopoverTrigger, PopoverContent } from "../../components/ui/popover"
import { Calendar as CalendarComponent } from "../../components/ui/calendar"
import { format } from "date-fns"

const kycSchema = z.object({
    dateOfBirth: z
        .date()
        .refine((val) => !!val, { message: "Date of birth required" }),
    phoneNumber: z.string().min(10, "Enter a valid phone number"),
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
    const [aadharImg, setAadharImg] = useState<File | null>(null)
    const [selfieImg, setSelfieImg] = useState<File | null>(null)

    // Crop states
    const [cropImage, setCropImage] = useState<string | null>(null)
    const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null)
    const [cropType, setCropType] = useState<"aadhar" | "selfie" | null>(null)
    const [zoom, setZoom] = useState(1)
    const [crop, setCrop] = useState<Point>({ x: 0, y: 0 })

    const onCropComplete = useCallback((_: Area, croppedArea: Area) => {
        setCroppedAreaPixels(croppedArea)
    }, [])

    const handleFileChange = (
        e: React.ChangeEvent<HTMLInputElement>,
        type: "aadhar" | "selfie"
    ) => {
        const file = e.target.files?.[0]
        if (file) {
            setCropType(type)
            const reader = new FileReader()
            reader.onload = () => setCropImage(reader.result as string)
            reader.readAsDataURL(file)
        }
    }

    const getCroppedImg = async (imageSrc: string, crop: Area): Promise<File> => {
        const image = document.createElement("img")
        image.src = imageSrc
        await new Promise((resolve) => (image.onload = resolve))

        const canvas = document.createElement("canvas")
        const ctx = canvas.getContext("2d") as CanvasRenderingContext2D
        canvas.width = crop.width
        canvas.height = crop.height
        ctx.drawImage(image, crop.x, crop.y, crop.width, crop.height, 0, 0, crop.width, crop.height)

        return new Promise<File>((resolve) => {
            canvas.toBlob((blob) => {
                if (blob) {
                    resolve(new File([blob], "cropped.jpg", { type: "image/jpeg" }))
                }
            }, "image/jpeg")
        })
    }

    const handleCropSave = async () => {
        if (!cropImage || !croppedAreaPixels || !cropType) return
        const croppedFile = await getCroppedImg(cropImage, croppedAreaPixels)
        if (cropType === "aadhar") setAadharImg(croppedFile)
        else setSelfieImg(croppedFile)
        setCropImage(null)
    }

    const handleSubmit = () => {
        const data: KYCFormData = {
            dateOfBirth: formData.dateOfBirth!,
            phoneNumber: formData.phoneNumber,
            address: formData.address,
            aadharImg: aadharImg!,
            selfieImg: selfieImg!,
        }

        const validation = kycSchema.safeParse(data)
        if (!validation.success) {
            toast.error(validation.error.issues[0].message)
            return
        }
        console.log(validation.data)

        toast.success("KYC submitted successfully!")
        onOpenChange(false)
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-lg bg-sky-50 rounded-2xl p-6">
                <DialogHeader>
                    <DialogTitle className="text-center text-2xl font-semibold">Verify Your Account</DialogTitle>
                </DialogHeader>

                <div className="flex items-start gap-2 text-sm text-muted-foreground mb-3">
                    <AlertCircle className="h-5 w-5 text-blue-500" />
                    <p>We require verification using a government-issued ID and a selfie.</p>
                </div>

                {/* Form */}
                <div className="space-y-4">
                    {/* Date Picker */}
                    <div>
                        <Label>Date of Birth</Label>
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button
                                    variant="outline"
                                    className="w-full justify-start text-left font-normal"
                                >
                                    {formData.dateOfBirth ? (
                                        format(formData.dateOfBirth, "dd/MM/yyyy")
                                    ) : (
                                        <span>Select date</span>
                                    )}
                                    <Calendar className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="p-0">
                                <CalendarComponent
                                    mode="single"
                                    selected={formData.dateOfBirth}
                                    onSelect={(date) => setFormData({ ...formData, dateOfBirth: date })}
                                    initialFocus
                                />
                            </PopoverContent>
                        </Popover>
                    </div>

                    <div>
                        <Label>Phone Number</Label>
                        <Input
                            placeholder="Enter phone number"
                            value={formData.phoneNumber}
                            onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                        />
                    </div>

                    <div>
                        <Label>Address</Label>
                        <Input
                            placeholder="Enter address"
                            value={formData.address}
                            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                        />
                    </div>

                    <div>
                        <Label>Upload Aadhar Image</Label>
                        <div className="flex items-center gap-2">
                            <Input type="file" accept="image/*" onChange={(e) => handleFileChange(e, "aadhar")} />
                            <FileUp className="text-gray-500" />
                        </div>
                    </div>

                    <div>
                        <Label>Upload Selfie</Label>
                        <div className="flex items-center gap-2">
                            <Input type="file" accept="image/*" onChange={(e) => handleFileChange(e, "selfie")} />
                            <FileUp className="text-gray-500" />
                        </div>
                    </div>

                    <Button className="w-full mt-3" onClick={handleSubmit}>
                        Submit
                    </Button>
                </div>

                {/* Crop Modal */}
                {cropImage && (
                    <div className="fixed inset-0 bg-black/70 flex flex-col items-center justify-center z-50">
                        <div className="relative w-[90%] sm:w-[400px] h-[400px] bg-black rounded-lg overflow-hidden">
                            <Cropper
                                image={cropImage}
                                crop={crop}
                                zoom={zoom}
                                aspect={1}
                                onCropChange={setCrop}
                                onZoomChange={setZoom}
                                onCropComplete={onCropComplete}
                            />
                        </div>
                        <div className="flex gap-3 mt-4">
                            <Button variant="secondary" onClick={() => setCropImage(null)}>
                                Cancel
                            </Button>
                            <Button onClick={handleCropSave}>Save Crop</Button>
                        </div>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    )
}
