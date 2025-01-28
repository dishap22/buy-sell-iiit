import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
    transactionId: { type: String, required: true, unique: true },
    buyerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    items: [{
        itemId: { type: mongoose.Schema.Types.ObjectId, ref: 'Item', required: true },
        sellerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
    }],
    totalAmount: { type: Number, required: true },
    otp: { type: String, required: true },   
    status: { type: String, required: true, default: 'pending', enum: ['pending', 'completed'] },
}, {
    timestamps: true
});

const Order = mongoose.model('Order', orderSchema);
export default Order;
