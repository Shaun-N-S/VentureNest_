import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import type { Rootstate } from "../../store/store";

// Floating particle for background ambiance
const FloatingDot = ({
  x,
  y,
  size,
  delay,
}: {
  x: number;
  y: number;
  size: number;
  delay: number;
}) => (
  <motion.div
    style={{
      position: "absolute",
      left: `${x}%`,
      top: `${y}%`,
      width: size,
      height: size,
      borderRadius: "50%",
      background: "rgba(239,68,68,0.12)",
      pointerEvents: "none",
    }}
    animate={{ y: [0, -18, 0], opacity: [0.4, 0.8, 0.4] }}
    transition={{
      delay,
      duration: 3 + delay,
      repeat: Infinity,
      ease: "easeInOut",
    }}
  />
);

const floatingDots = [
  { x: 8, y: 20, size: 10, delay: 0 },
  { x: 88, y: 15, size: 7, delay: 0.8 },
  { x: 92, y: 70, size: 12, delay: 1.4 },
  { x: 5, y: 75, size: 8, delay: 0.5 },
  { x: 50, y: 5, size: 6, delay: 1.1 },
  { x: 70, y: 88, size: 9, delay: 0.3 },
];

export default function PaymentCancelled() {
  const navigate = useNavigate();
  const role = useSelector((state: Rootstate) => state.authData.role);

  const handleGoHome = () => {
    if (role === "INVESTOR") navigate("/investor/home");
    else navigate("/home");
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px 16px",
        background:
          "linear-gradient(150deg, #fff5f5 0%, #fafafa 45%, #fff8f0 100%)",
        fontFamily: "'Plus Jakarta Sans', sans-serif",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&family=Cormorant+Garamond:wght@700&display=swap');
        .pc-primary { transition: transform 0.18s ease, box-shadow 0.18s ease !important; }
        .pc-primary:hover { transform: translateY(-2px) !important; box-shadow: 0 16px 40px rgba(239,68,68,0.28) !important; }
        .pc-primary:active { transform: translateY(0) !important; }
        .pc-secondary { transition: transform 0.18s ease, background 0.18s ease, border-color 0.18s ease !important; }
        .pc-secondary:hover { transform: translateY(-1px) !important; background: #fef2f2 !important; border-color: #fca5a5 !important; }
      `}</style>

      {/* Blobs */}
      <div
        style={{
          position: "absolute",
          top: "-60px",
          right: "-60px",
          width: 300,
          height: 300,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(239,68,68,0.07) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: "-60px",
          left: "-60px",
          width: 260,
          height: 260,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(251,146,60,0.06) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />

      {/* Dot grid */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          backgroundImage:
            "radial-gradient(rgba(239,68,68,0.06) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
          maskImage:
            "radial-gradient(ellipse 70% 70% at 50% 50%, black 30%, transparent 100%)",
          WebkitMaskImage:
            "radial-gradient(ellipse 70% 70% at 50% 50%, black 30%, transparent 100%)",
        }}
      />

      {/* Floating dots */}
      {floatingDots.map((d, i) => (
        <FloatingDot key={i} {...d} />
      ))}

      <motion.div
        initial={{ opacity: 0, y: 36, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
        style={{
          position: "relative",
          maxWidth: 440,
          width: "100%",
          background: "#ffffff",
          borderRadius: 28,
          padding: "52px 44px 44px",
          textAlign: "center",
          boxShadow:
            "0 4px 6px rgba(0,0,0,0.02), 0 20px 60px rgba(239,68,68,0.08)",
          border: "1px solid rgba(239,68,68,0.1)",
          overflow: "hidden",
        }}
      >
        {/* Top accent bar - warm red-to-orange */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: 4,
            background: "linear-gradient(90deg, #ef4444 0%, #f97316 100%)",
            borderRadius: "28px 28px 0 0",
          }}
        />

        {/* Icon */}
        <motion.div
          initial={{ scale: 0, rotate: 20 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{
            delay: 0.2,
            type: "spring",
            stiffness: 220,
            damping: 18,
          }}
          style={{
            position: "relative",
            display: "inline-block",
            marginBottom: 28,
          }}
        >
          {/* Shake animation on icon */}
          <motion.div
            animate={{ rotate: [-3, 3, -3, 3, 0] }}
            transition={{ delay: 0.7, duration: 0.5 }}
            style={{ position: "relative" }}
          >
            <div
              style={{
                width: 84,
                height: 84,
                borderRadius: "50%",
                background: "linear-gradient(135deg, #fee2e2 0%, #fecaca 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 8px 24px rgba(239,68,68,0.18)",
              }}
            >
              {/* X mark SVG */}
              <svg width="36" height="36" viewBox="0 0 40 40" fill="none">
                <motion.path
                  d="M13 13L27 27"
                  stroke="#dc2626"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ delay: 0.4, duration: 0.35, ease: "easeOut" }}
                />
                <motion.path
                  d="M27 13L13 27"
                  stroke="#dc2626"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ delay: 0.55, duration: 0.35, ease: "easeOut" }}
                />
              </svg>
            </div>
          </motion.div>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: "clamp(1.9rem, 5vw, 2.3rem)",
            fontWeight: 700,
            color: "#111827",
            lineHeight: 1.15,
            marginBottom: 12,
            letterSpacing: "-0.01em",
          }}
        >
          Payment Cancelled
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.45 }}
          style={{
            color: "#6b7280",
            fontSize: "0.925rem",
            lineHeight: 1.7,
            marginBottom: 28,
            fontWeight: 400,
          }}
        >
          Your payment was not completed.
          <br />
          No charges have been made to your account.
        </motion.p>

        {/* Status badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.55 }}
          style={{ marginBottom: 32 }}
        >
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 7,
              background: "#fff5f5",
              border: "1px solid #fecaca",
              borderRadius: 999,
              padding: "7px 18px",
              fontSize: "0.78rem",
              color: "#b91c1c",
              fontWeight: 600,
              letterSpacing: "0.05em",
              textTransform: "uppercase",
            }}
          >
            <span
              style={{
                width: 7,
                height: 7,
                borderRadius: "50%",
                background: "#ef4444",
                boxShadow: "0 0 0 3px rgba(239,68,68,0.18)",
                display: "inline-block",
              }}
            />
            Transaction cancelled
          </span>
        </motion.div>

        {/* Info box */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.62 }}
          style={{
            background: "#fafafa",
            border: "1px solid #f3f4f6",
            borderRadius: 14,
            padding: "16px 20px",
            marginBottom: 28,
            textAlign: "left",
          }}
        >
          {[
            { icon: "💳", text: "No payment was charged to your card" },
          ].map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.65 + i * 0.08 }}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: "5px 0",
                fontSize: "0.845rem",
                color: "#4b5563",
                fontWeight: 500,
              }}
            >
              <span style={{ fontSize: "1rem" }}>{item.icon}</span>
              {item.text}
            </motion.div>
          ))}
        </motion.div>

        {/* Divider */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 0.72, duration: 0.5 }}
          style={{
            height: 1,
            background:
              "linear-gradient(90deg, transparent, #e5e7eb, transparent)",
            marginBottom: 24,
          }}
        />

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.78 }}
          style={{ display: "flex", flexDirection: "column", gap: 10 }}
        >

          {/* Secondary: Go Home */}
          <button
            onClick={handleGoHome}
            className="pc-secondary"
            style={{
              width: "100%",
              height: 48,
              fontSize: "0.9rem",
              fontWeight: 600,
              borderRadius: 14,
              background: "#ffffff",
              border: "1.5px solid #e5e7eb",
              color: "#374151",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
              cursor: "pointer",
              fontFamily: "'Plus Jakarta Sans', sans-serif",
            }}
          >
            Go to Home <ArrowRight size={16} />
          </button>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.92 }}
          style={{ marginTop: 20, fontSize: "0.75rem", color: "#9ca3af" }}
        >
          Facing an issue? Contact our support team anytime.
        </motion.p>
      </motion.div>
    </div>
  );
}
