import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion, AnimatePresence } from "framer-motion";
import { X, AlertCircle, TrendingUp, Target } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Textarea } from "../../components/ui/textarea";
import { Checkbox } from "../../components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../../components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import {
  monthlyReportSchema,
  type MonthlyReportFormData,
} from "../../lib/validations/projectMontlyReportValidation";
import { MONTHS } from "../../types/months";
import { useAddMonthlyReport } from "../../hooks/Project/projectHooks";
import toast from "react-hot-toast";

interface MonthlyReportModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  projectId: string | null;
}

const appendToFormData = (data: MonthlyReportFormData) => {
  const formData = new FormData();

  formData.append("month", data.month);
  formData.append("year", data.year);
  formData.append("revenue", data.revenue);
  formData.append("expenditure", data.expenditure);
  formData.append("netProfitLossAmount", data.profitLossAmount);
  formData.append("netProfitLossType", data.profitLossType);
  formData.append("keyAchievement", data.achievements);
  formData.append("challenges", data.challenges);
  formData.append("isConfirmed", String(data.confirmation));

  return formData;
};

// Helper to prevent typing '-' or 'e' in number inputs
const preventInvalidNumberInput = (
  e: React.KeyboardEvent<HTMLInputElement>,
) => {
  if (["-", "e", "E", "+"].includes(e.key)) {
    e.preventDefault();
  }
};

