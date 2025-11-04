import React from "react"
import { Input } from "../../../../components/ui/input"
import { Label } from "../../../../components/ui/label"
import { Button } from "../../../../components/ui/button"
import type { FormData } from "./InvestorProfileCompletion"

type Props = {
    formData: FormData
    setFormData: React.Dispatch<React.SetStateAction<FormData>>
    errors: Record<string, string>
    fileNames: Record<string, string | undefined>
    handleFileChange: (e: React.ChangeEvent<HTMLInputElement>, fileType: "profileImg" | "portfolioPdf") => void
    onNext: () => void
}

export default function Step1ProfileDetails({
    formData,
    setFormData,
    errors,
    fileNames,
    handleFileChange,
    onNext
}: Props) {
    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
        const { name, value } = e.target
        setFormData((prev: FormData) => ({ ...prev, [name]: value }))
    }

    return (
        <div className="grid gap-4">
            {/* Profile Image */}
            <div className="grid gap-2">
                <Label htmlFor="profileImg">Profile Image</Label>
                <Input 
                    id="profileImg" 
                    type="file" 
                    accept="image/*"
                    onChange={(e) => handleFileChange(e, "profileImg")}
                />
                {fileNames.profileImg && (
                    <p className="text-xs text-green-600">✓ {fileNames.profileImg}</p>
                )}
                {errors.profileImg
                    ? <p className="text-xs text-destructive">{errors.profileImg}</p>
                    : !fileNames.profileImg && <p className="text-xs text-muted-foreground">Choose an image file (max 5MB).</p>
                }
            </div>

            {/* LinkedIn */}
            <div className="grid gap-2">
                <Label htmlFor="linkedInUrl">LinkedIn Profile URL</Label>
                <Input 
                    id="linkedInUrl" 
                    name="linkedInUrl" 
                    type="url"
                    placeholder="https://www.linkedin.com/in/username"
                    value={formData.linkedInUrl}
                    onChange={handleChange}
                />
                {errors.linkedInUrl && <p className="text-xs text-destructive">{errors.linkedInUrl}</p>}
            </div>

            {/* Company Name */}
            <div className="grid gap-2">
                <Label htmlFor="companyName">Company / Firm (optional)</Label>
                <Input 
                    id="companyName" 
                    name="companyName"
                    placeholder="Your firm or company"
                    value={formData.companyName}
                    onChange={handleChange}
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
                />
                {errors.location && <p className="text-xs text-destructive">{errors.location}</p>}
            </div>

            <div className="flex justify-end">
                <Button onClick={onNext} type="button">Next</Button>
            </div>
        </div>
    )
}