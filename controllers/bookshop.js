const Book = require("../models/book");

exports.getHome = (req, res, next) => {
  res.render("shop/home", {
    path: "/",
    pageTitle: "Welcome to book buddy",
  });
};

exports.getAllBooks = (req, res, next) => {
  Book.fetchAll()
    .then((result) => {
      res.render("shop/books", {
        path: "/books",
        pageTitle: "Available Books",
        books: result,
      });
    })
    .catch((err) => {
      console.log(err.message);
    });
};

exports.getBook = (req, res, next) => {
  let bookId = req.params.bookId;
  Book.findById(bookId).then((book) => {
    if (!book) {
      res.redirect("/books");
    }

    res.render("shop/book-detail", {
      path: "/book-detail",
      pageTitle: "Book Detail",
    });
  });
};

exports.getFavorite = (req, res, next) => {
  res.render("shop/favorite", {
    path: "/cart",
    pageTitle: "Your Order",
  });
};
