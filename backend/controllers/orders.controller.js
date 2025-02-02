import User from '../models/user.model.js';
import Order from '../models/order.model.js';

export const getPendingOrders = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        const pendingOrders = await Order.find({
            buyerId: user._id,
            status: 'pending'
        }).populate('itemId sellerId');
        res.status(200).json(pendingOrders);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
};


export const getBoughtOrders = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        const pendingOrders = await Order.find({
            buyerId: user._id,
            status: 'completed'
        }).populate('itemId sellerId');
        res.status(200).json(pendingOrders);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
};


export const getSoldOrders = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        const soldItems = await Order.find({
            sellerId: user._id,
            status: 'completed'
        }).populate('itemId buyerId');
        res.status(200).json(soldItems);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
};