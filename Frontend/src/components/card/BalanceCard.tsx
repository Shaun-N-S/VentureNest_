interface Props {
  balance: number;
  available: number;
}

export default function BalanceCard({ balance, available }: Props) {
  return (
    <div className="relative overflow-hidden rounded-[32px] p-8 bg-slate-900 text-white shadow-2xl shadow-blue-900/20">
      {/* Decorative background element */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl -mr-20 -mt-20" />

      <div className="relative z-10 flex flex-col justify-between h-full min-h-[160px]">
        <div>
          <p className="text-blue-400 font-bold text-xs uppercase tracking-[0.2em] mb-1">
            Total Net Worth
          </p>
          <h2 className="text-4xl sm:text-5xl font-black tracking-tighter">
            ₹{balance.toLocaleString()}
          </h2>
        </div>

        <div className="flex justify-between items-end border-t border-white/10 pt-6 mt-6">
          <div>
            <p className="text-slate-400 text-[10px] uppercase font-bold tracking-widest mb-1">
              Available to spend
            </p>
            <p className="text-xl font-bold text-white">
              ₹{available.toLocaleString()}
            </p>
          </div>
          <div className="h-10 w-16 bg-white/10 rounded-lg backdrop-blur-md flex items-center justify-center border border-white/5">
            <span className="text-[10px] font-black italic opacity-50">
              VISA
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
