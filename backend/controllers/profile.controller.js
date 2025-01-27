import User from "../models/user.model.js";

export const getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select("-password");
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        } else {
            return res.status(200).json(user);
        }   
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const updateProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        } else {
            user.firstName = req.body.firstName || user.firstName;
            user.lastName = req.body.lastName || user.lastName;
            user.email = req.body.email || user.email;
            user.age = req.body.age || user.age;
            user.contactNumber = req.body.contactNumber || user.contactNumber;
            user.password = req.body.password || user.password;
            await user.save();
            return res.status(200).json({ message: "Profile updated successfully" });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};