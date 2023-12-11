const express = require("express");
const { body } = require("express-validator");
const User = require("../models/user");

const router = express.Router();

const authController = require("../controllers/auth");

router.get("/login", authController.getLogin);

router.get("/signup", authController.getSignup);

router.get("/verify-email", authController.verifyEmail);

router.get("/verify-email/:tokenId", authController.verifiedUser);

router.get("/reset-password", authController.getResetPassword);

router.get("/reset", authController.getReset);

router.get("/reset/:tokenId", authController.getNewPassword);

router.post("/login", authController.postLogin);

router.post(
  "/signup",
  [
    body("firstName").notEmpty().trim().escape(),
    body("lastName").notEmpty().trim().escape(),
    body("email")
      .notEmpty()
      .isEmail()
      .withMessage("Please enter a valid email.")
      .custom((value) => {
        return User.findOne(value).then((user) => {
          if (user) {
            return Promise.reject("Email exist already, pick a different one.");
          }
        });
      }),
    body(
      "password",
      "Please enter a password with only numbers and text and at least 6 characters long."
    )
      .notEmpty()
      .trim()
      .isLength({ min: 5 })
      .isAlphanumeric()
      .escape(),
  ],
  authController.postSignUp
);

router.post(
  "/reset",
  [
    body("email")
      .notEmpty()
      .isEmail()
      .withMessage("Please enter a valid email."),
  ],
  authController.postReset
);

router.post("/reset/:tokenId", authController.postNewPassword);

router.post("/logout", authController.postLogout);

module.exports = router;
