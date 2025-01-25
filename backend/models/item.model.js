import mongoose from "mongoose";

const itemSchema = new mongoose.Schema({
    name: { type: String, required: true },
    price: { type: Number, required: true },
    description: { type: String, required: true },
    category: { type: String, required: true },
    sellerID: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
}, {
    timestamps: true
});

const Item = mongoose.model("Item", itemSchema);
export default Item;