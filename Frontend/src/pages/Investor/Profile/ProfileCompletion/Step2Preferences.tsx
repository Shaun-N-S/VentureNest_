import React from "react"
import { Input } from "../../../../components/ui/input"
import { Label } from "../../../../components/ui/label"
import { Button } from "../../../../components/ui/button"
import Chip from "../../../../components/chip/Chip"
import type { FormData } from "./InvestorProfileCompletion"

type Props = {
    SECTORS: readonly string[]
    STAGES: readonly string[]
    MAX_SELECT: number
    formData: FormData
    setFormData: React.Dispatch<React.SetStateAction<FormData>>
    errors: Record<string, string>
    fileNames: Record<string, string | undefined>
    handleFileChange: (e: React.ChangeEvent<HTMLInputElement>, fileType: "profileImg" | "portfolioPdf") => void
    onPrev: () => void
    onSubmit: () => void
}

export default function Step2Preferences({
    SECTORS,
    STAGES,
    MAX_SELECT,
    formData,
    setFormData,
    errors,
    fileNames,
    handleFileChange,
    onPrev,
    onSubmit
}: Props) {
    const sectorLimitReached = formData.preferredSector.length >= MAX_SELECT
    const stageLimitReached = formData.preferredStartupStage.length >= MAX_SELECT

    function toggleMulti(name: "preferredSector" | "preferredStartupStage", value: string) {
        setFormData((prev: FormData) => {
            const isSelected = prev[name].includes(value)
            if (!isSelected && prev[name].length >= MAX_SELECT) return prev
            const arr = new Set(prev[name])
            if (arr.has(value)) arr.delete(value)
            else arr.add(value)
            return { ...prev, [name]: Array.from(arr) as string[] }
        })
    }

    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
        const { name, value } = e.target
        setFormData((prev: FormData) => ({ ...prev, [name]: value }))
    }

    return (
        <div className="grid gap-4">
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
                        {SECTORS.map(s => (
                            <Chip
                                key={s}
                                selected={formData.preferredSector.includes(s)}
                                disabled={!formData.preferredSector.includes(s) && sectorLimitReached}
                                onClick={() => toggleMulti("preferredSector", s)}
                            >
                                {s}
                            </Chip>
                        ))}
                    </div>
                </div>
            </div>

            {/* Preferred Startup Stages */}
            <div className="grid gap-2">
                <div className="flex items-baseline justify-between">
                    <Label>Preferred Startup Stages</Label>
                    <span className="text-xs text-muted-foreground">
                        {formData.preferredStartupStage.length}/{MAX_SELECT} selected
                    </span>
                </div>
                {errors.preferredStartupStage && <p className="text-xs text-destructive">{errors.preferredStartupStage}</p>}
                <div className="rounded-lg border border-primary/20 bg-primary/5 p-3 sm:p-4">
                    <div className="flex flex-wrap gap-2">
                        {STAGES.map(st => (
                            <Chip
                                key={st}
                                selected={formData.preferredStartupStage.includes(st)}
                                disabled={!formData.preferredStartupStage.includes(st) && stageLimitReached}
                                onClick={() => toggleMulti("preferredStartupStage", st)}
                            >
                                {st}
                            </Chip>
                        ))}
                    </div>
                </div>
            </div>

            {/* Investment Range */}
            <div className="grid gap-2">
                <Label>Investment Range (USD)</Label>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <div className="grid gap-1.5">
                        <Label htmlFor="investmentMin" className="text-xs text-muted-foreground">Minimum</Label>
                        <Input 
                            id="investmentMin" 
                            name="investmentMin" 
                            type="number" 
                            min={0}
                            placeholder="e.g., 5000"
                            value={formData.investmentMin}
                            onChange={handleChange}
                        />
                        {errors.investmentMin && <p className="text-xs text-destructive">{errors.investmentMin}</p>}
                    </div>
                    <div className="grid gap-1.5">
                        <Label htmlFor="investmentMax" className="text-xs text-muted-foreground">Maximum</Label>
                        <Input 
                            id="investmentMax" 
                            name="investmentMax" 
                            type="number" 
                            min={0}
                            placeholder="e.g., 25000"
                            value={formData.investmentMax}
                            onChange={handleChange}
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
                    onChange={(e) => handleFileChange(e, "portfolioPdf")}
                />
                {fileNames.portfolioPdf && (
                    <p className="text-xs text-green-600">✓ {fileNames.portfolioPdf}</p>
                )}
                {errors.portfolioPdf && <p className="text-xs text-destructive">{errors.portfolioPdf}</p>}
                {!errors.portfolioPdf && !fileNames.portfolioPdf && (
                    <p className="text-xs text-muted-foreground">Upload a PDF file (max 5MB). Optional field.</p>
                )}
            </div>

            <div className="mt-1 flex items-center justify-between">
                <Button variant="secondary" type="button" onClick={onPrev}>Back</Button>
                <Button type="button" onClick={onSubmit}>Submit</Button>
            </div>
        </div>
    )
}