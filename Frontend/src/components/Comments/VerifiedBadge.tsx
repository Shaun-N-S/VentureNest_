import VerifiedIcon from "../../assets/verified-icon.png";

interface VerifiedBadgeProps {
  size?: number;
}

export function VerifiedBadge({ size = 20 }: VerifiedBadgeProps) {
  return (
    <img
      src={VerifiedIcon}
      alt="Verified"
      style={{ width: size, height: size }}
      className="object-contain"
    />
  );
}
