import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "../../components/ui/dialog"
import { Button } from "../../components/ui/button"
import { Input } from "../../components/ui/input"
import { Label } from "../../components/ui/label"
import { Pencil } from "lucide-react"
import { useState, useEffect } from "react"
import { toast } from "react-hot-toast"
import { z } from "zod"
import { useInvestorProfileUpdate } from "../../hooks/Investor/Profile/InvestorProfileHooks"
import { useDispatch } from "react-redux"
import { updateUserData } from "../../store/Slice/authDataSlice"
import { queryClient } from "../../main"

const investorSchema = z.object({
    profileImg: z.instanceof(File).optional(),
    userName: z.string().min(2, "Full name is required").trim(),
    bio: z.string().trim().optional(),
    website: z.string().trim().url("Invalid URL").optional().or(z.literal("")),
    companyName: z.string().trim().optional(),
    experience: z.preprocess((val) => {
        if (val === "" || val === undefined || val === null) return undefined;
        return Number(val);
    }, z.number().optional()),
    location: z.string().trim().optional(),
    investmentMin: z.preprocess((val) => {
        if (val === "" || val === undefined || val === null) return undefined;
        return Number(val);
    }, z.number().optional()),
    investmentMax: z.preprocess((val) => {
        if (val === "" || val === undefined || val === null) return undefined;
        return Number(val);
    }, z.number().optional()),
})

export type InvestorProfileEditData = z.infer<typeof investorSchema>

interface InvestorEditProfileModalProps {
    data: {
        profileImg?: string
        userName: string
        bio?: string
        website?: string
        companyName?: string
        experience?: number
        location?: string
        investmentMin?: number
        investmentMax?: number
    }
    investorId: string
    open: boolean
    onOpenChange: (open: boolean) => void
}

