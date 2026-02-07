import type React from "react"
import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Upload } from "lucide-react"
import { Button } from "../../components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../../components/ui/dialog"
import { Input } from "../../components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select"
import toast from "react-hot-toast"
import { PROJECT_ROLES } from "../../types/projectRole"
import { TEAM_SIZES } from "../../types/teamSize"
import { STAGES } from "../../types/StartupStages"
import { SECTOR } from "../../types/PreferredSector"
import ImageCropper from "../cropper/ImageCropper"
import type { ProjectType } from "../../types/projectType"

const projectFormSchema = z.object({
    startupName: z.string().min(2, "Startup name must be at least 2 characters"),
    shortDescription: z
        .string()
        .min(10, "Description must be at least 10 characters")
        .max(500, "Description must not exceed 500 characters"),
    pitchDeck: z.instanceof(File).optional(),
    websiteUrl: z.string().url("Invalid URL").optional().or(z.literal("")),
    yourRole: z.string().min(1, "Please select a role"),
    teamSize: z.string().min(1, "Please select team size"),
    startupCategory: z.string().min(1, "Please select a category"),
    startupStage: z.string().min(1, "Please select a stage"),
    logo: z.instanceof(File).optional(),
    coverImage: z.instanceof(File).optional(),
    location: z.string().min(1, "Location is required"),
})

export type ProjectFormData = z.infer<typeof projectFormSchema>

interface AddProjectModalProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    onSubmit: (formData: FormData) => Promise<void>
    isEditing?: boolean;
    initialData?: ProjectType | null;
}

