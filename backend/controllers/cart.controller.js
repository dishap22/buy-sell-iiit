import User from "../models/user.model.js";
import Item from "../models/item.model.js";
import Order from "../models/order.model.js";
import mongoose from "mongoose";

const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

export const addToCart = async (req, res) => {
    const { itemId } = req.body;
    
    try {
        if (!req.user) {
            return res.status(401).json({ message: "User not authenticated" });
        }

        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        if (!mongoose.Types.ObjectId.isValid(itemId)) {
            return res.status(400).json({ message: "Invalid item ID format" });
        }

        const item = await Item.findById(itemId);
        if (!item) {
            return res.status(404).json({ message: "Item not found" });
        }

        if (item.sellerID.toString() === user.id) {
            return res.status(400).json({ message: "You cannot add your own item to cart" });
        }

        if (!user.cart) {
            user.cart = [];
        }

        const isAlreadyInCart = user.cart.includes(itemId);
        if (isAlreadyInCart) {
            return res.status(400).json({ message: "Item already in cart" });
        }
        
        user.cart.push(itemId);
        await user.save();

        return res.status(200).json({ message: "Item added to cart" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
}

export const getCart = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).populate("cart");
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const totalPrice = user.cart.reduce((sum, item) => sum + (item.price || 0), 0);

        res.status(200).json({ 
            cartItems: user.cart || [], 
            totalPrice 
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};

export const removeFromCart = async (req, res) => {
    const { itemId } = req.params;
    try {
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        user.cart = user.cart.filter(id => id.toString() !== itemId);
        const updatedUser = await user.save();
        if (!updatedUser) {
            return res.status(500).json({ message: "Error saving updated user" });
        }
        const populatedUser = await User.findById(req.user.id).populate("cart");
        const totalPrice = populatedUser.cart.reduce((sum, item) => sum + (item.price || 0), 0);

        return res.status(200).json({
            message: "Item removed from cart",
            cartItems: populatedUser.cart, 
            totalPrice
        });
    } catch (error) {
        console.error("Error during removeFromCart:", error);
        res.status(500).json({ message: "Error removing item from cart" });
    }
};

export const checkout = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).populate("cart");

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        if (!user.cart || user.cart.length === 0) {
            return res.status(400).json({ message: "Cart is empty" });
        }

        const orders = [];
        for (let item of user.cart) {
            const totalAmount = item.price || 0;
            const otp = generateOTP();
            const transactionId = new mongoose.Types.ObjectId().toString();

            const order = new Order({
                transactionId,
                buyerId: user._id,
                itemId: item._id,
                sellerId: item.sellerID,
                totalAmount,
                otp
            });

            await order.save();
            orders.push(order);  
        }

        user.cart = [];
        await user.save();

        res.status(200).json({ message: "Orders placed successfully" });
    } catch (error) {
        console.error("Error during checkout:", error);
        res.status(500).json({ message: "Error placing orders" });
    }
};