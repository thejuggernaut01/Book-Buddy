exports.getAddBook = (req, res, next) => {
  res.render("user/add-book", {
    path: "/user/add-book",
    pageTitle: "Book upload",
  });
};

exports.getMyBooks = (req, res, next) => {
  res.render("user/my-books", {
    path: "/user/my-books",
    pageTitle: "My books",
  });
};
