import Book from "../../../database/models/book.model.js";

// Add one book
export const createBook = async (bookData) => {
  const { title, author, year } = bookData;
  if (!title || !author || !year) {
    throw new Error("title, author, and year are required");
  }
  const exists = await Book.findOne({ title, author, year });
  if (exists) {
    throw new Error("This book already exists");
  }
  const book = new Book(bookData);
  return await book.save();
};

// Add multiple books
export const createBooksBatch = async (booksData) => {
  if (!Array.isArray(booksData) || booksData.length === 0) {
    throw new Error("Body must be a non-empty array");
  }
  const insertedBooks = [];
  const skippedBooks = [];
  for (const data of booksData) {
    const { title, author, year } = data;
    if (!title || !author || !year) {
      skippedBooks.push({ ...data, reason: "Missing required fields" });
      continue;
    }
    const exists = await Book.findOne({ title, author, year });
    if (exists) {
      skippedBooks.push({ ...data, reason: "Duplicate book" });
      continue;
    }
    const book = new Book(data);
    await book.save();
    insertedBooks.push(book);
  }
  const overallStatus =
    insertedBooks.length && skippedBooks.length
      ? "partial success"
      : insertedBooks.length
      ? "success"
      : "failed";
  return { overallStatus, insertedBooks, skippedBooks };
};

// Update one book
export const updateBookByFilter = async (filter, update) => {
  if (!filter || !update) {
    throw new Error("filter and update are required");
  }
  const updated = await Book.findOneAndUpdate(filter, { $set: update }, { new: true });
  if (!updated) throw new Error("Book not found");
  return updated;
};

// Find one book
export const findBookByFilter = async (filter) => {
  if (!filter) throw new Error("Filter object is required");
  const book = await Book.findOne(filter);
  if (!book) throw new Error("No book found");
  return book;
};

// Search books
export const searchBooksWithOptions = async (filter = {}, options = {}) => {
  return await Book.find(filter)
    .sort(options.sort || {})
    .skip(options.skip || 0)
    .limit(options.limit || 0);
};

// Delete books
export const deleteBooksByFilter = async (filter) => {
  if (!filter) throw new Error("Filter required");
  const result = await Book.deleteMany(filter);
  return result.deletedCount;
};

// Filter books published after 2000 and sort by year descending
export const aggregateBooksAfter2000 = async (year = 2000) => {
  return await Book.aggregate([
    { $match: { year: { $gt: year } } },
    { $sort: { year: -1 } }
  ]);
};

// Find books published after 2000, show only title, author, and year
export const aggregateBooksFieldsAfter2000 = async (year = 2000) => {
  return await Book.aggregate([
    { $match: { year: { $gt: year } } },
    { $project: { _id: 0, title: 1, author: 1, year: 1 } }
  ]);
};

// Break an array of genres into separate documents
export const aggregateUnwindGenres = async () => {
  return await Book.aggregate([
    { $unwind: "$genres" }
  ]);
};

// Join books collection with logs collection
export const aggregateJoinBooksWithLogs = async () => {
  return await Book.aggregate([
    {
      $lookup: {
        from: "logs",
        localField: "_id",
        foreignField: "book_id",
        as: "bookLogs"
      }
    }
  ]);
};