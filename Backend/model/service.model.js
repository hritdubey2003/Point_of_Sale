import mongoose from "mongoose";

const serviceSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  sellerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "seller",
    required: true,
  },
  addedToCartCount: {
    type: Number,
    default: 0,
  },
  purchasedCount: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

const Service = mongoose.model("service", serviceSchema);
export default Service;
