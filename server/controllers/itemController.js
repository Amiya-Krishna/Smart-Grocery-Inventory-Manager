import Item from "../models/Item.js";

// CREATE ITEM
export const addItem = async (req, res) => {
  try {
    const { name, quantity, category, minStock, expiryDate, lastPurchasedDate } = req.body;

    const item = await Item.create({
      userId: req.userId,
      name,
      quantity,
      category,
      minStock,
      expiryDate: expiryDate || null,           // ✅ explicit null
      lastPurchasedDate: lastPurchasedDate || null, // ✅ naya field
    });

    res.status(201).json(item);
  } catch (error) {
    res.status(500).json({ message: "Error creating item", error: error.message });
  }
};

// GET ITEMS
export const getItems = async (req, res) => {
  try {
    const items = await Item.find({ userId: req.userId });
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: "Error fetching items", error: error.message });
  }
};

// UPDATE ITEM
export const updateItem = async (req, res) => {
  try {
    // ✅ Pehle item dhundo, phir authorize karo, phir update karo
    const item = await Item.findById(req.params.id);

    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }

    // ✅ .toString() se ObjectId compare hoga sahi
    if (item.userId.toString() !== req.userId) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    const { name, quantity, category, minStock, expiryDate, lastPurchasedDate } = req.body;

    const updated = await Item.findByIdAndUpdate(
      req.params.id,
      {
        name,
        quantity,
        category,
        minStock,
        expiryDate: expiryDate || null,
        lastPurchasedDate: lastPurchasedDate || null,
      },
      { new: true }
    );

    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: "Error updating item", error: error.message });
  }
};

// DELETE ITEM
export const deleteItem = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);

    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }

    if (item.userId.toString() !== req.userId) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    await Item.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting item", error: error.message });
  }
};

// GET SINGLE ITEM
export const getItem = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item || item.userId.toString() !== req.userId) {
      return res.status(403).json({ message: "Unauthorized" });
    }
    res.json(item);
  } catch (error) {
    res.status(500).json({ message: "Error fetching item", error: error.message });
  }
};