import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../../components/ui/dialog";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Pencil } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { z } from "zod";
import { useInvestorProfileUpdate } from "../../hooks/Investor/Profile/InvestorProfileHooks";
import { useDispatch } from "react-redux";
import { updateUserData } from "../../store/Slice/authDataSlice";
import { queryClient } from "../../main";
import ImageCropper from "../cropper/ImageCropper";
import type { InvestorProfileApiResponse } from "../../types/investorProfileApiResponse";
import axios from "axios";

const investorSchema = z
  .object({
    profileImg: z.instanceof(File).optional(),

    userName: z
      .string()
      .trim()
      .min(3, "Username must be at least 3 characters")
      .max(30, "Username cannot exceed 30 characters"),

    bio: z
      .string()
      .trim()
      .max(500, "Bio cannot exceed 500 characters")
      .optional(),

    website: z
      .string()
      .trim()
      .url("Invalid website URL format")
      .optional()
      .or(z.literal("")),

    linkedInUrl: z
      .string()
      .trim()
      .url("Invalid LinkedIn URL format")
      .optional()
      .or(z.literal("")),

    companyName: z
      .string()
      .trim()
      .min(2, "Company name must be at least 2 characters")
      .max(100, "Company name cannot exceed 100 characters")
      .optional()
      .or(z.literal("")),

    experience: z.preprocess((val) => {
      if (val === "" || val === undefined || val === null) return undefined;
      return Number(val);
    }, z.number().int().nonnegative("Experience cannot be negative").optional()),

    location: z
      .string()
      .trim()
      .max(100, "Location cannot exceed 100 characters")
      .optional(),

    investmentMin: z.preprocess((val) => {
      if (val === "" || val === undefined || val === null) return undefined;
      return Number(val);
    }, z.number("Investment minimum is required").positive("Investment minimum must be greater than 0")),

    investmentMax: z.preprocess((val) => {
      if (val === "" || val === undefined || val === null) return undefined;
      return Number(val);
    }, z.number("Investment maximum is required").positive("Investment maximum must be greater than 0")),
  })
  .refine((data) => data.investmentMax >= data.investmentMin, {
    message: "Maximum investment must be greater than or equal to minimum investment",
    path: ["investmentMax"],
  });

export type InvestorProfileEditData = z.infer<typeof investorSchema>;

interface InvestorEditProfileModalProps {
  data: {
    profileImg?: string;
    userName: string;
    bio?: string;
    website?: string;
    linkedInUrl?: string;
    companyName?: string;
    experience?: number;
    location?: string;
    investmentMin?: number;
    investmentMax?: number;
  };
  investorId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
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
    linkedInUrl: data?.linkedInUrl || "",
    companyName: data?.companyName || "",
    experience: data?.experience || 0,
    location: data?.location || "",
    investmentMin: data?.investmentMin || 0,
    investmentMax: data?.investmentMax || 0,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [preview, setPreview] = useState<string | null>(
    data?.profileImg || null,
  );
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [hasImageChanged, setHasImageChanged] = useState(false);
  const [showCropper, setShowCropper] = useState(false);
  const [tempImage, setTempImage] = useState<string | null>(null);
  const { mutate: UpdateInvestorProfile } = useInvestorProfileUpdate();
  const dispatch = useDispatch();

  // Reset the form whenever the modal is (re)opened with fresh profile data,
  // so edits from a previous open don't leak into a new session.
  useEffect(() => {
    if (open && data) {
      setFormData({
        userName: data.userName || "",
        bio: data.bio || "",
        website: data.website || "",
        linkedInUrl: data.linkedInUrl || "",
        companyName: data.companyName || "",
        experience: data.experience || 0,
        location: data.location || "",
        investmentMin: data.investmentMin || 0,
        investmentMax: data.investmentMax || 0,
      });
      setPreview(data.profileImg || null);
      setSelectedImage(null);
      setHasImageChanged(false);
      setErrors({});
    }
  }, [data, open]);

