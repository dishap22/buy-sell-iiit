import Order from '../models/order.model.js';
import User from '../models/user.model.js';
import bcrypt from 'bcryptjs';

export const getDeliveries = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const pendingOrders = await Order.find({
            sellerId: user._id,
            status: 'pending',
        })
            .populate('buyerId', 'firstName lastName email')  
            .populate('itemId', 'name price');
        res.status(200).json(pendingOrders);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
};

export const completeTransaction = async (req, res) => {
    try {
        const { orderId, enteredOtp } = req.body;
        const order = await Order.findById(orderId);
        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }

        const isMatch = await bcrypt.compare(enteredOtp, order.hashedOtp);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid OTP" });
        }

        order.status = "completed";
        await order.save();

        res.json({ message: "Transaction completed successfully", order });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
};