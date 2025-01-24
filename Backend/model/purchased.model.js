import mongoose from "mongoose";

const purchasedSchema = mongoose.Schema({
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    services: [
      {
        serviceId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "service",
          required: true,
        },
        sellerId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "seller",
          required: true,
        },
        quantity: {
          type: Number,
          default: 1,
        },
      },
    ],
    totalPrice: {
      type: Number,
      default: 0,
    },
    purchasedAt: {
      type: Date,
      default: Date.now,
    },
  });
  
  const Purchased = mongoose.model("purchased", purchasedSchema);
  export default Purchased;
  