import { useState } from "react";
import { useWalletTopup } from "../../hooks/Wallet/walletHooks";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import { Loader2 } from "lucide-react";

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function AddFundsModal({ open, onClose }: Props) {
  const [amount, setAmount] = useState<string>("");
  const { mutate, isPending } = useWalletTopup();

  const handleProceed = () => {
    const numAmount = Number(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      return;
    }
    mutate(numAmount, {
      onSuccess: () => onClose(),
    });
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md rounded-3xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-slate-900">
            Add Capital
          </DialogTitle>
          <p className="text-sm text-slate-500">
            Enter the amount you'd like to top up.
          </p>
        </DialogHeader>

        <div className="py-6 space-y-4">
          <div className="space-y-2">
            <Label
              htmlFor="amount"
              className="text-xs font-bold text-slate-400 uppercase tracking-wider"
            >
              Amount (INR)
            </Label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-slate-400 text-lg">
                ₹
              </span>
              <Input
                id="amount"
                type="number"
                placeholder="0.00"
                className="pl-8 h-14 text-xl font-bold bg-slate-50 border-slate-200 rounded-2xl focus-visible:ring-blue-500"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2">
            {[1000, 5000, 10000].map((val) => (
              <Button
                key={val}
                variant="outline"
                size="sm"
                className="rounded-xl font-bold text-slate-600 border-slate-200"
                onClick={() => setAmount(val.toString())}
              >
                +₹{val / 1000}k
              </Button>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <Button
            onClick={handleProceed}
            disabled={isPending || !amount}
            className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-bold shadow-lg shadow-blue-500/20"
          >
            {isPending ? (
              <Loader2 className="animate-spin mr-2" />
            ) : (
              "Proceed to Payment"
            )}
          </Button>
          <Button
            variant="ghost"
            onClick={onClose}
            className="text-slate-400 font-medium"
          >
            Cancel
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
