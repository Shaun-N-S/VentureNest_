import { useState } from "react";
import { Dialog, DialogContent } from "../ui/dialog";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import toast from "react-hot-toast";

interface Props {
  open: boolean;
  onClose: () => void;
  onWalletPay: (amount: number) => void;
  onStripePay: (amount: number) => void;
  maxAmount: number;
}

export default function TransferPaymentModal({
  open,
  onClose,
  onWalletPay,
  onStripePay,
  maxAmount,
}: Props) {
  const [amount, setAmount] = useState<number>(0);

  const validateAndPay = (type: "wallet" | "stripe") => {
    if (!amount || amount <= 0) {
      return toast.error("Enter a valid amount");
    }

    if (amount > maxAmount) {
      return toast.error("Amount exceeds remaining investment");
    }

    if (type === "wallet") {
      onWalletPay(amount);
    } else {
      onStripePay(amount);
    }

    setAmount(0);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md space-y-4">
        <h2 className="text-lg font-semibold">Transfer Investment</h2>

        <div className="space-y-2">
          <label className="text-sm text-muted-foreground">
            Enter Amount (Max: ${maxAmount.toLocaleString()})
          </label>

          <Input
            type="number"
            placeholder="Enter amount"
            value={amount || ""}
            onChange={(e) => setAmount(Number(e.target.value))}
          />
        </div>

        <Button
          className="w-full"
          variant="outline"
          onClick={() => validateAndPay("wallet")}
        >
          Pay from Wallet
        </Button>

        <Button
          className="w-full bg-primary"
          onClick={() => validateAndPay("stripe")}
        >
          Pay via Stripe
        </Button>
      </DialogContent>
    </Dialog>
  );
}
