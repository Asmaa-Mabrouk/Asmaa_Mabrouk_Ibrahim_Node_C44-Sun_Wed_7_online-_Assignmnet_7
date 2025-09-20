import {
    createBook,
    createBooksBatch,
    updateBookByFilter,
    findBookByFilter,
    searchBooksWithOptions,
    deleteBooksByFilter,
    aggregateBooksAfterYear,
    aggregateBooksFieldsAfterUserYear,
    aggregateUnwindGenres,
    aggregateJoinBooksWithLogs
  } from "./bookservices/book.services.js";
  
  // Insert one book
  export const addBook = async (req, res) => {
    try {
      const book = await createBook(req.body);
      res.status(201).json({ status: "success", message: "Book added successfully", book });
    } catch (err) {
      res.status(400).json({ status: "error", message: err.message });
    }
  };
  
  // Insert multiple books
  export const addBooksBatch = async (req, res) => {
    try {
      const result = await createBooksBatch(req.body);
      res.status(201).json({
        status: result.overallStatus,
        message: "Batch insert completed",
        insertedCount: result.insertedBooks.length,
        skippedCount: result.skippedBooks.length,
        insertedBooks: result.insertedBooks,
        skippedBooks: result.skippedBooks
      });
    } catch (err) {
      res.status(400).json({ status: "error", message: err.message });
    }
  };
  
  // Update book
  export const updateBook = async (req, res) => {
    try {
      const { filter, update } = req.body;
      const updated = await updateBookByFilter(filter, update);
      res.json({ status: "success", updated });
    } catch (err) {
      res.status(400).json({ status: "error", message: err.message });
    }
  };
  
  // Find book
  export const findBook = async (req, res) => {
    try {
      const { filter } = req.body;
      const book = await findBookByFilter(filter);
      res.json({ status: "success", book });
    } catch (err) {
      res.status(404).json({ status: "error", message: err.message });
    }
  };
  
  // Search books
  export const searchBooks = async (req, res) => {
    try {
      const { filter = {}, options = {} } = req.body;
      const books = await searchBooksWithOptions(filter, options);
      if (books.length === 0) {
        return res.status(404).json({ status: "error", message: "No books found" });
      }
      res.json({ status: "success", count: books.length, books });
    } catch (err) {
      res.status(400).json({ status: "error", message: err.message });
    }
  };
  
  
  // Delete books
  export const deleteBooks = async (req, res) => {
    try {
      const { filter } = req.body;
      const deletedCount = await deleteBooksByFilter(filter);
      res.json({ status: "success", deleted: deletedCount });
    } catch (err) {
      res.status(400).json({ status: "error", message: err.message });
    }
  };
  
  // Filter books published after 2000 and sort by year descending
  export const filterBooksAfterYear = async (req, res) => {
    try {
      const { year } = req.body;
      const result = await aggregateBooksAfterYear(year);
      res.json({ status: "success", count: result.length, result });
    } catch (err) {
      res.status(500).json({ status: "error", message: err.message });
    }
  };
  
  // Find books published after 2000, show only title, author, and year
  export const getBooksAfterUserYearFields = async (req, res) => {
    try {
      const { year = 2000 } = req.body;
      const result = await aggregateBooksFieldsAfterUserYear(year);
      res.json({ status: "success", count: result.length, result });
    } catch (err) {
      res.status(500).json({ status: "error", message: err.message });
    }
  };
  
  // Break an array of genres into separate documents  
  export const unwindBookGenres = async (req, res) => {
    try {
      const result = await aggregateUnwindGenres();
      res.json({ status: "success", count: result.length, result });
    } catch (err) {
      res.status(500).json({ status: "error", message: err.message });
    }
  };
  
  // Join books collection with logs collection
  export const joinBooksWithLogs = async (req, res) => {
    try {
      const result = await aggregateJoinBooksWithLogs();
      res.json({ status: "success", count: result.length, result });
    } catch (err) {
      res.status(500).json({ status: "error", message: err.message });
    }
  };