import { motion } from "framer-motion";
import { CheckCircle, Sparkles, ArrowRight } from "lucide-react";
import { Button } from "../../components/ui/button";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import type { Rootstate } from "../../store/store";

export default function PaymentSuccess() {
  const navigate = useNavigate();

  const role = useSelector((state: Rootstate) => state.authData.role);

  const handleGoHome = () => {
    if (role === "INVESTOR") {
      navigate("/investor/home");
    } else {
      navigate("/home");
    }
  };

  const handleViewPlans = () => {
    if (role === "INVESTOR") {
      navigate("/investor/plans");
    } else {
      navigate("/plans");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-purple-50 px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative max-w-lg w-full bg-white rounded-3xl shadow-2xl p-8 sm:p-10 text-center overflow-hidden"
      >
        {/* 🔥 Glow (FIXED: pointer-events-none) */}
        <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-indigo-500 to-purple-500 opacity-20 blur-2xl pointer-events-none" />

        {/* Icon */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="relative z-10 mx-auto w-20 h-20 flex items-center justify-center rounded-full bg-green-100 mb-6"
        >
          <CheckCircle size={42} className="text-green-600" />
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-3"
        >
          Payment Successful 🎉
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-gray-600 text-base sm:text-lg leading-relaxed mb-6"
        >
          Your subscription has been activated successfully.
          <br />
          You now have full access to your plan features.
        </motion.p>

        {/* Highlight */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mb-8 p-4 rounded-xl bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-100"
        >
          <div className="flex items-center justify-center gap-2 text-indigo-700 font-semibold text-sm">
            <Sparkles size={16} />
            Subscription is now active
          </div>
        </motion.div>

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="relative z-10 flex flex-col sm:flex-row gap-3"
        >
          <Button
            onClick={handleGoHome}
            className="flex-1 h-12 text-base font-bold rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-lg shadow-indigo-500/30"
          >
            Go to Home
            <ArrowRight className="ml-2" size={18} />
          </Button>

          <Button
            variant="outline"
            onClick={handleViewPlans}
            className="flex-1 h-12 text-base font-semibold rounded-xl border-2"
          >
            View Plans
          </Button>
        </motion.div>

        {/* Footer */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-6 text-xs text-gray-500"
        >
          You will also receive a confirmation email shortly.
        </motion.p>
      </motion.div>
    </div>
  );
}
