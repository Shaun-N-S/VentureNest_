import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../../components/ui/dialog";
import { Button } from "../../components/ui/button";
import { Textarea } from "../../components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import { ShieldAlert } from "lucide-react";
import { useState } from "react";
import { useCreateReport } from "../../hooks/Report/ReportHooks";
import { ReportReason } from "../../types/reportReason";
import { ReportTargetType } from "../../types/reportTargetType";
import toast from "react-hot-toast";
import { AxiosError } from "axios";

interface ReportModalProps {
  open: boolean;
  onClose: () => void;
  targetId: string;
  targetType: ReportTargetType;
}

const REPORT_REASON_LABELS: Record<ReportReason, string> = {
  spam: "Spam or misleading",
  harassment: "Harassment or hate",
  fake_info: "False information",
  copyright: "Copyright violation",
  other: "Other",
};

export const ReportModal = ({
  open,
  onClose,
  targetId,
  targetType,
}: ReportModalProps) => {
  const { mutate: createReport, isPending } = useCreateReport();

  const [reason, setReason] = useState<ReportReason | "">("");
  const [message, setMessage] = useState("");

  const handleSubmit = () => {
    if (!reason || isPending) return;

    createReport(
      {
        reportedItemId: targetId,
        reportedItemType: targetType,
        reasonCode: reason,
        ...(message && { reasonText: message }),
      },
      {
        onSuccess: () => {
          setReason("");
          setMessage("");
          toast.success("Report submitted successfully");
          setTimeout(() => {
            onClose();
          }, 200);
        },
        onError: (err) => {
          if (err instanceof AxiosError) {
            toast.error(
              err.response?.data?.message || "Failed to submit report"
            );
          } else {
            toast.error("Something went wrong");
          }
          setTimeout(() => {
            onClose();
          }, 200);
        },
      }
    );
  };

  const title =
    targetType === ReportTargetType.POST
      ? "Report this post"
      : "Report this project";

  return (
    <Dialog
      open={open}
      onOpenChange={(value) => {
        if (!value && !isPending) {
          onClose();
        }
      }}
    >
      <DialogContent
        className="sm:max-w-[420px]"
        onPointerDownOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
      >
        {/* Header */}
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ShieldAlert className="h-5 w-5 text-red-500" />
            {title}
          </DialogTitle>
        </DialogHeader>

        {/* Reason */}
        <div className="space-y-2">
          <label className="text-sm font-medium">
            Reason <span className="text-red-500">*</span>
          </label>

          <Select
            value={reason}
            onValueChange={(value) => setReason(value as ReportReason)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select a reason" />
            </SelectTrigger>
            <SelectContent>
              {Object.values(ReportReason).map((reason) => (
                <SelectItem key={reason} value={reason}>
                  {REPORT_REASON_LABELS[reason]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Message */}
        <div className="space-y-2">
          <label className="text-sm font-medium">
            Additional details (optional)
          </label>
          <Textarea
            placeholder="Provide more context if needed..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={4}
          />
        </div>

        {/* Actions */}
        <DialogFooter className="mt-4">
          <Button variant="outline" onClick={onClose} disabled={isPending}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleSubmit}
            disabled={!reason || isPending}
          >
            {isPending ? "Submitting..." : "Submit Report"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
