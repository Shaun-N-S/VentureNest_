import { Dialog, DialogContent } from "../ui/dialog";
import { Button } from "../ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, X, Sparkles, Clock, Shield, Zap } from "lucide-react";
import type { Plan } from "../../types/planType";
import { useCreateCheckout } from "../../hooks/Subscription/subscriptionHooks";
import { getPlanPermissions } from "@/utils/planPermissions";

interface Props {
  plan: Plan;
  onClose: () => void;
}

type Feature = {
  label: string;
  value: number | boolean;
};

export default function PurchasePlanModal({ plan, onClose }: Props) {
  const { mutate: startCheckout, isPending } = useCreateCheckout();

  const baseFeatures: Feature[] =
    plan.role === "USER"
      ? [
          ...(plan.limits.projects > 0
            ? [{ label: "Projects", value: plan.limits.projects }]
            : []),
          ...(plan.limits.proposalsPerMonth > 0
            ? [
                {
                  label: "Proposals per month",
                  value: plan.limits.proposalsPerMonth,
                },
              ]
            : []),
        ]
      : [
          ...(plan.limits.investmentOffers > 0
            ? [
                {
                  label: "Investment offers",
                  value: plan.limits.investmentOffers,
                },
              ]
            : []),
        ];

  const features: Feature[] = [
    ...baseFeatures,
    ...getPlanPermissions(plan.permissions).map((p) => ({
      label: p.label,
      value: true,
    })),
  ];

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="w-[calc(100vw-24px)] max-w-lg p-0 overflow-hidden rounded-2xl border-0 shadow-2xl bg-white gap-0 sm:w-full sm:max-w-lg sm:rounded-3xl">
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 16 }}
            transition={{ duration: 0.28, ease: "easeOut" }}
            className="relative flex flex-col max-h-[90vh] overflow-y-auto"
          >
            {/* ── Header ── */}
            <div className="relative overflow-hidden bg-gradient-to-br from-violet-600 via-indigo-600 to-blue-700 px-5 pt-6 pb-20 sm:px-7 sm:pt-8 sm:pb-24 flex-shrink-0">
              {/* Soft orb accents */}
              <div
                aria-hidden
                className="pointer-events-none absolute -top-8 -left-8 w-48 h-48 rounded-full bg-white/10 blur-2xl"
              />
              <div
                aria-hidden
                className="pointer-events-none absolute -bottom-10 -right-10 w-56 h-56 rounded-full bg-white/10 blur-2xl"
              />

              {/* Close */}
              <button
                onClick={onClose}
                aria-label="Close"
                className="absolute top-3 right-3 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white/20 hover:bg-white/30 active:scale-95 transition-all backdrop-blur-sm sm:top-4 sm:right-4"
              >
                <X size={16} className="text-white" />
              </button>

              {/* Badge */}
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.08 }}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 mb-3"
              >
                <Sparkles size={12} className="text-white/90" />
                <span className="text-[11px] font-semibold text-white uppercase tracking-widest">
                  {plan.role} Plan
                </span>
              </motion.div>

              {/* Title */}
              <motion.h2
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.14 }}
                className="text-2xl font-bold text-white mb-1.5 sm:text-3xl leading-tight"
              >
                {plan.name}
              </motion.h2>

              {/* Description */}
              <motion.p
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-sm text-white/80 leading-relaxed max-w-xs sm:text-base sm:max-w-sm"
              >
                {plan.description}
              </motion.p>
            </div>

            {/* ── Price card (overlapping header) ── */}
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.26 }}
              className="relative -mt-12 mx-4 sm:-mt-14 sm:mx-6 mb-5 p-4 sm:p-5 rounded-xl sm:rounded-2xl bg-white shadow-xl border border-gray-100 flex-shrink-0"
            >
              <div className="flex items-center justify-between gap-3 flex-wrap">
                {/* Price */}
                <div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-black sm:text-4xl bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">
                      ₹{plan.billing.price}
                    </span>
                  </div>
                  <p className="mt-0.5 text-xs font-medium text-gray-400 flex items-center gap-1 sm:text-sm">
                    <Clock size={12} />
                    Valid for {plan.billing.durationDays} days
                  </p>
                </div>

                {/* Trust badge */}
                <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-emerald-50 border border-emerald-200">
                  <Shield size={13} className="text-emerald-600" />
                  <span className="text-[11px] font-semibold text-emerald-700 sm:text-xs">
                    Secure Payment
                  </span>
                </div>
              </div>
            </motion.div>

            {/* ── Features ── */}
            <div className="px-4 pb-5 sm:px-6 sm:pb-6">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.32 }}
                className="mb-4"
              >
                <h3 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2 sm:text-base">
                  <div className="w-1 h-4 bg-gradient-to-b from-violet-600 to-indigo-600 rounded-full" />
                  What's included
                </h3>

                {/* Feature list — 2-col grid on wide screens */}
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 sm:gap-x-4 sm:gap-y-2.5">
                  {features.map((feature, index) => (
                    <motion.div
                      key={feature.label}
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.38 + index * 0.07 }}
                      className="flex items-start gap-2.5 group"
                    >
                      <div className="flex-shrink-0 mt-0.5 w-5 h-5 rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center shadow-sm">
                        <CheckCircle className="text-white" size={11} />
                      </div>
                      <span className="text-sm text-gray-700 font-medium leading-snug group-hover:text-gray-900 transition-colors">
                        {typeof feature.value === "number"
                          ? `${feature.value === -1 ? "Unlimited" : feature.value} ${feature.label}`
                          : feature.label}
                      </span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* ── Instant activation callout ── */}
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="mb-4 p-3.5 sm:p-4 rounded-xl bg-gradient-to-r from-violet-50 to-indigo-50 border border-violet-100"
              >
                <div className="flex items-start gap-2.5">
                  <Zap
                    size={15}
                    className="text-violet-600 flex-shrink-0 mt-0.5"
                    fill="currentColor"
                  />
                  <div>
                    <p className="text-xs font-semibold text-gray-900 mb-0.5 sm:text-sm">
                      Instant Activation
                    </p>
                    <p className="text-[11px] text-gray-500 leading-relaxed sm:text-xs">
                      Get started immediately after purchase. Cancel anytime
                      with no questions asked.
                    </p>
                  </div>
                </div>
              </motion.div>

              {/* ── Action buttons ── */}
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.68 }}
                className="flex flex-col gap-2.5 sm:flex-row sm:gap-3"
              >
                <Button
                  variant="outline"
                  onClick={onClose}
                  className="flex-1 h-11 text-sm font-semibold rounded-xl border-2 border-gray-200 hover:bg-gray-50 active:scale-[0.98] transition-all sm:h-12 sm:text-base"
                >
                  Maybe Later
                </Button>
                <Button
                  disabled={isPending}
                  onClick={() => startCheckout(plan._id)}
                  className="flex-1 h-11 text-sm font-bold rounded-xl
                    bg-gradient-to-r from-violet-600 to-indigo-600
                    hover:from-violet-700 hover:to-indigo-700
                    active:scale-[0.98]
                    shadow-md shadow-violet-200
                    transition-all duration-200
                    disabled:opacity-60 disabled:cursor-not-allowed
                    sm:h-12 sm:text-base"
                >
                  {isPending ? (
                    <span className="flex items-center gap-2">
                      <svg
                        className="animate-spin h-4 w-4 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                        />
                      </svg>
                      Redirecting…
                    </span>
                  ) : (
                    "Purchase Plan"
                  )}
                </Button>
              </motion.div>

              {/* Fine print */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.76 }}
                className="mt-3 text-[10px] text-center text-gray-400 sm:text-xs"
              >
                By purchasing, you agree to our{" "}
                <span className="underline underline-offset-2 cursor-pointer hover:text-gray-600 transition-colors">
                  terms of service
                </span>{" "}
                and{" "}
                <span className="underline underline-offset-2 cursor-pointer hover:text-gray-600 transition-colors">
                  privacy policy
                </span>
              </motion.p>
            </div>
          </motion.div>
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
}
