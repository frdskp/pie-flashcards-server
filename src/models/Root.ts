import mongoose from "mongoose";

const cognateSchema = new mongoose.Schema(
  {
    language: {
      type: String,
      enum: ["English", "German", "Spanish", "Hindi", "Thai"],
      required: true,
    },
    word: { type: String, required: true },
    relationship: {
      type: String,
      enum: ["inherited", "borrowed", "unrelated"],
      required: true,
    },
    note: { type: String, default: "" },
  },
  { _id: false }
);

const rootSchema = new mongoose.Schema(
  {
    root: { type: String, required: true, unique: true },
    reconstructedMeaning: { type: String, required: true },
    cognates: { type: [cognateSchema], default: [] },
    aiExplanation: { type: String, default: "" },
    isCurated: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const Root = mongoose.model("Root", rootSchema);