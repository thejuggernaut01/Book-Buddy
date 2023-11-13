const cloudinary = require("cloudinary");
const Book = require("../models/book");

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

exports.postBook = async (req, res, next) => {
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

  const bookAssets = [...bookFile, ...bookImage];

  if (!bookAssets) {
    throw new Error("No assets attached!");
  }

  // looped through book assets (image, file)
  // each assest was uploaded using cloudinary v2 uploader
  let multiplebookAssets = bookAssets.map((asset) =>
    cloudinary.v2.uploader.upload(asset.path)
  );

  // await all the cloudinary upload functions in promise.all, exactly where the magic happens
  let imageResponses = await Promise.all(multiplebookAssets);
  let bookFileUpdated = imageResponses[0].secure_url;
  let bookImageUpdated = imageResponses[1].secure_url;

  const book = new Book(
    title,
    description,
    authorName,
    publicationDate,
    rating,
    bookFileUpdated,
    bookImageUpdated,
    pages,
    language,
    readingAge,
    isbn13
  );

  book
    .save()
    .then(() => {
      res.redirect("/");
    })
    .catch((err) => {
      console.log(err.message);
    });
};
