const express = require("express");

const router = express.Router();

const userController = require("../controllers/user");
const isAuthorized = require("../middleware/isAuthorized");

router.get("/add-book", isAuthorized, userController.getAddBook);

router.get("/edit-book/:bookId", isAuthorized, userController.getEditBook);

router.get("/my-books", isAuthorized, userController.getMyBooks);

router.get("/favorite", isAuthorized, userController.getFavorite);

router.post("/add-book", isAuthorized, userController.postAddBook);

router.post("/favorite/:bookId", isAuthorized, userController.addFavorite);

router.post("/favorite/delete-favorite/:bookId", userController.deleteFavorite);

router.post("/edit-book/:bookId", isAuthorized, userController.postEditBook);

router.delete("/my-books/:bookId", userController.deleteBook);

module.exports = router;
