import { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { X, Upload, AlertCircle, Loader2 } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Checkbox } from "../../components/ui/checkbox";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "../../components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";
import toast from "react-hot-toast";
import ImageCropper from "../cropper/ImageCropper";
import { useVerifyProject } from "../../hooks/Project/projectHooks";
import type { AxiosError } from "axios";

interface VerifyStartupModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    projectId: string | null;
    founderId: string | null;
}

interface Country {
    name: { common: string };
    cca2: string;
}

const verifyStartupSchema = z.object({
    gstCertificate: z.instanceof(File, { message: "Please upload a GST certificate" })
        .refine((f) => f.size <= 5_000_000, "Max size 5MB")
        .refine((f) => ["image/jpeg", "image/jpg", "image/png", "application/pdf"].includes(f.type), "Only images or PDF allowed"),

    companyRegistrationCertificate: z.instanceof(File, { message: "Please upload a company certificate" })
        .refine((f) => f.size <= 5_000_000, "Max size 5MB")
        .refine((f) => ["image/jpeg", "image/jpg", "image/png", "application/pdf"].includes(f.type), "Only images or PDF allowed"),

    cinNumber: z.string().length(21, "CIN must be exactly 21 characters"),
    country: z.string().min(1, "Please select a country"),
    verifyProfile: z.boolean().refine(val => val === true, { message: "You must confirm your profile is verified" }),
    declarationAccepted: z.boolean().refine(val => val === true, { message: "You must accept the declaration" }),
});

type FormDataType = z.infer<typeof verifyStartupSchema>;

