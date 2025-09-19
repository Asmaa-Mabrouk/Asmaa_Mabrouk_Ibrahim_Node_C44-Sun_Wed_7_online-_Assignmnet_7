import Book from "../../database/models/book.model.js";

// Insert one book
export const addBook = async (req, res) => {
  try {
    const { title, author, year, genres } = req.body;

    if (!title || !author || !year) {
      return res.status(400).json({ error: "title, author, and year are required" });
    }

    const exists = await Book.findOne({ title, author, year, genres });
    if (exists) {
      return res.status(400).json({ error: "This book already exists" });
    }

    const book = new Book(req.body);
    await book.save();
    res.status(201).json({ message: "✅ Book added successfully", book });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Insert multiple books with duplicate or invalid tracking
export const addBooksBatch = async (req, res) => {
  try {
    if (!Array.isArray(req.body) || req.body.length === 0) {
      return res.status(400).json({ error: "Body must be a non-empty array" });
    }

    const insertedBooks = [];
    const skippedBooks = [];

    for (const bookData of req.body) {
      const { title, author, year, genres } = bookData;

      // Validation: required fields
      if (!title || !author || !year) {
        skippedBooks.push({ ...bookData, reason: "Missing required fields" });
        continue;
      }

      // Check for duplicate
      const exists = await Book.findOne({ title, author, year, genres });
      if (exists) {
        skippedBooks.push({ ...bookData, reason: "Duplicate book" });
        continue;
      }
      const book = new Book(bookData);
      await book.save();
      insertedBooks.push(book);
    }

    res.status(201).json({
      message: "Batch insert completed",
      insertedCount: insertedBooks.length,
      skippedCount: skippedBooks.length,
      insertedBooks,
      skippedBooks
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update book
export const updateBook = async (req, res) => {
  try {
    const { filter, update } = req.body;
    if (!filter || !update) {
      return res.status(400).json({ error: "filter and update are required" });
    }

    const updated = await Book.findOneAndUpdate(filter, { $set: update }, { new: true });
    if (!updated) return res.status(404).json({ error: "Book not found" });

    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Find book
export const findBook = async (req, res) => {
  try {
    const { filter } = req.body;
    if (!filter) {
      return res.status(400).json({ error: "Request must include a filter object" });
    }

    const book = await Book.findOne(filter);
    if (!book) return res.status(404).json({ error: "No book found" });

    res.json(book);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Search books
export const searchBooks = async (req, res) => {
  try {
    const { filter = {}, options = {} } = req.body;

    const books = await Book.find(filter)
      .sort(options.sort || {})
      .skip(options.skip || 0)
      .limit(options.limit || 0);

    res.json(books);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete books
export const deleteBooks = async (req, res) => {
  try {
    const { filter } = req.body;
    if (!filter) return res.status(400).json({ error: "Filter required" });

    const result = await Book.deleteMany(filter);
    res.json({ deleted: result.deletedCount });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Aggregate books
export const aggregateBooks = async (req, res) => {
  try {
    if (!Array.isArray(req.body) || req.body.length === 0) {
      return res.status(400).json({
        error: "Aggregation must be a non-empty array"
      });
    }
    for (const stage of req.body) {
      if (typeof stage !== "object" || stage === null) {
        return res.status(400).json({
          error: "stage must be a valid object"
        });
      }
      const keys = Object.keys(stage);
      if (keys.length !== 1 || !keys[0].startsWith("$")) {
        return res.status(400).json({
          error: "Each stage must contain exactly one key starting with $"
        });
      }
    }
    // Run aggregation directly
    const result = await Book.aggregate(req.body);

    res.json({
      message: "✅ Aggregation executed successfully",
      count: result.length,
      result
    });
  } catch (err) {
    console.error("Aggregation error:", err.message);
    res.status(500).json({
      error: "Aggregation failed",
      details: err.message
    });
  }
};


