import { useEffect, useState } from "react";

type OTPModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onVerify: (otp: string) => void;
};

const OTPModal = ({ isOpen, onClose, onVerify }: OTPModalProps) => {
  const [otp, setOtp] = useState("");
  const [timer, setTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);

  useEffect(() => {
    if (!isOpen) return;

    setOtp("");
    setTimer(60);
    setCanResend(false);

    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setCanResend(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isOpen]);

  const handleResend = () => {
    setTimer(60);
    setCanResend(false);
    // Call resend OTP API here
  };

  const handleVerify = () => {
    if (otp.length === 6) {
      onVerify(otp);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black opacity-30"
        onClick={onClose} // click outside to close
      />

      {/* Modal */}
      <div className="relative bg-white rounded-3xl w-96 max-w-xs p-8 shadow-2xl animate-fadeIn">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">Enter OTP</h2>
        <p className="text-gray-500 mb-6">We sent a 6-digit OTP to your email or phone.</p>

        <input
          type="text"
          value={otp}
          onChange={(e) => setOtp(e.target.value.replace(/\D/, "").slice(0, 6))}
          placeholder="Enter OTP"
          className="w-full text-center text-xl tracking-widest py-3 border rounded-xl border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:outline-none mb-4"
        />

        <div className="flex justify-between items-center mb-6 text-sm text-gray-500">
          <span>Expires in: {timer}s</span>
          <button
            disabled={!canResend}
            onClick={handleResend}
            className={`text-indigo-600 font-semibold hover:underline ${
              !canResend ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            Resend OTP
          </button>
        </div>

        <div className="flex gap-4">
          <button
            onClick={onClose}
            className="flex-1 bg-gray-200 py-2 rounded-xl font-semibold hover:bg-gray-300 transition"
          >
            Cancel
          </button>
          <button
            onClick={handleVerify}
            className="flex-1 bg-indigo-600 text-white py-2 rounded-xl font-semibold hover:bg-indigo-700 transition"
          >
            Verify
          </button>
        </div>
      </div>
    </div>
  );
};

export default OTPModal;
