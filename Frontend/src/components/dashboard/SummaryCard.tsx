import type { ReactNode } from "react";

type AccentType = "blue" | "emerald" | "violet" | "gold";

interface Props {
  title: string;
  value: string | number;
  icon: ReactNode;
  accent?: AccentType;
  sub?: string;
}

interface AccentConfig {
  iconBg: string;
  iconColor: string;
  glow: string;
  bar: string;
  dot: string;
}

const accentMap: Record<AccentType, AccentConfig> = {
  blue: {
    iconBg: "rgba(59,130,246,0.10)",
    iconColor: "#2563eb",
    glow: "rgba(59,130,246,0.07)",
    bar: "linear-gradient(135deg,#3b82f6,#1d4ed8)",
    dot: "#3b82f6",
  },
  emerald: {
    iconBg: "rgba(20,184,166,0.10)",
    iconColor: "#0d9488",
    glow: "rgba(20,184,166,0.07)",
    bar: "linear-gradient(135deg,#14b8a6,#0d9488)",
    dot: "#14b8a6",
  },
  violet: {
    iconBg: "rgba(139,92,246,0.10)",
    iconColor: "#7c3aed",
    glow: "rgba(139,92,246,0.07)",
    bar: "linear-gradient(135deg,#8b5cf6,#6d28d9)",
    dot: "#8b5cf6",
  },
  gold: {
    iconBg: "rgba(212,168,83,0.12)",
    iconColor: "#b8860b",
    glow: "rgba(212,168,83,0.07)",
    bar: "linear-gradient(135deg,#d4a853,#b8860b)",
    dot: "#d4a853",
  },
};

const SummaryCard = ({ title, value, icon, accent = "blue", sub }: Props) => {
  const colors = accentMap[accent];

  return (
    <div
      style={{
        background: "#ffffff",
        border: "1px solid rgba(0,0,0,0.07)",
        boxShadow: `0 1px 4px rgba(0,0,0,0.06), 0 0 24px ${colors.glow}`,
        borderRadius: "16px",
        padding: "20px",
        position: "relative",
        overflow: "hidden",
        transition: "transform 0.2s, box-shadow 0.2s",
        fontFamily: "'Sora', sans-serif",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLDivElement).style.transform =
          "translateY(-2px)";
        (e.currentTarget as HTMLDivElement).style.boxShadow =
          `0 8px 24px rgba(0,0,0,0.09), 0 0 32px ${colors.glow}`;
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)";
        (e.currentTarget as HTMLDivElement).style.boxShadow =
          `0 1px 4px rgba(0,0,0,0.06), 0 0 24px ${colors.glow}`;
      }}
    >
      {/* Corner glow blob */}
      <div
        style={{
          position: "absolute",
          top: -30,
          right: -30,
          width: 80,
          height: 80,
          borderRadius: "50%",
          background: colors.dot,
          opacity: 0.07,
          filter: "blur(20px)",
        }}
      />

      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          position: "relative",
        }}
      >
        <div>
          <p
            style={{
              fontSize: "10px",
              fontWeight: 600,
              color: "#94a3b8",
              textTransform: "uppercase",
              letterSpacing: "0.15em",
              marginBottom: "8px",
            }}
          >
            {title}
          </p>
          <h2
            style={{
              fontSize: "22px",
              fontWeight: 700,
              color: "#0f172a",
              letterSpacing: "-0.02em",
              fontFamily: "'JetBrains Mono', monospace",
              lineHeight: 1.1,
            }}
          >
            {value}
          </h2>
          {sub && (
            <p style={{ fontSize: "11px", color: "#94a3b8", marginTop: "6px" }}>
              {sub}
            </p>
          )}
        </div>

        <div
          style={{
            width: 40,
            height: 40,
            borderRadius: "10px",
            background: colors.iconBg,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: colors.iconColor,
            flexShrink: 0,
          }}
        >
          {icon}
        </div>
      </div>

      {/* Bottom accent bar */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: "2px",
          background: colors.bar,
          opacity: 0.6,
        }}
      />
    </div>
  );
};

export default SummaryCard;
