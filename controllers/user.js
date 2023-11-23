const cloudinary = require("cloudinary");
const Book = require("../models/book");
const User = require("../models/user");

exports.getMyBooks = (req, res, next) => {
  const userId = req.session.user._id.toString();

  User.fetchMyBooks(userId).then((books) => {
    res.render("user/my-books", {
      path: "/user/my-books",
      pageTitle: "My books",
      books: books,
    });
  });
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

  if (bookAssets === 0) {
    throw new Error("No assets attached!");
  }

  try {
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
      pages,
      language,
      readingAge,
      isbn13,
      userId
    );

    await book.save();
    res.redirect("/");
  } catch (error) {
    console.log(error.message);
  }
};

exports.getEditBook = (req, res, next) => {
  const bookId = req.params.bookId;
  Book.findById(bookId)
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

exports.postEditBook = (req, res, next) => {};

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
      res.render("shop/favorite", {
        path: "/user/favorite",
        pageTitle: "Your Favorites",
        favorite: result,
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.deleteBook = async (req, res, next) => {
  const bookId = req.params.bookId;
  const userId = req.session.user._id.toString();

  Book.findById(bookId)
    .then((book) => {
      if (!book) {
        console.log("Bok not found!");
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
