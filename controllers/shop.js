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

exports.getCart = (req, res, next) => {
  res.render("shop/cart", {
    path: "/cart",
    pageTitle: "Your Order",
  });
};