export function VerifyStartupModal({ open, onOpenChange, projectId, founderId }: VerifyStartupModalProps) {
    const [countries, setCountries] = useState<Country[]>([]);
    const [loadingCountries, setLoadingCountries] = useState(true);

    const [cropImage, setCropImage] = useState<string | null>(null);
    const [cropField, setCropField] = useState<"gstCertificate" | "companyRegistrationCertificate" | null>(null);

    const [gstPreview, setGstPreview] = useState<string | null>(null);
    const [regPreview, setRegPreview] = useState<string | null>(null);

    const { mutate: verifyProject, isPending } = useVerifyProject();

    const form = useForm<FormDataType>({
        resolver: zodResolver(verifyStartupSchema),
        defaultValues: {
            cinNumber: "",
            country: "",
            verifyProfile: false,
            declarationAccepted: false
        }
    });

    // Fetch countries when modal opens
    useEffect(() => {
        if (!open) {
            form.reset();
            setGstPreview(null);
            setRegPreview(null);
            return;
        }

        const fetchCountries = async () => {
            setLoadingCountries(true);
            try {
                const res = await fetch("https://restcountries.com/v3.1/all?fields=name,cca2");
                const data: Country[] = await res.json();
                data.sort((a, b) => a.name.common.localeCompare(b.name.common));
                setCountries(data);
            } catch {
                toast.error("Failed to load countries");
            } finally {
                setLoadingCountries(false);
            }
        };
        fetchCountries();
    }, [open, form]);

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>, field: "gstCertificate" | "companyRegistrationCertificate") => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = () => {
            setCropImage(reader.result as string);
            setCropField(field);
        };
        reader.readAsDataURL(file);
    };

    const handleCropSave = (file: File, preview: string) => {
        if (!cropField) return;

        form.setValue(cropField, file, { shouldValidate: true });

        if (cropField === "gstCertificate") setGstPreview(preview);
        if (cropField === "companyRegistrationCertificate") setRegPreview(preview);

        setCropImage(null);
        setCropField(null);
    };

    const handleCropCancel = () => {
        setCropImage(null);
        setCropField(null);
    };

    const onSubmit = (data: FormDataType) => {
        if (!projectId || !founderId) {
            toast.error("Project information is missing");
            return;
        }

        const formData = new FormData();
        formData.append("gstCertificate", data.gstCertificate);
        formData.append("companyRegistrationCertificate", data.companyRegistrationCertificate);
        formData.append("cinNumber", data.cinNumber);
        formData.append("country", data.country);
        formData.append("projectId", projectId);
        formData.append("founderId", founderId);
        formData.append("verifyProfile", String(data.verifyProfile));
        formData.append("declarationAccepted", String(data.declarationAccepted));

        verifyProject(formData, {
            onSuccess: (response) => {
                toast.success(response?.message || "Verification submitted successfully!");
                // queryClient.invalidateQueries({ queryKey: ["personal-project"] });
                // queryClient.invalidateQueries({ queryKey: ["single-project", projectId] });
                onOpenChange(false);
            },
            onError: (error) => {
                const err = error as AxiosError<{ message?: string }>;
                toast.error(err.response?.data?.message || "Failed to submit verification. Please try again.");
            }
        });
    };


    return (
        <>
            {/* Main Verification Modal */}
            <Dialog open={open} onOpenChange={onOpenChange}>
                <DialogContent className="w-full max-w-2xl max-h-[92vh] flex flex-col p-0 gap-0 rounded-2xl overflow-hidden">
                    {/* Header */}
                    <DialogHeader className="flex flex-row items-center justify-between p-5 pb-4 border-b bg-background sticky top-0 z-50">
                        <div>
                            <DialogTitle className="text-xl md:text-2xl font-bold">Verify Your Startup</DialogTitle>
                            <DialogDescription className="text-sm text-muted-foreground mt-1">
                                Submit official documents to get verified
                            </DialogDescription>
                        </div>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => onOpenChange(false)}
                            className="rounded-full hover:bg-muted"
                        >
                            <X className="h-5 w-5" />
                        </Button>
                    </DialogHeader>

                    {/* Scrollable Content */}
                    <div className="flex-1 overflow-y-auto px-5 py-6">
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                            {/* Documents */}
                            <div className="rounded-xl border bg-muted/30 p-4 md:p-5 space-y-5">
                                <h3 className="font-semibold text-lg">Required Documents</h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <Controller
                                        control={form.control}
                                        name="companyRegistrationCertificate"
                                        render={({ fieldState: { error } }) => (
                                            <div className="space-y-2">
                                                <label className="text-sm font-medium">Company Registration</label>
                                                <div className="border-2 border-dashed rounded-xl h-44 flex flex-col items-center justify-center bg-muted/20 cursor-pointer hover:bg-muted/40 transition relative overflow-hidden">
                                                    {regPreview ? (
                                                        <img src={regPreview} alt="Preview" className="h-full w-full object-contain p-3" />
                                                    ) : (
                                                        <div className="text-center p-4">
                                                            <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                                                            <p className="text-sm text-muted-foreground">PDF or Image</p>
                                                            <p className="text-xs text-muted-foreground mt-1">Max 5MB</p>
                                                        </div>
                                                    )}
                                                    <input
                                                        type="file"
                                                        accept="image/*,application/pdf"
                                                        className="absolute inset-0 opacity-0 cursor-pointer"
                                                        onChange={(e) => handleFileSelect(e, "companyRegistrationCertificate")}
                                                    />
                                                </div>
                                                {error && <p className="text-red-500 text-xs">{error.message}</p>}
                                            </div>
                                        )}
                                    />

                                    <Controller
                                        control={form.control}
                                        name="gstCertificate"
                                        render={({ fieldState: { error } }) => (
                                            <div className="space-y-2">
                                                <label className="text-sm font-medium">GST Certificate</label>
                                                <div className="border-2 border-dashed rounded-xl h-44 flex flex-col items-center justify-center bg-muted/20 cursor-pointer hover:bg-muted/40 transition relative overflow-hidden">
                                                    {gstPreview ? (
                                                        <img src={gstPreview} alt="Preview" className="h-full w-full object-contain p-3" />
                                                    ) : (
                                                        <div className="text-center p-4">
                                                            <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                                                            <p className="text-sm text-muted-foreground">PDF or Image</p>
                                                            <p className="text-xs text-muted-foreground mt-1">Max 5MB</p>
                                                        </div>
                                                    )}
                                                    <input
                                                        type="file"
                                                        accept="image/*,application/pdf"
                                                        className="absolute inset-0 opacity-0 cursor-pointer"
                                                        onChange={(e) => handleFileSelect(e, "gstCertificate")}
                                                    />
                                                </div>
                                                {error && <p className="text-red-500 text-xs">{error.message}</p>}
                                            </div>
                                        )}
                                    />
                                </div>
                            </div>

                            {/* Business Info */}
                            <div className="rounded-xl border bg-muted/30 p-4 md:p-5 space-y-5">
                                <h3 className="font-semibold text-lg">Business Information</h3>

                                <Controller
                                    control={form.control}
                                    name="cinNumber"
                                    render={({ field, fieldState: { error } }) => (
                                        <div>
                                            <label className="block text-sm font-medium mb-2">CIN Number</label>
                                            <Input
                                                {...field}
                                                maxLength={21}
                                                placeholder="U12345MH2023PLC123456"
                                                className="font-mono text-base"
                                            />
                                            {error && <p className="text-red-500 text-xs mt-1">{error.message}</p>}
                                        </div>
                                    )}
                                />

                                <Controller
                                    control={form.control}
                                    name="country"
                                    render={({ field, fieldState: { error } }) => (
                                        <div>
                                            <label className="block text-sm font-medium mb-2">Country</label>
                                            <Select onValueChange={field.onChange} value={field.value}>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select country" />
                                                </SelectTrigger>
                                                <SelectContent className="max-h-64">
                                                    {loadingCountries ? (
                                                        <div className="py-8 text-center">
                                                            <Loader2 className="h-5 w-5 animate-spin mx-auto" />
                                                        </div>
                                                    ) : (
                                                        countries.map((c) => (
                                                            <SelectItem key={c.cca2} value={c.name.common}>
                                                                {c.name.common}
                                                            </SelectItem>
                                                        ))
                                                    )}
                                                </SelectContent>
                                            </Select>
                                            {error && <p className="text-red-500 text-xs mt-1">{error.message}</p>}
                                        </div>
                                    )}
                                />
                            </div>

                            {/* Confirmations */}
                            <div className="rounded-xl border bg-muted/30 p-4 md:p-5 space-y-5">
                                <h3 className="font-semibold text-lg">Confirmation</h3>
                                <div className="space-y-4">
                                    <Controller
                                        control={form.control}
                                        name="verifyProfile"
                                        render={({ field, fieldState: { error } }) => (
                                            <div className="flex items-start gap-3">
                                                <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                                                <div>
                                                    <p className="text-sm font-medium">My founder profile is fully verified</p>
                                                    {error && <p className="text-red-500 text-xs mt-1 flex items-center gap-1"><AlertCircle className="w-3.5 h-3.5" />{error.message}</p>}
                                                </div>
                                            </div>
                                        )}
                                    />
                                    <Controller
                                        control={form.control}
                                        name="declarationAccepted"
                                        render={({ field, fieldState: { error } }) => (
                                            <div className="flex items-start gap-3">
                                                <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                                                <div>
                                                    <p className="text-sm font-medium">All information is accurate and authentic</p>
                                                    {error && <p className="text-red-500 text-xs mt-1 flex items-center gap-1"><AlertCircle className="w-3.5 h-3.5" />{error.message}</p>}
                                                </div>
                                            </div>
                                        )}
                                    />
                                </div>
                            </div>

                            <Button
                                type="submit"
                                disabled={isPending}
                                className="w-full h-12 text-base font-semibold bg-green-600 hover:bg-green-700 shadow-lg"
                            >
                                {isPending ? (
                                    <span className="flex items-center gap-2">
                                        <Loader2 className="h-5 w-5 animate-spin" />
                                        Submitting...
                                    </span>
                                ) : (
                                    "Submit for Verification"
                                )}
                            </Button>
                        </form>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Fixed Cropper Modal - Now Perfect on All Devices */}
            <Dialog open={!!cropImage} onOpenChange={() => setCropImage(null)}>
                <DialogContent className="p-0 w-screen h-screen max-w-none max-h-none m-0 rounded-none bg-black/90">
                    <div className="relative w-full h-full flex items-center justify-center">
                        {/* Close Button */}
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={handleCropCancel}
                            className="absolute top-4 right-4 z-50 bg-white/20 hover:bg-white/30 text-white rounded-full backdrop-blur-sm"
                        >
                            <X className="h-6 w-6" />
                        </Button>

                        {/* Cropper */}
                        {cropImage && (
                            <div className="w-full h-full max-w-4xl max-h-4xl">
                                <ImageCropper
                                    imageSrc={cropImage}
                                    aspect={1}
                                    onSave={handleCropSave}
                                    onCancel={handleCropCancel}
                                />
                            </div>
                        )}
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
}