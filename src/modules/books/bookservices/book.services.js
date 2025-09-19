import Book from "../../../database/models/book.model.js";

export const createBook = (data) => new Book(data).save();
export const createBooksBatch = (data) => Book.insertMany(data);
export const updateBookByTitle = (title, update) =>
  Book.findOneAndUpdate({ title }, { $set: update }, { new: true, runValidators: true });
export const findBookByTitle = (title) => Book.findOne({ title });
export const searchBooks = (query, options) =>
  Book.find(query)
    .sort(options.sort || {})
    .skip(options.skip || 0)
    .limit(options.limit || 0);
export const deleteBooks = (filter) => Book.deleteMany(filter);
export const aggregateBooks = (pipeline) => Book.aggregate(pipeline);
