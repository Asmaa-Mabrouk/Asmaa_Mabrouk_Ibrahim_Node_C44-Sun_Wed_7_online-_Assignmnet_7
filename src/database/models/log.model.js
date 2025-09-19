import mongoose from "mongoose";

const logSchema = new mongoose.Schema({
  book_id: { type: mongoose.Schema.Types.ObjectId, ref: "Book", required: true },
  action: { 
    type: String, 
    enum: ["borrowed", "returned", "reserved"], 
    required: true 
  },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("Log", logSchema);
