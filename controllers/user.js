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

exports.postBook = (req, res, next) => {
  const title = req.body.title;
  const description = req.body.description;
  const authorName = req.body.authorName;
  const uploadFile = req.file;
  const publicationDate = req.body.publicationDate;
  const rating = req.body.rating;
  const pages = req.body.pages;
  const language = req.body.language;
  const readingAge = req.body.readingAge;
  const isbn13 = req.body.isbn13;

  console.log({
    title,
    description,
    authorName,
    publicationDate,
    rating,
    pages,
    language,
    readingAge,
    isbn13,
    uploadFile,
  });

  console.log("BODY ");
  console.log(req.body);

  res.redirect("/");
};
