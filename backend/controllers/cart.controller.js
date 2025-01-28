import User from "../models/user.model.js";
import Item from "../models/item.model.js";
import mongoose from "mongoose";

export const addToCart = async (req, res) => {
    const { itemId } = req.body;
    
    try {
        // First verify we have a valid user
        if (!req.user) {
            return res.status(401).json({ message: "User not authenticated" });
        }

        // Fetch fresh user document from database
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Verify itemId is valid
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

        // Initialize cart if it doesn't exist
        if (!user.cart) {
            user.cart = [];
        }

        // Check if item already exists in cart
        const isAlreadyInCart = user.cart.includes(itemId);
        if (isAlreadyInCart) {
            return res.status(400).json({ message: "Item already in cart" });
        }

        // Add item to cart - just push the itemId directly since cart array expects ObjectIds
        user.cart.push(itemId);
        await user.save();

        return res.status(200).json({ message: "Item added to cart" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
}