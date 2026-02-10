import type { Transaction } from "../../types/wallet";

interface Props {
  transactions: Transaction[];
}

export default function TransactionsTable({ transactions }: Props) {
  return (
    <div className="bg-slate-100 rounded-xl overflow-hidden">
      <div className="grid grid-cols-4 gap-4 px-4 py-2 text-sm font-semibold">
        <span>Description</span>
        <span>Payment</span>
        <span>Status</span>
        <span className="text-right">Amount</span>
      </div>

      {transactions.map((tx) => (
        <div
          key={tx.id}
          className="grid grid-cols-4 gap-4 px-4 py-3 bg-white border-t"
        >
          <div>
            <p className="font-medium">{tx.description}</p>
            <p className="text-xs text-slate-500">
              {new Date(tx.createdAt).toDateString()}
            </p>
          </div>
          <span>{tx.paymentMethod}</span>
          <span className="text-green-600">{tx.status}</span>
          <span className="text-right font-semibold">₹{tx.amount}</span>
        </div>
      ))}
    </div>
  );
}