export function MonthlyReportModal({
  open,
  onOpenChange,
  projectId,
}: MonthlyReportModalProps) {
  const { mutate: submitMonthlyReport, isPending } = useAddMonthlyReport();

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
  });

  const onSubmit = async (data: MonthlyReportFormData) => {
    try {
      const formData = appendToFormData(data);
      if (projectId) {
        formData.append("projectId", projectId);
      }

      submitMonthlyReport(formData, {
        onSuccess: () => {
          toast.success("Report added successfully!");
          reset();
          onOpenChange(false);
        },
        onError: (err) => {
          toast.error(
            err.message || "Failed to submit report. Please try again.",
          );
        },
      });
    } catch (error) {
      console.error(error);
      toast.error("An unexpected error occurred. Please try again.");
    }
  };

  // Helper component for error messages to keep code clean
  const ErrorMessage = ({ message }: { message?: string }) => (
    <AnimatePresence>
      {message && (
        <motion.p
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -5 }}
          className="flex items-center gap-1 mt-1.5 text-xs font-medium text-destructive"
        >
          <AlertCircle className="h-3.5 w-3.5" />
          {message}
        </motion.p>
      )}
    </AnimatePresence>
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="w-[95vw] sm:max-w-2xl max-h-[90vh] rounded-2xl p-0 overflow-y-auto gap-0 bg-background"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.2 }}
          className="p-5 sm:p-8"
        >
          <DialogHeader className="mb-8">
            <div className="flex items-start justify-between">
              <div className="flex-1 space-y-1.5">
                <DialogTitle className="text-2xl font-bold tracking-tight text-foreground">
                  Monthly Performance Report
                </DialogTitle>
                <DialogDescription className="text-base text-muted-foreground">
                  Share your startup's key metrics, financial health, and recent
                  milestones.
                </DialogDescription>
              </div>
              <button
                onClick={() => onOpenChange(false)}
                className="rounded-full p-2 bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors disabled:opacity-50"
                disabled={isPending}
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </DialogHeader>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            {/* Period & Financial Overview Section */}
            <div className="space-y-5 rounded-xl border border-border/50 bg-muted/20 p-5 sm:p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                <h3 className="text-lg font-semibold text-foreground">
                  Financial Overview
                </h3>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-foreground">
                    Select Month
                  </label>
                  <Controller
                    name="month"
                    control={control}
                    render={({ field }) => (
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                        disabled={isPending}
                      >
                        <SelectTrigger
                          className={`bg-background ${errors.month ? "border-destructive ring-destructive/20 focus:ring-destructive/20" : ""}`}
                        >
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
                  <ErrorMessage message={errors.month?.message} />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-foreground">
                    Year
                  </label>
                  <Controller
                    name="year"
                    control={control}
                    render={({ field }) => (
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                        disabled={isPending}
                      >
                        <SelectTrigger
                          className={`bg-background ${errors.year ? "border-destructive ring-destructive/20" : ""}`}
                        >
                          <SelectValue placeholder="Select year" />
                        </SelectTrigger>
                        <SelectContent className="max-h-[200px]">
                          {Array.from(
                            { length: new Date().getFullYear() - 2000 + 1 },
                            (_, i) => {
                              const year = new Date().getFullYear() - i;
                              return (
                                <SelectItem key={year} value={year.toString()}>
                                  {year}
                                </SelectItem>
                              );
                            },
                          )}
                        </SelectContent>
                      </Select>
                    )}
                  />
                  <ErrorMessage message={errors.year?.message} />
                </div>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <div className="space-y-2">
                  <label
                    htmlFor="revenue"
                    className="text-sm font-semibold text-foreground"
                  >
                    Revenue Generated
                  </label>
                  <Controller
                    name="revenue"
                    control={control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        id="revenue"
                        placeholder="0.00"
                        type="number"
                        min="0"
                        step="0.01"
                        onKeyDown={preventInvalidNumberInput}
                        className={`bg-background ${errors.revenue ? "border-destructive focus-visible:ring-destructive/20" : ""}`}
                        disabled={isPending}
                      />
                    )}
                  />
                  <ErrorMessage message={errors.revenue?.message} />
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="expenditure"
                    className="text-sm font-semibold text-foreground"
                  >
                    Monthly Expenditure
                  </label>
                  <Controller
                    name="expenditure"
                    control={control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        id="expenditure"
                        placeholder="0.00"
                        type="number"
                        min="0"
                        step="0.01"
                        onKeyDown={preventInvalidNumberInput}
                        className={`bg-background ${errors.expenditure ? "border-destructive focus-visible:ring-destructive/20" : ""}`}
                        disabled={isPending}
                      />
                    )}
                  />
                  <ErrorMessage message={errors.expenditure?.message} />
                </div>
              </div>

              <div className="space-y-3 rounded-xl border border-border bg-background p-4 mt-2">
                <label className="text-sm font-semibold text-foreground">
                  Net Profit / Loss
                </label>
                <div className="grid gap-3 sm:grid-cols-[1fr_140px]">
                  <Controller
                    name="profitLossAmount"
                    control={control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        placeholder="Enter amount"
                        type="number"
                        min="0"
                        step="0.01"
                        onKeyDown={preventInvalidNumberInput}
                        disabled={isPending}
                        className={
                          errors.profitLossAmount
                            ? "border-destructive focus-visible:ring-destructive/20"
                            : ""
                        }
                      />
                    )}
                  />
                  <Controller
                    name="profitLossType"
                    control={control}
                    render={({ field }) => (
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                        disabled={isPending}
                      >
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
                <ErrorMessage message={errors.profitLossAmount?.message} />
              </div>
            </div>

            {/* Achievements & Challenges Section */}
            <div className="space-y-5 rounded-xl border border-border/50 bg-muted/10 p-5 sm:p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-2">
                <Target className="h-5 w-5 text-primary" />
                <h3 className="text-lg font-semibold text-foreground">
                  Progress & Roadblocks
                </h3>
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="achievements"
                  className="text-sm font-semibold text-foreground"
                >
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
                      className={`resize-none bg-background ${errors.achievements ? "border-destructive focus-visible:ring-destructive/20" : ""}`}
                      disabled={isPending}
                    />
                  )}
                />
                <ErrorMessage message={errors.achievements?.message} />
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="challenges"
                  className="text-sm font-semibold text-foreground"
                >
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
                      className={`resize-none bg-background ${errors.challenges ? "border-destructive focus-visible:ring-destructive/20" : ""}`}
                      disabled={isPending}
                    />
                  )}
                />
                <ErrorMessage message={errors.challenges?.message} />
              </div>
            </div>

            {/* Confirmation */}
            <div className="flex items-start gap-3.5 rounded-xl border border-primary/20 bg-primary/5 p-4 sm:p-5">
              <Controller
                name="confirmation"
                control={control}
                render={({ field }) => (
                  <Checkbox
                    id="confirmation"
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    className="mt-1 data-[state=checked]:bg-primary"
                    disabled={isPending}
                  />
                )}
              />
              <div className="flex-1">
                <label
                  htmlFor="confirmation"
                  className="text-sm font-medium leading-snug cursor-pointer select-none text-foreground block"
                >
                  I confirm that the above financial metrics and details are
                  accurate to the best of my knowledge.
                </label>
                <ErrorMessage message={errors.confirmation?.message} />
              </div>
            </div>

            {/* Submit Button */}
            <motion.div
              whileHover={!isPending ? { scale: 1.01 } : {}}
              whileTap={!isPending ? { scale: 0.98 } : {}}
            >
              <Button
                type="submit"
                disabled={isPending}
                className="h-12 w-full text-base font-semibold shadow-md transition-all"
              >
                {isPending ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                        fill="none"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    Submitting Report...
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
  );
}
