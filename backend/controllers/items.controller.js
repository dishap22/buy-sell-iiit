import Item from "../models/item.model.js"; // Replace with your actual item model
import User from "../models/user.model.js"; // Replace with your actual user model

export const getItems = async (req, res) => {
  try {
    const { search, categories } = req.query;

    let query = {};

    // Search by name (case insensitive)
    if (search) {
      query.name = { $regex: search, $options: "i" };
    }

    // Filter by categories
    if (categories) {
      const categoryArray = categories.split(",");
      query.category = { $in: categoryArray };
    }

    const items = await Item.find(query)
    .populate({
      path: "sellerID",
      select: "firstName lastName", 
      model: User, 
    });
    
    const distinctCategories = await Item.distinct("category"); // Fetch unique categories

    res.status(200).json({ items, categories: distinctCategories });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

export const addItems = async (req, res) => {
  const item = req.body;

  try {
    const { name, price, description, category } = item;
    const newItem = new Item({
      name, 
      price,
      description,
      category,
      sellerID: req.user.id
    });
    await newItem.save();
    res.status(201).json(newItem);
  } catch (error) {
    console.log(error);
    res.status(401).json({ message: error.message });
  }
};