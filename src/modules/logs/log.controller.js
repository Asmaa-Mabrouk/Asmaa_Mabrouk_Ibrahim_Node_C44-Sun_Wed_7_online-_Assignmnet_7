import mongoose from "mongoose";
import Log from "../../database/models/log.model.js";
import Book from "../../database/models/book.model.js";

export const addLog = async (req, res) => {
  try {
    const { book_id, action } = req.body;

    if (!book_id || !action) {
      return res.status(400).json({ error: "book_id and action are required" });
    }
    if (!mongoose.Types.ObjectId.isValid(book_id)) {
      return res.status(400).json({ error: "Invalid book_id format" });
    }
    if (!["borrowed", "returned", "reserved"].includes(action)) {
      return res.status(400).json({ error: "Invalid action" });
    }

    const book = await Book.findById(book_id);
    if (!book) {
      return res.status(404).json({ error: "Book not found" });
    }

    // Prevent double borrow
    if (action === "borrowed") {
      const lastLog = await Log.findOne({ book_id }).sort({ createdAt: -1 });
      if (lastLog && lastLog.action === "borrowed") {
        return res.status(400).json({ error: "Book is already borrowed" });
      }
    }

    const log = new Log({ book_id, action });
    await log.save();
    res.status(201).json({ message: "✅ Log added successfully", log });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
