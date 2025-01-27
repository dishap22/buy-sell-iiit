import Item from "../models/item.model.js"; // Replace with your actual item model

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

    const items = await Item.find(query);
    const distinctCategories = await Item.distinct("category"); // Fetch unique categories

    res.status(200).json({ items, categories: distinctCategories });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};
