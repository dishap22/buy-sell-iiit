import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const orderSchema = new mongoose.Schema({
    transactionId: { type: String, required: true, unique: true },
    buyerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    itemId: { type: mongoose.Schema.Types.ObjectId, ref: 'Item', required: true },
    sellerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    totalAmount: { type: Number, required: true },
    otp: { type: String, required: true },   
    hashedOtp: { type: String, required: true },
    status: { type: String, required: true, default: 'pending', enum: ['pending', 'completed'] },
}, {
    timestamps: true
});

orderSchema.pre('save', async function(next) {
    if (!this.isModified('hashedOtp')) {
        next();
    }
    const salt = await bcrypt.genSalt(10);
    this.hashedOtp = await bcrypt.hash(this.hashedOtp, salt);
});


const Order = mongoose.model('Order', orderSchema);
export default Order;
