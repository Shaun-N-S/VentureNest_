import { motion } from "framer-motion";
import { Crown, ArrowRight, Check } from "lucide-react";
import { Button } from "../ui/button";
import type { Plan } from "../../types/planType";

interface Props {
  plan: Plan;
  index: number;
  isTrending?: boolean;
  onSelect: () => void;
}

export default function PlanCard({
  plan,
  index,
  isTrending = false,
  onSelect,
}: Props) {
  const features =
    plan.role === "USER"
      ? [
          { label: "Projects", value: plan.limits.projects },
          { label: "Proposals per month", value: plan.limits.proposalsPerMonth },
          { label: "Meeting requests", value: plan.limits.meetingRequests },
        ]
      : [
          { label: "Investment offers", value: plan.limits.investmentOffers },
          { label: "Active investments", value: plan.limits.activeInvestments },
        ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      whileHover={{ y: -8, transition: { duration: 0.2 } }}
      className="relative group h-full"
    >
      {/* Glow effect on hover */}
      <div
        className={`absolute -inset-0.5 rounded-3xl opacity-0 group-hover:opacity-100 transition duration-500 blur-xl ${
          isTrending
            ? "bg-gradient-to-r from-indigo-600 to-purple-600"
            : "bg-gradient-to-r from-gray-400 to-gray-600"
        }`}
      />

      {/* Main card */}
      <div
        className={`relative h-full rounded-3xl border bg-white/90 backdrop-blur-xl p-6 sm:p-7 lg:p-8 shadow-lg transition-all duration-300 ${
          isTrending
            ? "border-indigo-200 shadow-indigo-100/50"
            : "border-gray-200 hover:border-gray-300"
        }`}
      >
        {/* TRENDING BADGE */}
        {isTrending && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 + 0.2 }}
            className="absolute -top-3 sm:-top-4 left-1/2 -translate-x-1/2 z-10"
          >
            <div className="px-3 sm:px-4 py-1.5 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-xs font-bold flex items-center gap-1.5 shadow-lg shadow-indigo-500/30">
              <Crown size={14} className="fill-white" />
              <span className="whitespace-nowrap">Most Popular</span>
            </div>
          </motion.div>
        )}

        {/* HEADER */}
        <div className="mb-6 sm:mb-8">
          <div className="flex items-start justify-between mb-3">
            <h3 className="text-2xl sm:text-3xl font-bold text-gray-900">
              {plan.name}
            </h3>
            {isTrending && (
              <div className="w-2 h-2 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 animate-pulse" />
            )}
          </div>
          <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
            {plan.description}
          </p>
        </div>

        {/* PRICE */}
        <div className="mb-6 sm:mb-8">
          <div className="flex items-baseline gap-2 mb-2">
            <span className="text-5xl sm:text-6xl font-black bg-gradient-to-br from-gray-900 to-gray-700 bg-clip-text text-transparent">
              ₹{plan.billing.price}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-px flex-1 bg-gradient-to-r from-gray-200 to-transparent" />
            <span className="text-sm font-medium text-gray-500">
              per {plan.billing.durationDays} days
            </span>
            <div className="h-px flex-1 bg-gradient-to-l from-gray-200 to-transparent" />
          </div>
        </div>

        {/* FEATURES */}
        <div className="mb-6 sm:mb-8 space-y-3 sm:space-y-4">
          {features.map((feature, idx) => (
            <motion.div
              key={feature.label}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 + 0.1 * idx }}
              className="flex items-center gap-3 group/item"
            >
              <div
                className={`flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center transition-colors ${
                  isTrending
                    ? "bg-indigo-100 group-hover/item:bg-indigo-200"
                    : "bg-gray-100 group-hover/item:bg-gray-200"
                }`}
              >
                <Check
                  size={12}
                  className={`transition-colors ${
                    isTrending
                      ? "text-indigo-600"
                      : "text-gray-600"
                  }`}
                />
              </div>
              <div className="flex items-baseline gap-2 flex-1">
                <span className="font-bold text-gray-900">{feature.value}</span>
                <span className="text-sm text-gray-600">{feature.label}</span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA BUTTON */}
        <Button
          onClick={onSelect}
          className={`w-full h-12 sm:h-14 text-base font-bold rounded-xl sm:rounded-2xl transition-all duration-300 group/btn relative overflow-hidden ${
            isTrending
              ? "bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-lg shadow-indigo-500/30 hover:shadow-xl hover:shadow-indigo-500/40"
              : "bg-gray-900 hover:bg-gray-800 shadow-lg shadow-gray-900/20"
          }`}
        >
          <span className="relative z-10 flex items-center justify-center gap-2">
            View Details
            <ArrowRight
              className="transition-transform group-hover/btn:translate-x-1"
              size={18}
            />
          </span>

          {/* Button shine effect */}
          <div className="absolute inset-0 -translate-x-full group-hover/btn:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
        </Button>

        {/* Decorative corner accent */}
        {isTrending && (
          <div className="absolute top-0 right-0 w-24 h-24 overflow-hidden rounded-tr-3xl">
            <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 transform rotate-45 translate-x-8 -translate-y-8" />
          </div>
        )}
      </div>
    </motion.div>
  );
}