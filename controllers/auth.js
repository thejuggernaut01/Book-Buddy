const User = require("../models/user");
const { getDB } = require("../utils/database");
const bycryptjs = require("bcryptjs");

exports.getLogin = (req, res, next) => {
  res.render("auth/login", {
    path: "/login",
    pageTitle: "Login into your account!",
  });
};

exports.getSignup = (req, res, next) => {
  res.render("auth/signup", {
    path: "/signup",
    pageTitle: "Create an account!",
  });
};

exports.postSignUp = (req, res, next) => {
  const firstName = req.body.firstName;
  const lastName = req.body.lastName;
  const email = req.body.email;
  const password = req.body.password;
  const age = req.body.age;

  const db = getDB();
  db.collection("users")
    .findOne({ email: email })
    .then((result) => {
      if (result) {
        return res.redirect("/signup");
      }

      bycryptjs
        .hash(password, 12)
        .then((hashPassword) => {
          const user = new User(firstName, lastName, email, hashPassword, age);
          return user.save();
        })
        .then((result) => {
          res.redirect("/login");
        })
        .catch((err) => {
          console.log(err);
        });
    })
    .catch((err) => {
      console.log(err);
    });
};
