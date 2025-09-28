import { CONFIG } from "@config/config";
import mongoose from "mongoose";

export class mongoConnect {
  public static async connect() {
    try {
      if (CONFIG.MONGO_URI) {
        await mongoose.connect(CONFIG.MONGO_URI);
        console.log("MongoDB Connected");
      } else {
        throw new Error("Invalid Mongodb url or url not found in config");
      }
    } catch (error) {
      if (error instanceof Error) {
        console.log(error.message);
      }
    }
  }
}
