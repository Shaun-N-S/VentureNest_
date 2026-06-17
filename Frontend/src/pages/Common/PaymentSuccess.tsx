import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import type { Rootstate } from "../../store/store";
import { useCurrentSubscription } from "@/hooks/Subscription/subscriptionHooks";
import { formatDateTime } from "@/utils/dateFormatter";

const ConfettiPiece = ({
  delay,
  x,
  color,
  shape,
}: {
  delay: number;
  x: number;
  color: string;
  shape: "circle" | "rect";
}) => (
  <motion.div
    style={{
      position: "absolute",
      top: -10,
      left: `${x}%`,
      width: shape === "circle" ? 8 : 6,
      height: shape === "circle" ? 8 : 10,
      borderRadius: shape === "circle" ? "50%" : 2,
      backgroundColor: color,
    }}
    initial={{ y: -10, opacity: 1, rotate: 0 }}
    animate={{ y: 400, opacity: 0, rotate: 420 }}
    transition={{ delay, duration: 2, ease: "easeIn" }}
  />
);

const confettiItems: {
  x: number;
  color: string;
  delay: number;
  shape: "circle" | "rect";
}[] = [
  { x: 8, color: "#6366f1", delay: 0.2, shape: "rect" },
  { x: 18, color: "#f59e0b", delay: 0.45, shape: "circle" },
  { x: 30, color: "#10b981", delay: 0.1, shape: "rect" },
  { x: 42, color: "#ec4899", delay: 0.7, shape: "circle" },
  { x: 52, color: "#6366f1", delay: 0.35, shape: "rect" },
  { x: 63, color: "#f59e0b", delay: 0.55, shape: "circle" },
  { x: 74, color: "#10b981", delay: 0.15, shape: "rect" },
  { x: 84, color: "#ec4899", delay: 0.8, shape: "circle" },
  { x: 22, color: "#a78bfa", delay: 0.6, shape: "rect" },
  { x: 58, color: "#34d399", delay: 0.9, shape: "circle" },
  { x: 90, color: "#6366f1", delay: 0.25, shape: "rect" },
];