export default function InvestorEditProfileModal({
    data,
    investorId,
    open,
    onOpenChange,
}: InvestorEditProfileModalProps) {
    const [formData, setFormData] = useState({
        userName: data?.userName || "",
        bio: data?.bio || "",
        website: data?.website || "",
        companyName: data?.companyName || "",
        experience: data?.experience || 0,
        location: data?.location || "",
        investmentMin: data?.investmentMin || 0,
        investmentMax: data?.investmentMax || 0,
    })

    const [errors, setErrors] = useState<Record<string, string>>({})
    const [preview, setPreview] = useState<string | null>(data?.profileImg || null)
    const [selectedImage, setSelectedImage] = useState<File | null>(null)
    const [hasImageChanged, setHasImageChanged] = useState(false)
    const { mutate: UpdateInvestorProfile } = useInvestorProfileUpdate()
    const dispatch = useDispatch()

    // Set initial preview from signed URL
    useEffect(() => {
        if (data?.profileImg) {
            setPreview(data.profileImg)
            setHasImageChanged(false)
        }
    }, [data?.profileImg])

    // Cleanup preview URL on unmount (only for blob URLs)
    useEffect(() => {
        return () => {
            if (preview && preview.startsWith('blob:')) {
                URL.revokeObjectURL(preview)
            }
        }
    }, [preview])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setFormData((prev) => ({ ...prev, [name]: value }))
        // Clear error for this field when user starts typing
        if (errors[name]) {
            setErrors((prev) => {
                const newErrors = { ...prev }
                delete newErrors[name]
                return newErrors
            })
        }
    }

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            // Validate file type
            if (!file.type.startsWith('image/')) {
                toast.error("Please select an image file")
                return
            }

            // Validate file size (e.g., max 5MB)
            if (file.size > 5 * 1024 * 1024) {
                toast.error("Image size should be less than 5MB")
                return
            }

            // Clean up previous blob URL if it exists
            if (preview && preview.startsWith('blob:')) {
                URL.revokeObjectURL(preview)
            }

            setSelectedImage(file)
            setPreview(URL.createObjectURL(file))
            setHasImageChanged(true)
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        try {
            const dataToValidate = {
                ...formData,
                profileImg: selectedImage || undefined,
            }

            const validatedData = investorSchema.parse(dataToValidate)

            const formDataToSend = new FormData()

            formDataToSend.append("id", investorId)
            formDataToSend.append("formData", JSON.stringify(formData))
            if (hasImageChanged && selectedImage)
                formDataToSend.append("profileImg", selectedImage)


            UpdateInvestorProfile(
                formDataToSend,
                {
                    onSuccess: (res) => {
                        console.log(res)
                        dispatch(updateUserData(res.data.response))
                        toast.success(res.message)
                        queryClient.invalidateQueries({ queryKey: ["investorProfile"] })
                        queryClient.invalidateQueries({ queryKey: ["profileImg"] })
                    },
                    onError: (err) => {
                        toast.error(err.message)
                    }
                }
            )

            console.log("Validated Data:", validatedData)
            onOpenChange(false)
        } catch (err) {
            if (err instanceof z.ZodError) {
                const newErrors: Record<string, string> = {}
                err.issues.forEach((error) => {
                    if (error.path[0]) {
                        newErrors[error.path[0] as string] = error.message
                    }
                })
                setErrors(newErrors)
                console.error("Validation errors:", err.issues)
                toast.error("Please correct the errors before saving.")
            } else {
                console.error("Error:", err)
                toast.error("Something went wrong!")
            }
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-lg max-h-[90vh] bg-sky-50 p-6 rounded-2xl overflow-hidden flex flex-col">
                <DialogHeader>
                    <DialogTitle className="text-xl font-semibold">
                        Edit Your Profile
                    </DialogTitle>
                </DialogHeader>

                <form
                    onSubmit={handleSubmit}
                    className="space-y-4 mt-4 overflow-y-auto overflow-x-hidden"
                    style={{
                        scrollbarWidth: 'none',
                        msOverflowStyle: 'none',
                    }}
                >
                    <style>{`
                        form::-webkit-scrollbar {
                            display: none;
                        }
                    `}</style>

                    <div className="flex flex-col items-center space-y-3">
                        <div className="relative">
                            <img
                                src={preview || "/default-avatar.png"}
                                alt="Profile"
                                className="w-24 h-24 rounded-full object-cover border-2 border-gray-300"
                            />
                            <label
                                htmlFor="profileImg"
                                className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full cursor-pointer hover:bg-blue-700 transition-colors"
                            >
                                <Pencil size={14} />
                            </label>

                            <input
                                type="file"
                                id="profileImg"
                                name="profileImg"
                                accept="image/*"
                                onChange={handleFileChange}
                                className="hidden"
                            />
                        </div>
                        {errors.profileImg && (
                            <p className="text-red-500 text-sm">{errors.profileImg}</p>
                        )}
                    </div>

                    <div>
                        <Label>Full Name *</Label>
                        <Input
                            name="userName"
                            value={formData.userName}
                            onChange={handleChange}
                            placeholder="Enter your name"
                        />
                        {errors.userName && (
                            <p className="text-red-500 text-sm mt-1">{errors.userName}</p>
                        )}
                    </div>

                    <div>
                        <Label>Bio</Label>
                        <Input
                            name="bio"
                            value={formData.bio}
                            onChange={handleChange}
                            placeholder="Short bio..."
                        />
                    </div>

                    <div>
                        <Label>Website</Label>
                        <Input
                            name="website"
                            value={formData.website}
                            onChange={handleChange}
                            placeholder="https://example.com"
                        />
                        {errors.website && (
                            <p className="text-red-500 text-sm mt-1">{errors.website}</p>
                        )}
                    </div>

                    <div>
                        <Label>Company/Firm</Label>
                        <Input
                            name="companyName"
                            value={formData.companyName}
                            onChange={handleChange}
                            placeholder="Company name"
                        />
                    </div>

                    <div>
                        <Label>Years of Experience</Label>
                        <Input
                            name="experience"
                            type="number"
                            value={formData.experience}
                            onChange={handleChange}
                            placeholder="e.g. 9"
                        />
                    </div>

                    <div>
                        <Label>Location</Label>
                        <Input
                            name="location"
                            value={formData.location}
                            onChange={handleChange}
                            placeholder="Bangalore, India"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <Label>Minimum Amount</Label>
                            <Input
                                name="investmentMin"
                                type="number"
                                value={formData.investmentMin}
                                onChange={handleChange}
                                placeholder="200000"
                            />
                        </div>
                        <div>
                            <Label>Maximum Amount</Label>
                            <Input
                                name="investmentMax"
                                type="number"
                                value={formData.investmentMax}
                                onChange={handleChange}
                                placeholder="2000000"
                            />
                        </div>
                    </div>

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
                            type="submit"
                            className="rounded-xl px-6 bg-blue-600 hover:bg-blue-700"
                        >
                            Save Changes
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}