const express = require("express");

const router = express.Router();

const userController = require("../controllers/user");
const isAuthorized = require("../middleware/isAuthorized");

router.get("/add-book", isAuthorized, userController.getAddBook);

router.post("/add-book", isAuthorized, userController.postAddBook);

router.get("/edit-book/:bookId", isAuthorized, userController.getEditBook);

router.get("/my-books", isAuthorized, userController.getMyBooks);

router.get("/favorite", isAuthorized, userController.getFavorite);

router.post("/favorite/:bookId", isAuthorized, userController.addFavorite);

router.delete("/my-books/:bookId", userController.deleteBook);

module.exports = router;