export default function AddProjectModal({ open, onOpenChange, onSubmit, isEditing = false, initialData }: AddProjectModalProps) {
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [pitchFileName, setPitchFileName] = useState<string>("")
    const [logoPreview, setLogoPreview] = useState<string>("")
    const [coverPreview, setCoverPreview] = useState<string>("")
    const [cropImage, setCropImage] = useState<string | null>(null)
    const [cropType, setCropType] = useState<"logo" | "cover" | null>(null)


    const form = useForm<ProjectFormData>({
        resolver: zodResolver(projectFormSchema),
        mode: "onChange",
        defaultValues: {
            startupName: "",
            shortDescription: "",
            yourRole: "",
            teamSize: "",
            startupCategory: "",
            startupStage: "",
            location: "",
            websiteUrl: "",
        },
    })


    useEffect(() => {
        if (isEditing && initialData) {
            form.reset({
                startupName: initialData.startupName || "",
                shortDescription: initialData.shortDescription || "",
                yourRole: initialData.userRole || "",
                teamSize: initialData.teamSize || "",
                startupCategory: initialData.category || "",
                startupStage: initialData.stage || "",
                location: initialData.location || "",
                websiteUrl: initialData.projectWebsite || "",
            });

            setLogoPreview(initialData.logoUrl || "");
            setCoverPreview(initialData.coverImageUrl || "");

            if (initialData.pitchDeckUrl) {
                const filename = initialData.pitchDeckUrl.split("/").pop();
                setPitchFileName(filename ?? "");
            }
        }
    }, [isEditing, initialData, form]);



    const handleFileChange = (
        e: React.ChangeEvent<HTMLInputElement>,
        fieldName: "pitchDeck" | "logo" | "coverImage",
    ) => {
        const file = e.target.files?.[0]
        if (file) {
            if (fieldName === "pitchDeck" && file.size > 10 * 1024 * 1024) {
                toast.error("Pitch deck must be less than 10MB")
                return
            }
            if (fieldName === "logo" || fieldName === "coverImage") {
                const file = e.target.files?.[0]
                if (!file) return

                if (file.size > 5 * 1024 * 1024) {
                    toast.error("Image must be less than 5MB")
                    return
                }

                const reader = new FileReader()
                reader.onload = () => {
                    setCropImage(reader.result as string)
                    setCropType(fieldName === "logo" ? "logo" : "cover")
                }
                reader.readAsDataURL(file)
                return
            }

            form.setValue(fieldName, file)

            if (fieldName === "pitchDeck") {
                if (file.size > 10 * 1024 * 1024) {
                    toast.error("Pitch deck must be less than 10MB")
                    return
                }
                setPitchFileName(file.name)
            }

        }
    }

    const handleCropSave = (croppedFile: File, previewUrl: string) => {
        if (!cropType) return

        if (cropType === "logo") {
            form.setValue("logo", croppedFile)
            setLogoPreview(previewUrl)
        } else if (cropType === "cover") {
            form.setValue("coverImage", croppedFile)
            setCoverPreview(previewUrl)
        }

        // Close cropper
        setCropType(null)
        setCropImage(null)
    }

    const handleCropCancel = () => {
        setCropType(null)
        setCropImage(null)
    }


    const handleSubmit = async (data: ProjectFormData) => {
        try {
            setIsSubmitting(true)

            const formData = new FormData();

            if (isEditing && initialData?._id) {
                formData.append("projectId", initialData._id);
            }

            formData.append("startupName", data.startupName)
            formData.append("shortDescription", data.shortDescription)
            formData.append("userRole", data.yourRole)
            formData.append("teamSize", data.teamSize)
            formData.append("category", data.startupCategory)
            formData.append("stage", data.startupStage)
            formData.append("location", data.location)
            formData.append("projectWebsite", data.websiteUrl || "")

            if (data.pitchDeck) formData.append("pitchDeckUrl", data.pitchDeck)
            if (data.logo) formData.append("logoUrl", data.logo)
            if (data.coverImage) formData.append("coverImageUrl", data.coverImage)

            await onSubmit(formData)
            if (!isEditing) {
                form.reset();
                setLogoPreview("");
                setCoverPreview("");
            }
            onOpenChange(false)
            toast.success(isEditing ? "Project updated successfully!" : "Project launched successfully!")
        } catch (error) {
            toast.error("Failed to submit project")
            console.error(error)
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <>
            <Dialog open={open} onOpenChange={onOpenChange} >
                <DialogContent className="w-full max-w-2xl max-h-[90vh] overflow-y-scroll scrollbar-hide">
                    <DialogHeader>
                        <DialogTitle className="text-2xl md:text-3xl font-bold text-center">
                            Transform Your Idea Into Reality
                        </DialogTitle>
                        <p className="text-center text-sm text-muted-foreground mt-2">
                            Pitch your startup, upload your deck, inspire the world.
                        </p>
                    </DialogHeader>
                    <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
                        <Controller
                            control={form.control}
                            name="startupName"
                            render={({ field, fieldState: { error } }) => (
                                <div>
                                    <label className="block text-sm font-medium mb-2">Startup Name</label>
                                    <Input placeholder="Enter startup name" {...field} />
                                    {error && <p className="text-red-500 text-xs mt-1">{error.message}</p>}
                                </div>
                            )}
                        />
                        <Controller
                            control={form.control}
                            name="shortDescription"
                            render={({ field, fieldState: { error } }) => (
                                <div>
                                    <label className="block text-sm font-medium mb-2">Short Description</label>
                                    <textarea
                                        placeholder="Describe your startup in a few words"
                                        className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                                        rows={3}
                                        {...field}
                                    />
                                    {error && <p className="text-red-500 text-xs mt-1">{error.message}</p>}
                                </div>
                            )}
                        />
                        <Controller
                            control={form.control}
                            name="pitchDeck"
                            render={({ fieldState: { error } }) => (
                                <div>
                                    <label className="block text-sm font-medium mb-2">Pitch Deck (10 mb max)</label>
                                    <div className="flex items-center gap-2 p-4 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-gray-400 transition">
                                        {/* <Upload className="h-5 w-5 text-gray-500" /> */}
                                        <label className="cursor-pointer flex-1">
                                            {pitchFileName ? (
                                                <div className="flex flex-col items-center">
                                                    <Upload className="h-6 w-6 text-blue-600 mb-2" />
                                                    <p className="text-sm font-medium text-gray-800">{pitchFileName}</p>
                                                    <p className="text-xs text-gray-500">Click to change file</p>
                                                </div>
                                            ) : (
                                                <div className="text-center">
                                                    <Upload className="h-6 w-6 text-gray-500 mx-auto mb-2" />
                                                    <span className="text-sm text-gray-600 ">Upload a PDF</span>
                                                </div>
                                            )}
                                            <input
                                                type="file"
                                                accept=".pdf"
                                                onChange={(e) => handleFileChange(e, "pitchDeck")}
                                                className="hidden"
                                            />
                                        </label>
                                    </div>
                                    {error && <p className="text-red-500 text-xs mt-1">{error.message}</p>}
                                </div>
                            )}
                        />
                        <Controller
                            control={form.control}
                            name="websiteUrl"
                            render={({ field, fieldState: { error } }) => (
                                <div>
                                    <label className="block text-sm font-medium mb-2">Website / Prototype URL (Optional)</label>
                                    <Input placeholder="https://example.com" type="url" {...field} />
                                    {error && <p className="text-red-500 text-xs mt-1">{error.message}</p>}
                                </div>
                            )}
                        />
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Controller
                                control={form.control}
                                name="yourRole"
                                render={({ field, fieldState: { error } }) => (
                                    <div>
                                        <label className="block text-sm font-medium mb-2">Your Role</label>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select role" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {
                                                    PROJECT_ROLES.map((role) => <SelectItem value={role} >{role}</SelectItem>)
                                                }
                                            </SelectContent>
                                        </Select>
                                        {error && <p className="text-red-500 text-xs mt-1">{error.message}</p>}
                                    </div>
                                )}
                            />
                            <Controller
                                control={form.control}
                                name="teamSize"
                                render={({ field, fieldState: { error } }) => (
                                    <div>
                                        <label className="block text-sm font-medium mb-2">Team Size</label>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select team size" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {
                                                    TEAM_SIZES.map((size) => <SelectItem value={size} > {size}</SelectItem>)
                                                }
                                            </SelectContent>
                                        </Select>
                                        {error && <p className="text-red-500 text-xs mt-1">{error.message}</p>}
                                    </div>
                                )}
                            />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Controller
                                control={form.control}
                                name="startupCategory"
                                render={({ field, fieldState: { error } }) => (
                                    <div>
                                        <label className="block text-sm font-medium mb-2">Startup Category</label>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select category" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {
                                                    SECTOR.map((sector) => <SelectItem value={sector}>{sector}</SelectItem>)
                                                }
                                            </SelectContent>
                                        </Select>
                                        {error && <p className="text-red-500 text-xs mt-1">{error.message}</p>}
                                    </div>
                                )}
                            />
                            <Controller
                                control={form.control}
                                name="startupStage"
                                render={({ field, fieldState: { error } }) => (
                                    <div>
                                        <label className="block text-sm font-medium mb-2">Startup Stage</label>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select stage" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {
                                                    STAGES.map((stage) => <SelectItem value={stage}>{stage}</SelectItem>)
                                                }
                                            </SelectContent>
                                        </Select>
                                        {error && <p className="text-red-500 text-xs mt-1">{error.message}</p>}
                                    </div>
                                )}
                            />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Controller
                                control={form.control}
                                name="logo"
                                render={({ fieldState: { error } }) => (
                                    <div>
                                        <label className="block text-sm font-medium mb-2">Logo</label>
                                        <label className="flex items-center justify-center w-full h-40 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-gray-400 transition bg-gray-50 p-2">
                                            {logoPreview ? (
                                                <img
                                                    src={logoPreview}
                                                    alt="Logo preview"
                                                    className="w-full h-full object-contain rounded"
                                                />
                                            ) : (
                                                <div className="text-center">
                                                    <Upload className="h-6 w-6 text-gray-500 mx-auto mb-2" />
                                                    <span className="text-sm text-gray-600">Upload logo</span>
                                                </div>
                                            )}
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={(e) => handleFileChange(e, "logo")}
                                                className="hidden"
                                            />
                                        </label>
                                        {error && <p className="text-red-500 text-xs mt-1">{error.message}</p>}
                                    </div>
                                )}
                            />
                            <Controller
                                control={form.control}
                                name="coverImage"
                                render={({ fieldState: { error } }) => (
                                    <div>
                                        <label className="block text-sm font-medium mb-2">Cover Image</label>
                                        <label className="flex items-center justify-center w-full h-40 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-gray-400 transition bg-gray-50 p-2">
                                            {coverPreview ? (
                                                <img
                                                    src={coverPreview}
                                                    alt="Cover preview"
                                                    className="w-full h-full object-contain rounded"
                                                />
                                            ) : (
                                                <div className="text-center">
                                                    <Upload className="h-6 w-6 text-gray-500 mx-auto mb-2" />
                                                    <span className="text-sm text-gray-600">Upload cover</span>
                                                </div>
                                            )}
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={(e) => handleFileChange(e, "coverImage")}
                                                className="hidden"
                                            />
                                        </label>

                                        {error && <p className="text-red-500 text-xs mt-1">{error.message}</p>}
                                    </div>
                                )}
                            />
                        </div>

                        <Controller
                            control={form.control}
                            name="location"
                            render={({ field, fieldState: { error } }) => (
                                <div>
                                    <label className="block text-sm font-medium mb-2">Location</label>
                                    <Input placeholder="City, Country" {...field} />
                                    {error && <p className="text-red-500 text-xs mt-1">{error.message}</p>}
                                </div>
                            )}
                        />
                        {/* <Controller
                            control={form.control}
                            name="enableDonation"
                            render={({ field }) => (
                                <div className="flex items-center gap-2">
                                    <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                                    <label className="text-sm cursor-pointer">Enable donation option (verify your account first)</label>
                                </div>
                            )}
                        /> */}
                        {/* <AnimatePresence>
                            {form.watch("enableDonation") && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: "auto" }}
                                    exit={{ opacity: 0, height: 0 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    <Controller
                                        control={form.control}
                                        name="donationAmount"
                                        render={({ field, fieldState: { error } }) => (
                                            <div>
                                                <label className="block text-sm font-medium mb-2">Enter amount (max 100,000)</label>
                                                <Input
                                                    type="number"
                                                    placeholder="50,000"
                                                    {...field}
                                                    onChange={(e) => field.onChange(e.target.value ? Number.parseInt(e.target.value) : undefined)}
                                                />
                                                {error && <p className="text-red-500 text-xs mt-1">{error.message}</p>}
                                            </div>
                                        )}
                                    />
                                </motion.div>
                            )}
                        </AnimatePresence> */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.2 }}
                            className="flex gap-3 pt-6"
                        >
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => onOpenChange(false)}
                                disabled={isSubmitting}
                                className="flex-1"
                            >
                                Cancel
                            </Button>
                            <Button type="submit" disabled={isSubmitting} className="flex-1 bg-blue-600 hover:bg-blue-700">
                                {isSubmitting ? (isEditing ? "Updating..." : "Launching...") : (isEditing ? "Update Project" : "Launch")}
                            </Button>
                        </motion.div>
                    </form>

                </DialogContent>
            </Dialog >
            {cropImage && cropType && (
                <Dialog open={true} onOpenChange={handleCropCancel}>
                    <DialogContent className="p-0 max-w-3xl w-full h-full border-none rounded-xl overflow-hidden">
                        <ImageCropper
                            imageSrc={cropImage}
                            aspect={cropType === "logo" ? 1 : 16 / 9}
                            onSave={handleCropSave}
                            onCancel={handleCropCancel}
                        />
                    </DialogContent>
                </Dialog>
            )}
        </>
    )
}
