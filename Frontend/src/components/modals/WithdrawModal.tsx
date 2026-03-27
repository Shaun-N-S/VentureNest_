import { useState } from "react";
import { Button } from "../ui/button";

export default function WithdrawModal({
  open,
  onClose,
  onSubmit,
}: {
  open: boolean;
  onClose: () => void;
  onSubmit: (amount: number, reason: string) => void;
}) {
  const [amount, setAmount] = useState("");
  const [reason, setReason] = useState("");
  const [errors, setErrors] = useState<{ amount?: string; reason?: string }>({});

  if (!open) return null;

  const validate = () => {
    const newErrors: { amount?: string; reason?: string } = {};

    const numAmount = Number(amount);

    if (!amount) {
      newErrors.amount = "Amount is required";
    } else if (isNaN(numAmount)) {
      newErrors.amount = "Enter a valid number";
    } else if (numAmount <= 0) {
      newErrors.amount = "Amount must be greater than 0";
    }

    if (!reason.trim()) {
      newErrors.reason = "Reason is required";
    } else if (reason.trim().length < 5) {
      newErrors.reason = "Reason must be at least 5 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;

    onSubmit(Number(amount), reason.trim());
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center px-4">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-xl p-6 space-y-5 animate-in fade-in zoom-in-95">

        {/* Header */}
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">Withdraw Funds</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition"
          >
            ✕
          </button>
        </div>

        {/* Amount */}
        <div className="space-y-1">
          <label className="text-sm text-gray-600">Amount</label>
          <input
            type="number"
            placeholder="Enter amount"
            value={amount}
            onChange={(e) => {
              setAmount(e.target.value);
              setErrors((prev) => ({ ...prev, amount: "" }));
            }}
            className={`w-full p-2.5 rounded-lg outline-none transition border ${
              errors.amount
                ? "border-red-500 focus:ring-red-500"
                : "border-gray-300 focus:border-black focus:ring-black"
            }`}
          />
          {errors.amount && (
            <p className="text-xs text-red-500">{errors.amount}</p>
          )}
        </div>

        {/* Reason */}
        <div className="space-y-1">
          <label className="text-sm text-gray-600">Reason</label>
          <textarea
            placeholder="Why are you withdrawing?"
            value={reason}
            onChange={(e) => {
              setReason(e.target.value);
              setErrors((prev) => ({ ...prev, reason: "" }));
            }}
            rows={3}
            className={`w-full p-2.5 rounded-lg outline-none resize-none transition border ${
              errors.reason
                ? "border-red-500 focus:ring-red-500"
                : "border-gray-300 focus:border-black focus:ring-black"
            }`}
          />
          {errors.reason && (
            <p className="text-xs text-red-500">{errors.reason}</p>
          )}
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-2">
          <Button
            variant="ghost"
            onClick={onClose}
            className="px-4 py-2 rounded-lg"
          >
            Cancel
          </Button>

          <Button
            onClick={handleSubmit}
            className="px-4 py-2 rounded-lg"
          >
            Submit Request
          </Button>
        </div>
      </div>
    </div>
  );
}