export default function PaymentSuccess() {
  const navigate = useNavigate();
  const role = useSelector((state: Rootstate) => state.authData.role);
  const { data: subscription, isLoading } = useCurrentSubscription();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        Loading...
      </div>
    );
  }

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
          "linear-gradient(150deg, #f0f4ff 0%, #fafafa 45%, #f5f0ff 100%)",
        fontFamily: "'Plus Jakarta Sans', sans-serif",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&family=Cormorant+Garamond:wght@700&display=swap');
        .ps-btn { transition: transform 0.18s ease, box-shadow 0.18s ease !important; }
        .ps-btn:hover { transform: translateY(-2px) !important; box-shadow: 0 16px 40px rgba(99,102,241,0.35) !important; }
        .ps-btn:active { transform: translateY(0px) !important; }
      `}</style>

      {/* Decorative blobs */}
      <div
        style={{
          position: "absolute",
          top: "-80px",
          right: "-80px",
          width: 340,
          height: 340,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(99,102,241,0.08) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: "-60px",
          left: "-60px",
          width: 280,
          height: 280,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(168,85,247,0.07) 0%, transparent 70%)",
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
            "radial-gradient(rgba(99,102,241,0.07) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
          maskImage:
            "radial-gradient(ellipse 70% 70% at 50% 50%, black 30%, transparent 100%)",
          WebkitMaskImage:
            "radial-gradient(ellipse 70% 70% at 50% 50%, black 30%, transparent 100%)",
        }}
      />

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
            "0 4px 6px rgba(0,0,0,0.02), 0 20px 60px rgba(99,102,241,0.1)",
          border: "1px solid rgba(99,102,241,0.1)",
          overflow: "hidden",
        }}
      >
        {/* Top accent bar */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: 4,
            background:
              "linear-gradient(90deg, #6366f1 0%, #8b5cf6 50%, #10b981 100%)",
            borderRadius: "28px 28px 0 0",
          }}
        />

        {/* Confetti */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            overflow: "hidden",
            pointerEvents: "none",
          }}
        >
          {confettiItems.map((c, i) => (
            <ConfettiPiece key={i} {...c} />
          ))}
        </div>

        {/* Icon */}
        <motion.div
          initial={{ scale: 0, rotate: -20 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{
            delay: 0.2,
            type: "spring",
            stiffness: 240,
            damping: 18,
          }}
          style={{
            position: "relative",
            display: "inline-block",
            marginBottom: 28,
          }}
        >
          <motion.div
            animate={{ scale: [1, 1.22, 1], opacity: [0.35, 0, 0.35] }}
            transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut" }}
            style={{
              position: "absolute",
              inset: -10,
              borderRadius: "50%",
              border: "2px solid #10b981",
            }}
          />
          <div
            style={{
              width: 84,
              height: 84,
              borderRadius: "50%",
              background: "linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 8px 24px rgba(16,185,129,0.22)",
            }}
          >
            <svg width="38" height="38" viewBox="0 0 40 40" fill="none">
              <motion.path
                d="M10 21L17 28L31 14"
                stroke="#059669"
                strokeWidth="3.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ delay: 0.45, duration: 0.55, ease: "easeOut" }}
              />
            </svg>
          </div>
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
          {subscription?.plan ? "Subscription Activated" : "Payment Confirmed"}
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
          {subscription?.plan ? (
            <>
              Your subscription has been activated successfully.
              <br />
              Enjoy your premium features.
            </>
          ) : (
            <>
              Your payment was processed successfully.
              <br />A confirmation email is on its way to you.
            </>
          )}
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
              background: "#f0fdf4",
              border: "1px solid #bbf7d0",
              borderRadius: 999,
              padding: "7px 18px",
              fontSize: "0.78rem",
              color: "#15803d",
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
                background: "#22c55e",
                boxShadow: "0 0 0 3px rgba(34,197,94,0.2)",
                display: "inline-block",
              }}
            />
            Transaction successful
          </span>

          {subscription?.plan && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              style={{
                marginTop: 16,
                marginBottom: 28,
                textAlign: "left",
                background: "#f9fafb",
                border: "1px solid #e5e7eb",
                borderRadius: 16,
                padding: 20,
              }}
            >
              <h3
                style={{
                  fontWeight: 700,
                  fontSize: "1rem",
                  marginBottom: 12,
                  color: "#111827",
                }}
              >
                Subscription Details
              </h3>

              <div className="space-y-2 text-sm">
                <p>
                  <strong>Plan:</strong> {subscription.plan.name}
                </p>

                <p>
                  <strong>Price:</strong> ₹{subscription.plan.billing.price}
                </p>

                <p>
                  <strong>Duration:</strong>{" "}
                  {subscription.plan.billing.durationDays} Days
                </p>

                <p>
                  <strong>Status:</strong> {subscription.status}
                </p>

                <p>
                  <strong>Activated:</strong>{" "}
                  {formatDateTime(subscription.startedAt)}
                </p>

                <p>
                  <strong>Expires:</strong>{" "}
                  {formatDateTime(subscription.expiresAt)}
                </p>
              </div>
            </motion.div>
          )}
        </motion.div>

        {/* Divider */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          style={{
            height: 1,
            background:
              "linear-gradient(90deg, transparent, #e5e7eb, transparent)",
            marginBottom: 28,
          }}
        />

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.68 }}
        >
          <button
            onClick={handleGoHome}
            className="ps-btn"
            style={{
              width: "100%",
              height: 52,
              fontSize: "0.95rem",
              fontWeight: 700,
              borderRadius: 14,
              background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
              boxShadow: "0 8px 24px rgba(99,102,241,0.28)",
              border: "none",
              color: "#fff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
              cursor: "pointer",
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              letterSpacing: "0.01em",
            }}
          >
            Go to Home <ArrowRight size={18} />
          </button>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.82 }}
          style={{ marginTop: 20, fontSize: "0.75rem", color: "#9ca3af" }}
        >
          Need help? Contact our support team anytime.
        </motion.p>
      </motion.div>
    </div>
  );
}
