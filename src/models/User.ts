import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true, lowercase: true },
    passwordHash: { type: String, required: true },
    savedRoots: [{ type: mongoose.Schema.Types.ObjectId, ref: "Root" }],
    preferredLanguages: {
      type: [String],
      enum: ["English", "German", "Spanish", "Hindi", "Thai"],
      default: ["English"],
    },
  },
  { timestamps: true }
);

export const User = mongoose.model("User", userSchema);