  // Cleanup preview URL on unmount (only for blob URLs)
  useEffect(() => {
    return () => {
      if (preview && preview.startsWith("blob:")) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size should be less than 5MB");
      return;
    }

    const url = URL.createObjectURL(file);
    setTempImage(url);

    
    setShowCropper(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const dataToValidate = {
        ...formData,
        profileImg: selectedImage || undefined,
      };

      investorSchema.parse(dataToValidate);
      const formDataToSend = new FormData();

      formDataToSend.append("formData", JSON.stringify(formData));
      if (hasImageChanged && selectedImage)
        formDataToSend.append("profileImg", selectedImage);

      UpdateInvestorProfile(formDataToSend, {
        onSuccess: (res) => {
          toast.success(res.message);
          dispatch(updateUserData(res.data.response));

          queryClient.setQueryData<InvestorProfileApiResponse>(
            ["investorProfile", investorId],
            (oldData) => {
              if (!oldData?.data?.profileData) return oldData;

              return {
                ...oldData,
                data: {
                  ...oldData.data,
                  profileData: {
                    ...oldData.data.profileData,
                    ...res.data.response,
                    profileImg:
                      hasImageChanged && selectedImage
                        ? res.data.response.profileImg
                        : oldData.data.profileData.profileImg,
                  },
                },
              };
            },
          );

          queryClient.invalidateQueries({
            queryKey: ["investorProfile", investorId],
          });
          queryClient.invalidateQueries({ queryKey: ["profileImg"] });

          onOpenChange(false);
        },
        onError: (err) => {
          if (axios.isAxiosError(err)) {
            toast.error(
              err.response?.data?.message || "Failed to update profile",
            );
          } else {
            toast.error("Failed to update profile");
          }
        },
      });
    } catch (err) {
      if (err instanceof z.ZodError) {
        const newErrors: Record<string, string> = {};
        err.issues.forEach((error) => {
          if (error.path[0]) {
            newErrors[error.path[0] as string] = error.message;
          }
        });
        setErrors(newErrors);
        toast.error("Please correct the errors before saving.");
      } else {
        toast.error("Something went wrong!");
      }
    }
  };

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
            scrollbarWidth: "none",
            msOverflowStyle: "none",
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
            {errors.bio && (
              <p className="text-red-500 text-sm mt-1">{errors.bio}</p>
            )}
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
            <Label>LinkedIn URL</Label>
            <Input
              name="linkedInUrl"
              value={formData.linkedInUrl}
              onChange={handleChange}
              placeholder="https://linkedin.com/in/username"
            />
            {errors.linkedInUrl && (
              <p className="text-red-500 text-sm mt-1">{errors.linkedInUrl}</p>
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
            {errors.companyName && (
              <p className="text-red-500 text-sm mt-1">{errors.companyName}</p>
            )}
          </div>

          <div>
            <Label>Years of Experience</Label>
            <Input
              name="experience"
              type="number"
              min={0}
              value={formData.experience}
              onChange={handleChange}
              placeholder="e.g. 9"
            />
            {errors.experience && (
              <p className="text-red-500 text-sm mt-1">{errors.experience}</p>
            )}
          </div>

          <div>
            <Label>Location</Label>
            <Input
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="Bangalore, India"
            />
            {errors.location && (
              <p className="text-red-500 text-sm mt-1">{errors.location}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Minimum Amount</Label>
              <Input
                name="investmentMin"
                type="number"
                min={1}
                value={formData.investmentMin}
                onChange={handleChange}
                placeholder="200000"
              />
              {errors.investmentMin && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.investmentMin}
                </p>
              )}
            </div>
            <div>
              <Label>Maximum Amount</Label>
              <Input
                name="investmentMax"
                type="number"
                min={1}
                value={formData.investmentMax}
                onChange={handleChange}
                placeholder="2000000"
              />
              {errors.investmentMax && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.investmentMax}
                </p>
              )}
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
  );
}
