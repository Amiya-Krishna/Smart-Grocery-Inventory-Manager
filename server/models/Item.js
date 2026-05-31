import mongoose from "mongoose";

const itemSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: 0,
    },
    category: {
      type: String,
      required: true,
    },
    expiryDate: {
      type: Date,
      default: null,  // ✅ explicit null default
    },
    lastPurchasedDate: {
      type: Date,      // ✅ naya field add kiya
      default: null,
    },
    minStock: {
      type: Number,
      default: 1,
      min: 0,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Item", itemSchema);