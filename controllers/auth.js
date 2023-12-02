const User = require("../models/user");
const { getDB } = require("../utils/database");
const bcryptjs = require("bcryptjs");
const Toastify = require("toastify-js");

exports.getLogin = (req, res, next) => {
  res.render("auth/login", {
    path: "/login",
    pageTitle: "Login into your account!",
    errorMessage: false,
    oldInput: {
      email: "",
      password: "",
    },
  });
};

exports.getSignup = (req, res, next) => {
  res.render("auth/signup", {
    path: "/signup",
    pageTitle: "Create an account!",
  });
};

exports.postLogin = async (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;

  const db = getDB();
  db.collection("users")
    .findOne({ email: email })
    .then((user) => {
      if (!user) {
        return res.status(401).render("auth/login", {
          path: "/login",
          pageTitle: "Login into your account!",
          errorMessage: "Invalid email or password.",
          oldInput: {
            email: email,
            password: password,
          },
          validationErrors: [],
        });
      }

      bcryptjs
        .compare(password, user.password)
        .then((doMatch) => {
          if (doMatch) {
            req.session.isLoggedIn = true;
            req.session.user = user;
            return req.session.save((err) => {
              res.redirect("/");
            });
          }

          return res.status(401).render("auth/login", {
            path: "/login",
            pageTitle: "Login into your account!",
            errorMessage: "Invalid email or password.",
            oldInput: {
              email: email,
              password: password,
            },
            validationErrors: [],
          });
        })
        .catch((err) => {
          console.log(err);
          res.redirect("/login");
        });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.postSignUp = (req, res, next) => {
  const firstName = req.body.firstName;
  const lastName = req.body.lastName;
  const email = req.body.email;
  const password = req.body.password;
  const age = req.body.age;
  const favorite = { books: [] };

  const db = getDB();
  db.collection("users")
    .findOne({ email: email })
    .then((result) => {
      if (result) {
        return res.redirect("/signup");
      }

      bcryptjs
        .hash(password, 12)
        .then((hashPassword) => {
          const user = new User(
            firstName,
            lastName,
            email,
            hashPassword,
            +age,
            favorite
          );
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

exports.postLogout = (req, res, next) => {
  req.session.destroy((err) => {
    res.redirect("/login");
  });
};
