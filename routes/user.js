const express = require("express");

const router = express.Router();

const userController = require("../controllers/user");
const isAuthorized = require("../middleware/isAuthorized");

router.get("/add-book", isAuthorized, userController.getAddBook);

router.get("/my-books", isAuthorized, userController.getMyBooks);

module.exports = router;
