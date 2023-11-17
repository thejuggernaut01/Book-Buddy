const express = require("express");
const router = express.Router();

const shopController = require("../controllers/bookshop");
const isAuthorized = require("../middleware/isAuthorized");

router.get("/", shopController.getHome);

router.get("/books", shopController.getAllBooks);

router.get("/books/:bookId", shopController.getBook);

module.exports = router;
