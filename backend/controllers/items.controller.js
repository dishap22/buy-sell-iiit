import Item from "../models/item.model.js"; // Replace with your actual item model
import User from "../models/user.model.js"; // Replace with your actual user model

export const getItems = async (req, res) => {
  try {
    const { search, sellerName, categories, minPrice, maxPrice } = req.query;

    let query = {};
    let sellerQuery = {};

    if (search) {
      query.name = { $regex: search, $options: "i" }; // Search by item name
    }

    if (sellerName) {
      sellerQuery = {
        $or: [
          { firstName: { $regex: sellerName, $options: "i" } },
          { lastName: { $regex: sellerName, $options: "i" } }
        ]
      };
      const sellers = await User.find(sellerQuery, "_id");
      const sellerIDs = sellers.map((seller) => seller._id);

      // Include sellerID filter if sellers are found
      if (sellerIDs.length > 0) {
        query.sellerID = { $in: sellerIDs }; // Match items that belong to the sellers
      }
    }
      

    if (categories) {
      const categoryArray = categories.split(",");
      query.category = { $in: categoryArray };
    }

    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = parseFloat(minPrice);
      if (maxPrice) query.price.$lte = parseFloat(maxPrice);
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