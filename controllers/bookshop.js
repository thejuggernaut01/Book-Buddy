const Book = require("../models/book");

const ITEMS_PER_PAGE = 4;

exports.getHome = (req, res, next) => {
  res.render("shop/home", {
    path: "/",
    pageTitle: "Welcome to book buddy",
  });
};

exports.getAllBooks = async (req, res, next) => {
  const page = +req.query.page || 1;

  try {
    // fetch all books
    const totalBooks = await Book.fetchAll().count();
    const books = await Book.fetchAll()
      .skip((page - 1) * ITEMS_PER_PAGE)
      .limit(ITEMS_PER_PAGE)
      .toArray();

    res.render("shop/books", {
      path: "/books",
      pageTitle: "Available Books",
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
