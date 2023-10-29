const express = require("express");

const router = express.Router();

const userController = require("../controllers/user");

router.get("/add-book", userController.getAddBook);

router.get("/my-books", userController.getMyBooks);

module.exports = router;
