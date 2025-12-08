import { useState } from "react"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { motion } from "framer-motion"
import { X, AlertCircle } from "lucide-react"
import { Button } from "../../components/ui/button"
import { Input } from "../../components/ui/input"
import { Textarea } from "../../components/ui/textarea"
import { Checkbox } from "../../components/ui/checkbox"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "../../components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select"
import { monthlyReportSchema, type MonthlyReportFormData } from "../../lib/validations/projectMontlyReportValidation"
import { MONTHS } from "../../types/months"


interface MonthlyReportModalProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    projectId: string | null
}

const appendToFormData = (data: MonthlyReportFormData) => {
    const formData = new FormData()

    formData.append("month", data.month)
    formData.append("revenue", data.revenue)
    formData.append("expenditure", data.expenditure)
    formData.append("profitLossAmount", data.profitLossAmount)
    formData.append("profitLossType", data.profitLossType)
    formData.append("achievements", data.achievements)
    formData.append("challenges", data.challenges)
    formData.append("confirmation", String(data.confirmation))

    console.log("[v0] Monthly Report FormData:")
    console.log("[v0] Form entries:", Object.fromEntries(formData))

    return formData
}

export function MonthlyReportModal({ open, onOpenChange }: MonthlyReportModalProps) {
    const [isSubmitting, setIsSubmitting] = useState(false)

    const {
        control,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm<MonthlyReportFormData>({
        resolver: zodResolver(monthlyReportSchema),
        defaultValues: {
            month: "",
            revenue: "",
            expenditure: "",
            profitLossAmount: "",
            profitLossType: "profit",
            achievements: "",
            challenges: "",
            confirmation: false,
        },
    })

    const onSubmit = async (data: MonthlyReportFormData) => {
        setIsSubmitting(true)
        try {
            const formData = appendToFormData(data)
            // Send formData to your backend
            // const response = await submitMonthlyReport(formData)
            console.log(" Ready to submit to backend with FormData", formData)
            reset()
            onOpenChange(false)
        } catch (error) {
            console.error("[v0] Error submitting form:", error)
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-h-[90vh] w-full max-w-2xl rounded-2xl p-0 overflow-y-scroll scrollbar-hide" >
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.2 }}
                    className="p-6 sm:p-8"
                >
                    <DialogHeader className="mb-6">
                        <div className="flex items-center justify-between">
                            <div className="flex-1">
                                <DialogTitle className="text-2xl font-bold">Monthly Performance Report</DialogTitle>
                                <DialogDescription className="mt-2 text-base">
                                    Share your startup's key metrics and achievements
                                </DialogDescription>
                            </div>
                            <button onClick={() => onOpenChange(false)} className="text-muted-foreground hover:text-foreground">
                                <X className="h-5 w-5" />
                            </button>
                        </div>
                    </DialogHeader>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        {/* Financial Overview Section */}
                        <div className="space-y-4 rounded-lg bg-muted/40 p-4 sm:p-6">
                            <h3 className="text-lg font-semibold">Financial Overview</h3>

                            <div className="grid gap-4 sm:grid-cols-2">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Select Month</label>
                                    <Controller
                                        name="month"
                                        control={control}
                                        render={({ field }) => (
                                            <Select value={field.value} onValueChange={field.onChange}>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Choose month" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {MONTHS.map((month) => (
                                                        <SelectItem key={month} value={month}>
                                                            {month}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        )}
                                    />
                                    {errors.month && <p className="text-xs text-destructive">{errors.month.message}</p>}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="revenue" className="text-sm font-medium">
                                    Revenue Generated This Month
                                </label>
                                <Controller
                                    name="revenue"
                                    control={control}
                                    render={({ field }) => (
                                        <Input
                                            {...field}
                                            id="revenue"
                                            placeholder="Enter amount"
                                            type="number"
                                            step="0.01"
                                            className="bg-background"
                                        />
                                    )}
                                />
                                {errors.revenue && <p className="text-xs text-destructive">{errors.revenue.message}</p>}
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="expenditure" className="text-sm font-medium">
                                    Monthly Expenditure
                                </label>
                                <Controller
                                    name="expenditure"
                                    control={control}
                                    render={({ field }) => (
                                        <Input
                                            {...field}
                                            id="expenditure"
                                            placeholder="Enter amount"
                                            type="number"
                                            step="0.01"
                                            className="bg-background"
                                        />
                                    )}
                                />
                                {errors.expenditure && <p className="text-xs text-destructive">{errors.expenditure.message}</p>}
                            </div>

                            <div className="space-y-3 rounded-lg bg-background p-3">
                                <label className="text-sm font-medium">Net Profit / Loss</label>
                                <div className="grid gap-3 sm:grid-cols-[1fr_120px]">
                                    <Controller
                                        name="profitLossAmount"
                                        control={control}
                                        render={({ field }) => <Input {...field} placeholder="Enter amount" type="number" step="0.01" />}
                                    />
                                    <Controller
                                        name="profitLossType"
                                        control={control}
                                        render={({ field }) => (
                                            <Select value={field.value} onValueChange={field.onChange}>
                                                <SelectTrigger>
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="profit">Profit</SelectItem>
                                                    <SelectItem value="loss">Loss</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        )}
                                    />
                                </div>
                                {errors.profitLossAmount && (
                                    <p className="text-xs text-destructive">{errors.profitLossAmount.message}</p>
                                )}
                            </div>
                        </div>

                        {/* Achievements & Challenges Section */}
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label htmlFor="achievements" className="text-sm font-medium">
                                    Key Achievements This Month
                                </label>
                                <Controller
                                    name="achievements"
                                    control={control}
                                    render={({ field }) => (
                                        <Textarea
                                            {...field}
                                            id="achievements"
                                            placeholder="Highlight your wins, milestones, and progress..."
                                            rows={3}
                                            className="resize-none"
                                        />
                                    )}
                                />
                                {errors.achievements && <p className="text-xs text-destructive">{errors.achievements.message}</p>}
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="challenges" className="text-sm font-medium">
                                    Challenges & Support Required
                                </label>
                                <Controller
                                    name="challenges"
                                    control={control}
                                    render={({ field }) => (
                                        <Textarea
                                            {...field}
                                            id="challenges"
                                            placeholder="Share obstacles you're facing and the support you need..."
                                            rows={3}
                                            className="resize-none"
                                        />
                                    )}
                                />
                                {errors.challenges && <p className="text-xs text-destructive">{errors.challenges.message}</p>}
                            </div>
                        </div>

                        {/* Confirmation */}
                        <div className="flex items-start gap-3 rounded-lg border border-muted bg-muted/20 p-4">
                            <Controller
                                name="confirmation"
                                control={control}
                                render={({ field }) => (
                                    <Checkbox id="confirmation" checked={field.value} onCheckedChange={field.onChange} className="mt-1" />
                                )}
                            />
                            <div className="flex-1">
                                <label htmlFor="confirmation" className="text-sm font-medium leading-relaxed">
                                    I confirm that the above details are accurate to the best of my knowledge.
                                </label>
                                {errors.confirmation && (
                                    <p className="mt-1 flex items-center gap-1 text-xs text-destructive">
                                        <AlertCircle className="h-3 w-3" />
                                        {errors.confirmation.message}
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Submit Button */}
                        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                            <Button type="submit" disabled={isSubmitting} className="h-11 w-full bg-green-500 hover:bg-green-600">
                                {isSubmitting ? "Submitting..." : "Submit Performance Report"}
                            </Button>
                        </motion.div>
                    </form>
                </motion.div>
            </DialogContent>
        </Dialog>
    )
}
