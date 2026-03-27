import { useState } from "react";
import { Dialog } from "@headlessui/react";
import { Button } from "../ui/button";

interface Props {
  open: boolean;
  onClose: () => void;
  onSubmit: (amount: number) => void;
  loading?: boolean;
}

export default function BankWithdrawModal({
  open,
  onClose,
  onSubmit,
  loading,
}: Props) {
  const [amount, setAmount] = useState(0);

  const handleSubmit = () => {
    if (amount <= 0) return;
    onSubmit(amount);
  };

  return (
    <Dialog open={open} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
        <div className="bg-white rounded-2xl p-6 w-full max-w-md space-y-4">
          <h2 className="text-lg font-bold">Withdraw to Bank</h2>

          <input
            type="number"
            placeholder="Enter amount"
            className="w-full border rounded-xl p-3"
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
          />

          <Button onClick={handleSubmit} disabled={loading} className="w-full">
            {loading ? "Processing..." : "Withdraw"}
          </Button>
        </div>
      </div>
    </Dialog>
  );
}
