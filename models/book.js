const mongodb = require("mongodb");

const { getDB } = require("../utils/database");
const ObjectId = mongodb.ObjectId;

class Book {
  constructor(
    title,
    description,
    author,
    publicationDate,
    rating,
    bookFile,
    bookImage,
    pages,
    language,
    readingAge,
    isbn13,
    userId
  ) {
    this.title = title;
    this.description = description;
    this.author = author;
    this.publicationDate = publicationDate;
    this.rating = rating;
    this.bookFile = bookFile;
    this.bookImage = bookImage;
    this.pages = pages;
    this.language = language;
    this.readingAge = readingAge;
    this.isbn13 = isbn13;
    this.userId = userId;
  }

  save() {
    const db = getDB();
    return db.collection("books").insertOne(this);
  }

  static fetchAll() {
    const db = getDB();
    const projection = { bookImage: 1, title: 1, author: 1 };
    return (
      db
        .collection("books")
        .find()
        // .find({ readingAge: { $lte: age } })
        .project(projection)
    );
  }

  static findById(bookId) {
    const db = getDB();
    return db.collection("books").findOne({ _id: new ObjectId(bookId) });
  }

  static deleteById(bookId, userId) {
    const db = getDB();
    return db
      .collection("books")
      .deleteOne({ _id: new mongodb.ObjectId(bookId), userId: userId })
      .then(() => {
        console.log("Deleted");
      })
      .catch((err) => {
        console.log(err);
      });
  }
}

module.exports = Book;
