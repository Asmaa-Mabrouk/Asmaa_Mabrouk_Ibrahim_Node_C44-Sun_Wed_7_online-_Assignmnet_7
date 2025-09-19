import mongoose from "mongoose";

const bookSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  author: { type: String, required: true, trim: true },
  year: { type: Number, required: true },
  genres: [{ type: String }]
});

bookSchema.index({ title: 1, author: 1, year: 1, genres: 1 }, { unique: true });

export default mongoose.model("Book", bookSchema);
