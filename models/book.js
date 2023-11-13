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
    isbn13
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
  }

  save() {
    const db = getDB();
    return db.collection("books").insertOne(this);
  }

  static fetchAll() {
    const db = getDB();
    const projection = { bookImage: 1, title: 1, author: 1 };
    return db.collection("books").find().project(projection).toArray();
  }

  static findById(bookId) {
    const db = getDB();
    return db.collection("books").findOne({ _id: new ObjectId(bookId) });
  }
}

module.exports = Book;
