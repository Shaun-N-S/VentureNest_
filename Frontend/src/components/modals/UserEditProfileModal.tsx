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
import { useUserProfileUpdate } from "../../hooks/User/Profile/UserProfileHooks"
import { useDispatch } from "react-redux"
import { updateUserData } from "../../store/Slice/authDataSlice"
import { queryClient } from "../../main"
import ImageCropper from "../cropper/ImageCropper"
import type { UserProfileApiResponse } from "../../types/userProfileApiResponse"

const userSchema = z.object({
    profileImg: z.instanceof(File).optional(),
    userName: z.string().trim().min(2, "Full name is required"),
    bio: z.string().trim().optional(),
    website: z.string().trim().url("Invalid URL").optional(),
    linkedInUrl: z.string().trim().url("Invalid LinkedIn URL").optional(),
})


export type UserProfileEditData = z.infer<typeof userSchema>

interface UserEditProfileModalProps {
    data: {
        profileImg?: string
        userName: string
        bio?: string
        website?: string
        linkedInUrl?: string
    }
    open: boolean
    onOpenChange: (open: boolean) => void
    userId: string
}

export default function UserEditProfileModal({
    data,
    open,
    onOpenChange,
    userId,
}: UserEditProfileModalProps) {
    const [formData, setFormData] = useState({
        userName: data?.userName || "",
        bio: data?.bio || "",
        website: data?.website || "",
        linkedInUrl: data?.linkedInUrl || "",
    })

    const [errors, setErrors] = useState<Record<string, string>>({})
    const [preview, setPreview] = useState<string | null>(data?.profileImg || null)
    const [selectedImage, setSelectedImage] = useState<File | null>(null)
    const [hasImageChanged, setHasImageChanged] = useState(false)
    const [showCropper, setShowCropper] = useState(false);
    const [tempImage, setTempImage] = useState<string | null>(null);

    const { mutate: updateUserProfile } = useUserProfileUpdate()
    const dispatch = useDispatch()

    useEffect(() => {
        if (data?.profileImg) {
            setPreview(data.profileImg)
            setHasImageChanged(false)
        }
    }, [data?.profileImg])

    useEffect(() => {
        if (open && data) {
            setFormData({
                userName: data.userName || "",
                bio: data.bio || "",
                website: data.website || "",
                linkedInUrl: data.linkedInUrl || "",
            });

            setPreview(data.profileImg || null);
            setSelectedImage(null);
            setHasImageChanged(false);
        }
    }, [data, open]);


    useEffect(() => {
        return () => {
            if (preview && preview.startsWith("blob:")) {
                URL.revokeObjectURL(preview)
            }
        }
    }, [preview])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setFormData((prev) => ({ ...prev, [name]: value }))
        if (errors[name]) {
            setErrors((prev) => {
                const newErrors = { ...prev }
                delete newErrors[name]
                return newErrors
            })
        }
    }

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (!file.type.startsWith("image/")) {
            toast.error("Please select an image file");
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            toast.error("Image must be less than 5MB");
            return;
        }

        const url = URL.createObjectURL(file);
        setTempImage(url);

        // Open cropper
        setShowCropper(true);
    };

    const hasFormChanged = () => {
        const isTextChanged =
            formData.userName !== (data.userName || "") ||
            (formData.bio || "") !== (data.bio || "") ||
            (formData.website || "") !== (data.website || "") ||
            (formData.linkedInUrl || "") !== (data.linkedInUrl || "");

        const isImageChanged = hasImageChanged;

        return isTextChanged || isImageChanged;
    };


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!hasFormChanged()) {
            toast("No changes to update.");
            onOpenChange(false);
            return;
        }

        try {
            const cleanedFormData = Object.fromEntries(
                Object.entries(formData).map(([key, value]) => [
                    key,
                    value === "" ? undefined : value,
                ])
            )

            const dataToValidate = {
                ...cleanedFormData,
                profileImg: selectedImage || undefined,
            }

            userSchema.parse(dataToValidate);

            const formDataToSend = new FormData()
            formDataToSend.append("id", userId)
            formDataToSend.append("formData", JSON.stringify(cleanedFormData));


            if (hasImageChanged && selectedImage) {
                formDataToSend.append("profileImg", selectedImage)
            }

            updateUserProfile(formDataToSend, {
                onSuccess: (res) => {
                    toast.success(res.message);

                    dispatch(updateUserData(res.data));

                    queryClient.setQueryData<UserProfileApiResponse>(
                        ["userProfile"],
                        (oldData) => {
                            if (!oldData) return oldData;

                            return {
                                ...oldData,
                                data: {
                                    ...oldData.data,
                                    ...cleanedFormData,
                                    profileImg: hasImageChanged && selectedImage
                                        ? res.data.profileImg
                                        : oldData.data.profileImg,
                                }
                            };
                        }
                    );

                    onOpenChange(false);
                },
                onError: (err) => toast.error(err.message),
            })
        } catch (err) {
            if (err instanceof z.ZodError) {
                const newErrors: Record<string, string> = {}
                err.issues.forEach((error) => {
                    if (error.path[0]) newErrors[error.path[0] as string] = error.message
                })
                setErrors(newErrors)
                toast.error("Please correct the errors before saving.")
            } else {
                toast.error("Something went wrong!")
            }
        }
    }


    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-lg max-h-[90vh] bg-sky-50 p-6 rounded-2xl overflow-hidden flex flex-col">
                <DialogHeader>
                    <DialogTitle className="text-xl font-semibold">Edit Profile</DialogTitle>
                </DialogHeader>

                <form
                    onSubmit={handleSubmit}
                    className="space-y-4 mt-4 overflow-y-auto overflow-x-hidden"
                    style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
                >
                    <style>{`
            form::-webkit-scrollbar {
              display: none;
            }
          `}</style>

                    {/* Profile Image */}
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
                        {errors.profileImg && <p className="text-red-500 text-sm">{errors.profileImg}</p>}
                    </div>

                    {/* Full Name */}
                    <div>
                        <Label>Full Name *</Label>
                        <Input
                            name="userName"
                            value={formData.userName}
                            onChange={handleChange}
                            placeholder="Enter your name"
                        />
                        {errors.userName && <p className="text-red-500 text-sm mt-1">{errors.userName}</p>}
                    </div>

                    {/* Bio */}
                    <div>
                        <Label>Bio</Label>
                        <Input
                            name="bio"
                            value={formData.bio}
                            onChange={handleChange}
                            placeholder="Short bio..."
                        />
                    </div>

                    {/* Website */}
                    <div>
                        <Label>Website</Label>
                        <Input
                            name="website"
                            value={formData.website}
                            onChange={handleChange}
                            placeholder="https://example.com"
                        />
                        {errors.website && <p className="text-red-500 text-sm mt-1">{errors.website}</p>}
                    </div>

                    {/* LinkedIn */}
                    <div>
                        <Label>LinkedIn URL</Label>
                        <Input
                            name="linkedInUrl"
                            value={formData.linkedInUrl}
                            onChange={handleChange}
                            placeholder="https://linkedin.com/in/username"
                        />
                        {errors.linkedInUrl && <p className="text-red-500 text-sm mt-1">{errors.linkedInUrl}</p>}
                    </div>

                    {/* Buttons */}
                    <div className="pt-3 flex justify-end gap-3">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => onOpenChange(false)}
                            className="rounded-xl px-6"
                        >
                            Cancel
                        </Button>
                        <Button type="submit" className="rounded-xl px-6 bg-blue-600 hover:bg-blue-700">
                            Save Changes
                        </Button>
                    </div>
                </form>
                {showCropper && tempImage && (
                    <ImageCropper
                        imageSrc={tempImage}
                        aspect={1}
                        onCancel={() => {
                            setShowCropper(false);
                            URL.revokeObjectURL(tempImage);
                        }}
                        onSave={(croppedFile, previewUrl) => {
                            setSelectedImage(croppedFile);
                            setPreview(previewUrl);
                            setHasImageChanged(true);
                            setShowCropper(false);
                            URL.revokeObjectURL(tempImage);
                        }}
                    />
                )}

            </DialogContent>
        </Dialog>
    )
}
