import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, XCircle, AlertTriangle } from "lucide-react";

interface KYCStatusChangeModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    name: string;
    actionType: "APPROVE" | "REJECT";
}

const KYCStatusChangeModal: React.FC<KYCStatusChangeModalProps> = ({
    isOpen,
    onClose,
    onConfirm,
    name,
    actionType,
}) => {
    const isApprove = actionType === "APPROVE";

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    key="backdrop"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
                    onClick={onClose}
                >
                    <motion.div
                        key="modal"
                        initial={{ opacity: 0, scale: 0.9, y: 30 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        transition={{ duration: 0.25, ease: "easeOut" }}
                        onClick={(e) => e.stopPropagation()}
                        className="bg-white p-8 rounded-2xl shadow-2xl w-[90%] max-w-sm text-center space-y-6 relative"
                    >
                        {/* Close Button */}
                        <button
                            onClick={onClose}
                            className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 transition"
                        >
                            <XCircle size={22} />
                        </button>

                        {/* Icon */}
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: "spring", stiffness: 300, damping: 15 }}
                            className={`mx-auto w-16 h-16 rounded-full flex items-center justify-center shadow-inner ${isApprove ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"
                                }`}
                        >
                            {isApprove ? (
                                <CheckCircle2 className="w-8 h-8" />
                            ) : (
                                <AlertTriangle className="w-8 h-8" />
                            )}
                        </motion.div>

                        {/* Title */}
                        <h2 className="text-xl font-semibold text-gray-800 leading-snug">
                            {isApprove
                                ? `Approve KYC for ${name}?`
                                : `Reject KYC for ${name}?`}
                        </h2>

                        {/* Buttons */}
                        <div className="flex justify-center gap-4 pt-2">
                            <motion.button
                                whileTap={{ scale: 0.95 }}
                                onClick={onClose}
                                className="px-5 py-2.5 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 transition-all duration-200"
                            >
                                Cancel
                            </motion.button>

                            <motion.button
                                whileTap={{ scale: 0.95 }}
                                onClick={onConfirm}
                                className={`px-5 py-2.5 rounded-lg text-white font-medium shadow-md transition-all duration-200 ${isApprove
                                        ? "bg-green-600 hover:bg-green-700"
                                        : "bg-red-600 hover:bg-red-700"
                                    }`}
                            >
                                {isApprove ? "Approve" : "Reject"}
                            </motion.button>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default KYCStatusChangeModal;
