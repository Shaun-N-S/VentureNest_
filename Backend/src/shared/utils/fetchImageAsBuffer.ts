import axios from "axios";

export async function fetchImageAsBuffer(imageUrl: string): Promise<Buffer> {
  try {
    const response = await axios.get(imageUrl, { responseType: "arraybuffer" });
    return Buffer.from(response.data, "binary");
  } catch (error) {
    console.error("Error in fetchImageAsBuffer:", error);
    throw new Error("Failed to fetch image from URL");
  }
}
