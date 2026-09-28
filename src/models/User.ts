import mongoose from "mongoose";

const savedRootSchema = new mongoose.Schema(
  {
    root: { type: mongoose.Schema.Types.ObjectId, ref: "Root", required: true },
    language: {
      type: String,
      enum: ["English", "German", "Spanish", "Hindi", "Thai"],
      required: true,
    },
  },
  { _id: false, timestamps: { createdAt: true, updatedAt: false } }
);

const userSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true, lowercase: true },
    passwordHash: { type: String, required: true },
    savedRoots: { type: [savedRootSchema], default: [] },
    spokenLanguages: {
      type: [String],
      enum: ["English", "German", "Spanish", "Hindi", "Thai"],
      default: [],
    },
  },
  { timestamps: true }
);

export const User = mongoose.model("User", userSchema);