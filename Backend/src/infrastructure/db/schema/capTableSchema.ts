import mongoose from "mongoose";

const capTableSchema = new mongoose.Schema(
  {
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true,
      unique: true,
    },

    totalShares: {
      type: Number,
      required: true,
    },

    shareholders: [
      {
        userId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        shares: {
          type: Number,
          required: true,
        },
        equityPercentage: {
          type: Number,
          required: true,
        },
      },
    ],
  },
  { timestamps: true }
);

export default capTableSchema;
