const express = require("express");
const router = express.Router();

const shopController = require("../controllers/shop");
const isAuthorized = require("../middleware/isAuthorized");

router.get("/", shopController.getHome);

router.get("/books", shopController.getAllBooks);

router.get("/favorite", isAuthorized, shopController.getFavorite);

module.exports = router;
