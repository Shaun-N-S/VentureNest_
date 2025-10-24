import rfs from "rotating-file-stream";
import fs from "fs";
import path from "path";

// Accepts time units like 1d, 1h, etc.
type IntervalType = `${number}M` | `${number}d` | `${number}h` | `${number}m` | `${number}s`;

// Helper to ensure directory exists
function ensureDir(dir: string) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

export const createRotatingFileStream = (
  interval: IntervalType,
  maxFiles: number,
  dirPath: string
) => {
  ensureDir(dirPath);

  return rfs.createStream(
    (time) => {
      if (!time) return path.join(dirPath, "buffer.log");
      const fileName = new Date().toISOString().split("T")[0] + ".log";
      return path.join(dirPath, fileName);
    },
    {
      interval,
      maxFiles,
      compress: "gzip",
    }
  );
};
