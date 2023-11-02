const { getDB } = require("../utils/database");

class Book {
  constructor(
    title,
    description,
    author,
    publicationDate,
    rating,
    image,
    printLength,
    language,
    readingAge,
    isbn13
  ) {
    this.title = title;
    this.description = description;
    this.author = author;
    this.publicationDate = publicationDate;
    this.rating = rating;
    this.image = image;
    this.printLength = printLength;
    this.language = language;
    this.readingAge = readingAge;
    this.isbn13 = isbn13;
  }

  save() {
    let db = getDB();
    return db;
  }
}
