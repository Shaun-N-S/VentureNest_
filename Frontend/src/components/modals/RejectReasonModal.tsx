import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "../../components/ui/dialog";
import { Textarea } from "../../components/ui/textarea";
import { Button } from "../../components/ui/button";
import { XCircle } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";

interface RejectReasonModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (reason: string) => void;
    title?: string;
    label?: string;
}

export default function RejectReasonModal({
    isOpen,
    onClose,
    onSubmit,
    title = "Reject Verification",
    label = "Reason for rejection",
}: RejectReasonModalProps) {
    const [reason, setReason] = useState("");

    const handleSubmit = () => {
        if (!reason.trim()) return;
        onSubmit(reason);
        setReason("");
        onClose();
    };

    const handleClose = () => {
        setReason("");
        onClose();
    };

    return (
        <Dialog open={isOpen} onOpenChange={handleClose}>
            <DialogContent className="max-w-md rounded-xl p-0 overflow-hidden">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    transition={{ duration: 0.2 }}
                    className="p-6"
                >
                    <DialogHeader className="flex flex-row items-center gap-2">
                        <XCircle className="text-red-500" />
                        <DialogTitle className="text-xl font-semibold">{title}</DialogTitle>
                    </DialogHeader>

                    <div className="mt-4">
                        <label className="text-sm font-medium text-gray-700">{label}</label>
                        <Textarea
                            placeholder="Enter reason..."
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                            className="mt-2 min-h-[120px] resize-none"
                        />
                    </div>

                    <DialogFooter className="mt-6 flex justify-end gap-2">
                        <Button variant="outline" onClick={handleClose}>
                            Cancel
                        </Button>

                        <Button
                            variant="destructive"
                            onClick={handleSubmit}
                            disabled={!reason.trim()}
                            className="bg-red-600 hover:bg-red-700"
                        >
                            Reject
                        </Button>
                    </DialogFooter>
                </motion.div>
            </DialogContent>
        </Dialog>
    );
}
