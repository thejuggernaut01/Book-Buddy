const mongodb = require("mongodb");
const { getDB } = require("../utils/database");

const ObjectId = mongodb.ObjectId;

class User {
  constructor(firstName, lastName, email, password, favorite, verified) {
    this.firstName = firstName;
    this.lastName = lastName;
    this.email = email;
    this.password = password;
    this.favorite = favorite;
    this.verified = verified;
  }

  save() {
    const db = getDB();
    return db.collection("users").insertOne(this);
  }

  static fetchMyBooks(userId) {
    const db = getDB();
    return db.collection("books").find({ userId: userId });
  }

  static findOne(email) {
    const db = getDB();
    return db.collection("users").findOne({ email: email });
  }

  static addToFavorite(bookId, userId) {
    const db = getDB();

    // Check if this.favorite is defined on the instance, not the class
    if (!this.favorite || !Array.isArray(this.favorite.books)) {
      this.favorite = { books: [] };
    }

    const favBookIndex = this.favorite?.books.findIndex((item) => {
      return item.bookId.toString() === bookId.toString();
    });

    if (favBookIndex >= 0) {
      throw new Error("Book already added to favorite");
    } else {
      this.favorite.books.push({
        bookId: new ObjectId(bookId),
      });
    }

    return db.collection("users").updateOne(
      {
        _id: new ObjectId(userId),
      },
      { $set: { favorite: this.favorite } }
    );
  }

  static getFavorite(userId) {
    const db = getDB();
    const projection = { title: 1, author: 1 };
    // something is wrong with this._id
    // i get empy array when i use this._id
    // that's why i accepted the userId (req.session.user._id)

    return db
      .collection("users")
      .find({ _id: new ObjectId(userId) })
      .toArray()
      .then((user) => {
        const bookIds = [];
        user.forEach((user) => {
          return user.favorite.books.forEach((book) => {
            return bookIds.push(book.bookId);
          });
        });

        // return bookIds;
        return db
          .collection("books")
          .find({ _id: { $in: bookIds } })
          .project(projection)
          .toArray();
      });
  }

  static deleteFavorite(bookId, userId) {
    const db = getDB();

    return db
      .collection("users")
      .findOne({ _id: new ObjectId(userId) })
      .then((user) => {
        const updatedFavoriteBooks = user.favorite.books.filter((book) => {
          return book.bookId.toString() !== bookId;
        });

        return db
          .collection("users")
          .updateOne(
            { _id: new ObjectId(userId) },
            { $set: { favorite: { books: updatedFavoriteBooks } } }
          );
      });
  }

  static myReadingAge(userId) {
    const db = getDB();
    const projection = { age: 1 };

    return db
      .collection("users")
      .find({ _id: new ObjectId(userId) })
      .project(projection)
      .toArray();
  }
}

module.exports = User;
