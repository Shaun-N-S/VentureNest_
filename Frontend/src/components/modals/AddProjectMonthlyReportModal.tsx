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
import { useAddMonthlyReport } from "../../hooks/Project/projectHooks"
import toast from "react-hot-toast"


interface MonthlyReportModalProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    projectId: string | null
}

const appendToFormData = (data: MonthlyReportFormData) => {
    const formData = new FormData()

    formData.append("month", data.month)
    formData.append("year", data.year)

    formData.append("revenue", data.revenue)
    formData.append("expenditure", data.expenditure)

    formData.append("netProfitLossAmount", data.profitLossAmount)
    formData.append("netProfitLossType", data.profitLossType)

    formData.append("keyAchievement", data.achievements)
    formData.append("challenges", data.challenges)

    formData.append("isConfirmed", String(data.confirmation))

    return formData
}


export function MonthlyReportModal({ open, onOpenChange, projectId }: MonthlyReportModalProps) {
    const { mutate: submitMonthlyReport, isPending } = useAddMonthlyReport()

    const {
        control,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm<MonthlyReportFormData>({
        resolver: zodResolver(monthlyReportSchema),
        defaultValues: {
            month: "",
            year: "",
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
        try {
            console.log(data);
            const formData = appendToFormData(data)
            if (projectId) {
                formData.append("projectId", projectId)
            }

            submitMonthlyReport(formData, {
                onSuccess: () => {
                    toast.success("Report added successfully!")
                    reset()
                    onOpenChange(false)
                },
                onError: (err) => {
                    toast.error(err.message || "Failed to submit report. Please try again.")
                    onOpenChange(false);
                },
            })
        } catch (error) {
            console.log(error);
            toast.error("An unexpected error occurred. Please try again.")
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent
                className="max-h-[90vh] w-full max-w-2xl rounded-2xl p-0 overflow-y-auto"
                style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            >
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
                            <button
                                onClick={() => onOpenChange(false)}
                                className="text-muted-foreground hover:text-foreground transition-colors"
                                disabled={isPending}
                            >
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
                                            <Select value={field.value} onValueChange={field.onChange} disabled={isPending}>
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

                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Year</label>
                                    <Controller
                                        name="year"
                                        control={control}
                                        render={({ field }) => (
                                            <Select value={field.value} onValueChange={field.onChange} disabled={isPending}>
                                                <SelectTrigger className="bg-background">
                                                    <SelectValue placeholder="Select year" />
                                                </SelectTrigger>
                                                <SelectContent className="max-h-[200px]">
                                                    {Array.from({ length: new Date().getFullYear() - 2000 + 1 }, (_, i) => {
                                                        const year = new Date().getFullYear() - i
                                                        return (
                                                            <SelectItem key={year} value={year.toString()}>
                                                                {year}
                                                            </SelectItem>
                                                        )
                                                    })}
                                                </SelectContent>
                                            </Select>
                                        )}
                                    />
                                    {errors.year && <p className="text-xs text-destructive">{errors.year.message}</p>}
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
                                            disabled={isPending}
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
                                            disabled={isPending}
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
                                        render={({ field }) => (
                                            <Input
                                                {...field}
                                                placeholder="Enter amount"
                                                type="number"
                                                step="0.01"
                                                disabled={isPending}
                                            />
                                        )}
                                    />
                                    <Controller
                                        name="profitLossType"
                                        control={control}
                                        render={({ field }) => (
                                            <Select value={field.value} onValueChange={field.onChange} disabled={isPending}>
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
                                            disabled={isPending}
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
                                            disabled={isPending}
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
                                    <Checkbox
                                        id="confirmation"
                                        checked={field.value}
                                        onCheckedChange={field.onChange}
                                        className="mt-1"
                                        disabled={isPending}
                                    />
                                )}
                            />
                            <div className="flex-1">
                                <label htmlFor="confirmation" className="text-sm font-medium leading-relaxed cursor-pointer">
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
                            <Button
                                type="submit"
                                disabled={isPending}
                                className="h-11 w-full bg-green-500 hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                            >
                                {isPending ? (
                                    <span className="flex items-center gap-2">
                                        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                        </svg>
                                        Submitting...
                                    </span>
                                ) : (
                                    "Submit Performance Report"
                                )}
                            </Button>
                        </motion.div>
                    </form>
                </motion.div>
            </DialogContent>
        </Dialog>
    )
}