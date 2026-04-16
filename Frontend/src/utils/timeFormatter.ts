export const formatLastSeen = (date: string) => {
  const now = new Date();
  const last = new Date(date);

  const diffMs = now.getTime() - last.getTime();
  const minutes = Math.floor(diffMs / 60000);
  const hours = Math.floor(diffMs / 3600000);

  // 🟢 Just now
  if (minutes < 1) return "Just now";

  // 🟢 Minutes
  if (minutes < 60) return `${minutes} min ago`;

  // 🟢 Hours (< 24h)
  if (hours < 24) return `${hours} hr ago`;

  // 🟡 Yesterday (REAL CHECK)
  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);

  if (
    last.getDate() === yesterday.getDate() &&
    last.getMonth() === yesterday.getMonth() &&
    last.getFullYear() === yesterday.getFullYear()
  ) {
    return `Yesterday ${last.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    })}`;
  }

  // 🔵 Older
  return `${last.toLocaleDateString([], {
    day: "2-digit",
    month: "short",
  })}, ${last.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  })}`;
};
