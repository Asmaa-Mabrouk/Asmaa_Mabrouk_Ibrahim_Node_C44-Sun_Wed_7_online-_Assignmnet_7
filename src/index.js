import express from "express";
import dotenv from "dotenv";
import connectDB from "./database/db.connection.js";

// Controllers
import {
  addBook,
  addBooksBatch,
  updateBook,
  findBook,
  searchBooks,
  deleteBooks,
  filterBooksAfterYear,
  getBooksAfterUserYearFields,
  unwindBookGenres,
  joinBooksWithLogs
} from "./modules/books/book.controller.js";

import { addLog } from "./modules/logs/log.controller.js";

import {
  createBooksCollection,
  insertAuthorImplicit,
  createCappedLogs,
  createBooksIndex
} from "./modules/collection.controller.js";

dotenv.config();
const app = express();
app.use(express.json());

// ----------------- Collection Endpoints  Question 1 to 4 -----------------
app.post("/collection/books", createBooksCollection);       
app.post("/collection/authors", insertAuthorImplicit);      
app.post("/collection/logs", createCappedLogs);             
app.post("/collection/books/index", createBooksIndex);      

// ----------------- Book Endpoints  Question 5 to 19 except  7 -----------------
app.post("/books", addBook);            
app.post("/books/batch", addBooksBatch);
app.patch("/books/update", updateBook);  
app.get("/books/find", findBook);      
app.post("/books/search", searchBooks); 
app.delete("/books", deleteBooks);      
app.post("/books/filter-after-year", filterBooksAfterYear);
app.post("/books/published-after-year-fields", getBooksAfterUserYearFields);
app.post("/books/unwind-genres", unwindBookGenres);
app.post("/books/join-with-logs", joinBooksWithLogs);

// ----------------- Log Endpoint - Question 7 -----------------
app.post("/logs", addLog);              

// ----------------- Start Server -----------------
const PORT = process.env.PORT || 3000;
connectDB();

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
