import { Dialog, DialogContent } from "../ui/dialog";
import { Button } from "../ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, X, Sparkles, Clock, Shield } from "lucide-react";
import type { Plan } from "../../types/planType";
import { useCreateCheckout } from "../../hooks/Subscription/subscriptionHooks";

interface Props {
  plan: Plan;
  onClose: () => void;
}

export default function PurchasePlanModal({ plan, onClose }: Props) {
  const { mutate: startCheckout, isPending } = useCreateCheckout();

  const features =
    plan.role === "USER"
      ? [
          `${plan.limits.projects} Projects`,
          `${plan.limits.proposalsPerMonth} Proposals / month`,
          `${plan.limits.meetingRequests} Meetings`,
        ]
      : [
          `${plan.limits.investmentOffers} Investment offers`,
          `${plan.limits.activeInvestments} Active investments`,
        ];

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-xl sm:max-w-2xl p-0 overflow-hidden rounded-2xl sm:rounded-3xl border-0 shadow-2xl bg-white">
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            className="relative"
          >
            {/* Header with gradient background */}
            <div className="relative overflow-hidden bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 px-6 sm:px-8 pt-8 pb-24 sm:pb-28">
              {/* Animated background pattern */}
              <div className="absolute inset-0 opacity-10">
                <div className="absolute top-0 left-0 w-40 h-40 bg-white rounded-full blur-3xl animate-pulse" />
                <div className="absolute bottom-0 right-0 w-40 h-40 bg-white rounded-full blur-3xl animate-pulse animation-delay-1000" />
              </div>

              {/* Close button */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors backdrop-blur-sm"
              >
                <X size={20} className="text-white" />
              </button>

              {/* Plan badge */}
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 mb-4"
              >
                <Sparkles size={14} className="text-white" />
                <span className="text-xs font-semibold text-white uppercase tracking-wide">
                  {plan.role} Plan
                </span>
              </motion.div>

              {/* Plan name */}
              <motion.h2
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-3xl sm:text-4xl font-bold text-white mb-3"
              >
                {plan.name}
              </motion.h2>

              {/* Plan description */}
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-base sm:text-lg text-white/90 leading-relaxed max-w-md"
              >
                {plan.description}
              </motion.p>
            </div>

            {/* Price card - overlapping header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="relative -mt-16 mx-6 sm:mx-8 mb-6 p-6 rounded-2xl bg-white shadow-xl border border-gray-100"
            >
              <div className="flex items-baseline justify-between flex-wrap gap-4">
                <div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl sm:text-5xl font-black bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                      ₹{plan.billing.price}
                    </span>
                  </div>
                  <p className="mt-1 text-sm font-medium text-gray-500 flex items-center gap-1.5">
                    <Clock size={14} />
                    Valid for {plan.billing.durationDays} days
                  </p>
                </div>

                {/* Trust badge */}
                <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-green-50 border border-green-200">
                  <Shield size={16} className="text-green-600" />
                  <span className="text-xs font-semibold text-green-700">
                    Secure Payment
                  </span>
                </div>
              </div>
            </motion.div>

            {/* Features section */}
            <div className="px-6 sm:px-8 pb-8">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="mb-6"
              >
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <div className="w-1 h-5 bg-gradient-to-b from-indigo-600 to-purple-600 rounded-full" />
                  What's included
                </h3>

                <div className="space-y-3">
                  {features.map((feature, index) => (
                    <motion.div
                      key={feature}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.6 + index * 0.1 }}
                      className="flex items-start gap-3 group"
                    >
                      <div className="flex-shrink-0 mt-0.5">
                        <div className="w-6 h-6 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center shadow-sm">
                          <CheckCircle className="text-white" size={14} />
                        </div>
                      </div>
                      <span className="text-base text-gray-700 font-medium group-hover:text-gray-900 transition-colors">
                        {feature}
                      </span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* Benefits callout */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9 }}
                className="mb-6 p-4 rounded-xl bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-100"
              >
                <div className="flex items-start gap-3">
                  <Sparkles
                    size={18}
                    className="text-indigo-600 flex-shrink-0 mt-0.5"
                  />
                  <div>
                    <p className="text-sm font-semibold text-gray-900 mb-1">
                      Instant Activation
                    </p>
                    <p className="text-xs text-gray-600 leading-relaxed">
                      Get started immediately after purchase. Cancel anytime
                      with no questions asked.
                    </p>
                  </div>
                </div>
              </motion.div>

              {/* Action buttons */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1 }}
                className="flex flex-col sm:flex-row gap-3"
              >
                <Button
                  variant="outline"
                  onClick={onClose}
                  className="flex-1 h-12 sm:h-14 text-base font-semibold rounded-xl border-2 hover:bg-gray-50"
                >
                  Maybe Later
                </Button>
                <Button
                  disabled={isPending}
                  onClick={() => startCheckout(plan._id)}
                  className="flex-1 h-12 sm:h-14 text-base font-bold rounded-xl
             bg-gradient-to-r from-indigo-600 to-purple-600
             hover:from-indigo-700 hover:to-purple-700
             shadow-lg transition-all duration-300"
                >
                  <span className="relative z-10">
                    {isPending ? "Redirecting..." : "Purchase Plan"}
                  </span>
                </Button>
              </motion.div>

              {/* Fine print */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.1 }}
                className="mt-4 text-xs text-center text-gray-500"
              >
                By purchasing, you agree to our terms of service and privacy
                policy
              </motion.p>
            </div>
          </motion.div>
        </AnimatePresence>

        <style>{`
          .animation-delay-1000 {
            animation-delay: 1s;
          }
        `}</style>
      </DialogContent>
    </Dialog>
  );
}
