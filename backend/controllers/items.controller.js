import Item from "../models/item.model.js"; // Replace with your actual item model
import User from "../models/user.model.js"; // Replace with your actual user model


// Return all or a filtered set of items for search page
export const getItems = async (req, res) => {
  try {
    const { search, sellerName, categories, minPrice, maxPrice } = req.query;

    let query = {};
    let sellerQuery = {};

    if (search) {
      query.name = { $regex: search, $options: "i" };
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

      if (sellerIDs.length > 0) {
        query.sellerID = { $in: sellerIDs }; 
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

// Returns a single item by it's ID for the product pages
export const getItem = async (req, res) => {
  try {
    const { itemId } = req.params;
    console.log(itemId);
    const item = await Item.findById(itemId).populate({ path: "sellerID", select: "firstName lastName" }); 
    console.log(item); 
    res.status(200).json(item);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

export const getSellerItems = async (req, res) => {
  try {
    console.log("User from token:", req.user);
    const items = await Item.find({ sellerID: req.user.id });
    res.status(200).json(items);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
}

export const deleteItem = async (req, res) => {
  try {
    const { itemId } = req.params;
    await Item.findByIdAndDelete(itemId); 
    res.status(200).json({ message: "Item deleted successfully" });
  }
  catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};