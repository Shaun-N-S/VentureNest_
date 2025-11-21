import { Schema, Types } from "mongoose";
import { ConnectionStatus, RelationshipType } from "@domain/enum/connectionStatus";

const relationshipSchema = new Schema(
  {
    fromUserId: { type: Types.ObjectId, required: true },
    toUserId: { type: Types.ObjectId, required: true },

    type: {
      type: String,
      enum: [RelationshipType.FOLLOW, RelationshipType.CONNECTION],
      required: true,
    },

    status: {
      type: String,
      enum: [
        ConnectionStatus.NONE,
        ConnectionStatus.PENDING,
        ConnectionStatus.ACCEPTED,
        ConnectionStatus.REJECTED,
        ConnectionStatus.CANCELLED,
      ],
      required: true,
      default: ConnectionStatus.NONE,
    },
  },
  { timestamps: true }
);

//Prevent duplicate follow or duplicate connection requests
relationshipSchema.index({ fromUserId: 1, toUserId: 1, type: 1 }, { unique: true });

export default relationshipSchema;
