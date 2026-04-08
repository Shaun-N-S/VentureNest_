type Variant = "startup" | "investor";

interface Props {
  index: number;
  title: string;
  value: string;
  avatarUrl?: string;
  variant?: Variant;
}

const rankColors: Record<number, { bg: string; text: string }> = {
  0: { bg: "rgba(212,168,83,0.15)", text: "#b8860b" },
  1: { bg: "rgba(100,116,139,0.12)", text: "#64748b" },
  2: { bg: "rgba(180,120,73,0.15)", text: "#b45309" },
};

const TopItem = ({
  index,
  title,
  value,
  avatarUrl,
  variant = "startup",
}: Props) => {
  const rank = rankColors[index] ?? {
    bg: "rgba(0,0,0,0.04)",
    text: "#94a3b8",
  };

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "10px 12px",
        borderRadius: "10px",
        background: "rgba(0,0,0,0.02)",
        border: "1px solid rgba(0,0,0,0.05)",
        transition: "background 0.15s, box-shadow 0.15s",
        fontFamily: "'Sora', sans-serif",
        gap: "12px",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLDivElement).style.background =
          "rgba(0,0,0,0.04)";
        (e.currentTarget as HTMLDivElement).style.boxShadow =
          "0 2px 8px rgba(0,0,0,0.06)";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLDivElement).style.background =
          "rgba(0,0,0,0.02)";
        (e.currentTarget as HTMLDivElement).style.boxShadow = "none";
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "10px",
          minWidth: 0,
        }}
      >
        {/* Rank badge */}
        <div
          style={{
            width: 24,
            height: 24,
            borderRadius: "6px",
            background: rank.bg,
            color: rank.text,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "11px",
            fontWeight: 600,
            fontFamily: "'JetBrains Mono', monospace",
            flexShrink: 0,
          }}
        >
          {index + 1}
        </div>

        {/* Avatar */}
        {avatarUrl ? (
          <img
            src={avatarUrl}
            alt={title}
            style={{
              width: 32,
              height: 32,
              borderRadius: variant === "investor" ? "50%" : "8px",
              objectFit: "cover",
              border: "1.5px solid rgba(0,0,0,0.08)",
              flexShrink: 0,
            }}
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).style.display = "none";
            }}
          />
        ) : (
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: variant === "investor" ? "50%" : "8px",
              background: "rgba(0,0,0,0.06)",
              flexShrink: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "13px",
              fontWeight: 600,
              color: "#94a3b8",
            }}
          >
            {title.charAt(0).toUpperCase()}
          </div>
        )}

        {/* Name */}
        <p
          style={{
            fontSize: "13px",
            fontWeight: 500,
            color: "#1e293b",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {title}
        </p>
      </div>

      {/* Value */}
      <p
        style={{
          fontSize: "13px",
          fontWeight: 600,
          color: index === 0 ? "#b8860b" : "#64748b",
          fontFamily: "'JetBrains Mono', monospace",
          flexShrink: 0,
        }}
      >
        {value}
      </p>
    </div>
  );
};

export default TopItem;
