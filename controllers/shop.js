exports.getHome = (req, res, next) => {
  res.render("shop/home", {
    path: "/",
    pageTitle: "Welcome to book buddy",
  });
};

exports.getAllBooks = (req, res, next) => {
  res.render("shop/books", {
    path: "/books",
    pageTitle: "Available Books",
  });
};

exports.getFavorite = (req, res, next) => {
  res.render("shop/favorite", {
    path: "/cart",
    pageTitle: "Your Order",
  });
};
