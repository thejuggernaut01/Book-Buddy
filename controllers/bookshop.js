const Book = require("../models/book");

exports.getHome = (req, res, next) => {
  res.render("shop/home", {
    path: "/",
    pageTitle: "Welcome to book buddy",
  });
};

exports.getAllBooks = async (req, res, next) => {
  // fetch all books
  const books = await Book.fetchAll();

  res.render("shop/books", {
    path: "/books",
    pageTitle: "Available Books",
    books: books,
  });
};

exports.getBook = async (req, res, next) => {
  // fetch a single book using the book id
  let bookId = req.params.bookId;
  const book = await Book.findById(bookId);
  if (!book) {
    res.redirect("/books");
  }

  res.render("shop/book-detail", {
    path: "/book-detail",
    pageTitle: "Book Detail",
    book: book,
  });
};
