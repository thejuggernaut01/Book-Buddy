const mongodb = require("mongodb");
const { getDB } = require("../utils/database");

const ObjectId = mongodb.ObjectId;

class User {
  constructor(firstName, lastName, email, password, age, favorite) {
    this.firstName = firstName;
    this.lastName = lastName;
    this.email = email;
    this.password = password;
    this.age = age;
    this.favorite = favorite;
  }

  save() {
    const db = getDB();
    return db.collection("users").insertOne(this);
  }

  static fetchMyBooks(userId) {
    const db = getDB();
    return db.collection("books").find({ userId: userId }).toArray();
  }

  static addToFavorite(bookId, userId) {
    let updatedFavBooks;

    if (Array.isArray(this.favorite?.books)) {
      updatedFavBooks = [...this.favorite.books];
    } else {
      updatedFavBooks = []; // Initialize an empty array
    }

    const favBookIndex = this.favorite?.books.findIndex((item) => {
      return item.book._id.toString() === bookId.toString();
    });

    if (favBookIndex >= 0) {
      throw new Error("Book already added to favorite");
    } else {
      updatedFavBooks.push({
        bookId: new ObjectId(bookId),
      });
    }

    const updatedFavorite = {
      books: updatedFavBooks,
    };

    const db = getDB();
    return db.collection("users").updateOne(
      {
        _id: new ObjectId(userId),
      },
      { $set: { favorite: updatedFavorite } }
    );
  }
}

module.exports = User;
