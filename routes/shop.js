const express = require("express");
const router = express.Router();

const shopController = require("../controllers/shop");

router.get("/", shopController.getHome);

router.get("/books", shopController.getAllBooks);

router.get("/cart", shopController.getCart);

router.get("/orders", shopController.getOrder);

module.exports = router;
