const cloudinary = require("cloudinary");
const Book = require("../models/book");
const User = require("../models/user");
const mongodb = require("mongodb");
const ObjectId = mongodb.ObjectId;

const { getDB } = require("../utils/database");

const ITEMS_PER_PAGE = 4;

exports.getMyBooks = async (req, res, next) => {
  const userId = req.session.user._id.toString();
  const page = +req.query.page || 1;

  // fetch books uploaded by currently logged in user
  try {
    const totalBooks = await User.fetchMyBooks(userId).count();
    const books = await User.fetchMyBooks(userId)
      .skip((page - 1) * ITEMS_PER_PAGE)
      .limit(ITEMS_PER_PAGE)
      .toArray();

    res.render("user/my-books", {
      path: "/user/my-books",
      pageTitle: "My books",
      books: books,
      currentPage: page,
      hasNextPage: ITEMS_PER_PAGE * page < totalBooks,
      hasPreviousPage: page > 1,
      nextPage: page + 1,
      previousPage: page - 1,
      lastPage: Math.ceil(totalBooks / ITEMS_PER_PAGE),
    });
  } catch (error) {
    if (!error.statusCode) {
      error.status = 500;
    }
    next(err);
  }
};

exports.getAddBook = (req, res, next) => {
  res.render("user/add-book", {
    path: "/user/add-book",
    pageTitle: "Book upload",
    editing: false,
  });
};

exports.postAddBook = async (req, res, next) => {
  const title = req.body.title;
  const description = req.body.description;
  const authorName = req.body.authorName;

  const bookFile = req.files.file;
  const bookImage = req.files.image;

  const publicationDate = req.body.publicationDate;
  const rating = req.body.rating;
  const pages = req.body.pages;
  const language = req.body.language;
  const readingAge = req.body.readingAge;
  const isbn13 = req.body.isbn13;
  const userId = req.session.user._id.toString();

  const bookAssets = [...bookFile, ...bookImage];

  try {
    if (bookAssets === 0) {
      const error = new Error("No assets attached!");
      error.statusCode = 404;
      throw error;
    }

    // looped through book assets (image, file)
    // each assest was uploaded using cloudinary v2 uploader
    let multiplebookAssets = bookAssets.map((asset) =>
      cloudinary.v2.uploader.upload(asset.path)
    );

    // await all the cloudinary upload functions in promise.all, exactly where the magic happens
    let imageResponses = await Promise.all(multiplebookAssets);

    let bookFileUrl = {
      secureUrl: imageResponses[0].secure_url,
      public_id: imageResponses[0].public_id,
    };

    let bookImageUrl = {
      secureUrl: imageResponses[1].secure_url,
      public_id: imageResponses[1].public_id,
    };

    const book = new Book(
      title,
      description,
      authorName,
      publicationDate,
      rating,
      bookFileUrl,
      bookImageUrl,
      +pages,
      language,
      +readingAge,
      isbn13,
      userId
    );

    await book.save();
    res.redirect("/");
  } catch (error) {
    console.log(error.message);
  }
};

exports.getEditBook = async (req, res, next) => {
  const bookId = req.params.bookId;
  await Book.findById(bookId)
    .then((book) => {
      if (!book) {
        res.redirect("/my-books");
      }

      res.render("user/add-book", {
        path: "/user/edit-book",
        pageTitle: "Edit Book",
        editing: true,
        book: book,
      });
    })
    .catch((err) => {
      console.log(err.message);
    });
};

exports.postEditBook = async (req, res, next) => {
  const bookId = req.params.bookId;
  const title = req.body.title;
  const description = req.body.description;
  const authorName = req.body.authorName;
  const bookFile = req.files.file;
  const bookImage = req.files.image;
  const publicationDate = req.body.publicationDate;
  const rating = req.body.rating;
  const pages = req.body.pages;
  const language = req.body.language;
  const readingAge = req.body.readingAge;
  const isbn13 = req.body.isbn13;
  const userId = req.session.user._id.toString();

  const db = getDB();

  const existingBook = await db
    .collection("books")
    .findOne({ _id: new ObjectId(bookId) });

  try {
    if (!existingBook) {
      const error = new Error("Book not found!");
      error.statusCode = 404;
      throw error;
    }

    let newBookFile;
    let newBookImage;

    // check if there's a change in book pdf file
    if (bookFile) {
      // Deleting existing pdf file from Cloudinary
      await cloudinary.v2.uploader.destroy(existingBook.bookFile.public_id);

      // Upload new pdf file to Cloudinary
      const pdfResult = await cloudinary.uploader.upload(bookFile[0].path);
      newBookFile = {
        secureUrl: pdfResult.secure_url,
        public_id: pdfResult.public_id,
      };
    }

    // check if there's a change in book image
    if (bookImage) {
      // Deleting existing image from Cloudinary
      await cloudinary.v2.uploader.destroy(existingBook.bookImage.public_id);

      // Upload new image to Cloudinary
      const imageResult = await cloudinary.uploader.upload(bookImage[0].path);
      newBookImage = {
        secureUrl: imageResult.secure_url,
        public_id: imageResult.public_id,
      };
    }

    // Update metadata in MongoDB
    existingBook.title = title || existingBook.title;
    existingBook.description = description || existingBook.description;
    existingBook.authorName = authorName || existingBook.authorName;
    existingBook.bookFile = newBookFile || existingBook.bookFile;
    existingBook.bookImage = newBookImage || existingBook.bookImage;
    existingBook.publicationDate =
      publicationDate || existingBook.publicationDate;
    existingBook.rating = rating || existingBook.rating;
    existingBook.pages = pages || existingBook.pages;
    existingBook.language = language || existingBook.language;
    existingBook.readingAge = readingAge || existingBook.readingAge;
    existingBook.isbn13 = isbn13 || existingBook.isbn13;

    // update the book in the books collection
    await db
      .collection("books")
      .updateOne({ _id: new ObjectId(bookId) }, { $set: existingBook });

    return res.redirect("/user/my-books");
  } catch (error) {
    console.log(error.message);
  }
};

exports.deleteBook = async (req, res, next) => {
  const bookId = req.params.bookId;
  const userId = req.session.user._id.toString();

  Book.findById(bookId)
    .then((book) => {
      if (!book) {
        console.log("Book not found!");
      }

      const { bookFile, bookImage } = book;
      const bookAssets = [bookFile.public_id, bookImage.public_id];

      bookAssets.map(async (asset) => {
        await cloudinary.v2.api.delete_resources(asset);
      });

      return Book.deleteById(bookId, userId).then(() => {
        res.status(200).json({ message: "Success!" });
      });
    })
    .catch((err) => {
      console.log("Error " + err.message);
      res.status(500).json({ message: "Deleting product failed!" });
    });
};

exports.addFavorite = (req, res, next) => {
  const bookId = req.params.bookId;
  const userId = req.session.user._id;

  User.addToFavorite(bookId, userId)
    .then(() => {
      res.status(200).json({ message: "Added to favorites successfully" });
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({ error: "Internal Server Error" });
    });
};

exports.getFavorite = (req, res, next) => {
  const userId = req.session.user._id;

  User.getFavorite(userId)
    .then((result) => {
      res.render("user/favorite", {
        path: "/user/favorite",
        pageTitle: "Your Favorites",
        favorites: result,
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.deleteFavorite = (req, res, next) => {
  const bookId = req.params.bookId;
  const userId = req.session.user._id;

  User.deleteFavorite(bookId, userId)
    .then((result) => {
      if (!result) {
        throw new Error("Cannot delete favorite book.");
      }

      res.redirect("/user/favorite");
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: "Internal Server Error" });
    });
};
