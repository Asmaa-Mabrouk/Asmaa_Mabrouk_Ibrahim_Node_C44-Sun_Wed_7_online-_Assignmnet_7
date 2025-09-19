import mongoose from "mongoose";

// Q1 – Create explicit books collection with validation
export const createBooksCollection = async (req, res) => {
  try {
    const collections = await mongoose.connection.db.listCollections({ name: "books" }).toArray();
    if (collections.length > 0) {
      await mongoose.connection.db.dropCollection("books");
    }

    await mongoose.connection.db.createCollection("books", {
      validator: { $jsonSchema: {
        bsonType: "object",
        required: ["title"],
        properties: {
          title: { bsonType: "string", description: "must be a string and is required" }
        }
      }}
    });

    res.json({ message: "'books' collection created with validation" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Q2 – Insert into authors (implicit collection)
export const insertAuthorImplicit = async (req, res) => {
  try {
    const { name, birthYear, nationality } = req.body;
    if (!name) {
      return res.status(400).json({ error: "Author must have a name" });
    }

    const result = await mongoose.connection.db
      .collection("authors")
      .insertOne({ name, birthYear, nationality });

    res.status(201).json({ message: "Author inserted into implicit 'authors' collection", result });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Q3 – Create capped logs collection
export const createCappedLogs = async (req, res) => {
  try {
    const collections = await mongoose.connection.db.listCollections({ name: "logs" }).toArray();
    if (collections.length > 0) {
      await mongoose.connection.db.dropCollection("logs");
    }

    await mongoose.connection.db.createCollection("logs", { capped: true, size: 1024 * 1024 });
    res.json({ message: "'logs' capped collection created (1MB)" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Q4 – Create index on books.title
export const createBooksIndex = async (req, res) => {
  try {
    const { collection = "books", key = { title: 1 }, name = "title_index" } = req.body;

    const result = await mongoose.connection.db.collection(collection).createIndex(key, { name });
    res.json({ message: "Index created", result });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
