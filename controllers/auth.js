const bcryptjs = require("bcryptjs");
const crypto = require("crypto");

const User = require("../models/user");

const { getDB } = require("../utils/database");
const { validationResult } = require("express-validator");
const { getMsgForPath, signUpVerification } = require("../utils/helper");

exports.getLogin = (req, res, next) => {
  res.render("auth/login", {
    path: "/login",
    pageTitle: "Login into your account!",
    errorMessage: false,
    oldInput: {
      email: "",
      password: "",
      firstName: "",
      lastName: "",
      age: "",
    },
  });
};

exports.getSignup = (req, res, next) => {
  res.render("auth/signup", {
    path: "/signup",
    pageTitle: "Create an account!",
    firstNameErrMsg: "",
    lastNameErrMsg: "",
    emailErrMsg: "",
    pwErrMsg: "",

    oldInput: {
      email: "",
      password: "",
      firstName: "",
      lastName: "",
      age: "",
    },
  });
};

exports.verifyEmail = (req, res, next) => {
  res.render("auth/verify-email", {
    path: "/verify-email",
    pageTitle: "Verify your email!",
  });
};

exports.verifiedUser = async (req, res, next) => {
  const token = req.params.tokenId;

  const db = getDB();
  const user = await db.collection("users").findOne({
    verificationToken: token,
    verificationTokenExpiration: { $gt: Date.now() },
  });

  if (!user) {
    const error = new Error("Email verification failed");
    error.statusCode = 401;
    throw error;
  }

  await db.collection("users").updateOne(
    { email: user.email },
    {
      $set: {
        verified: true,
        verificationToken: undefined,
        verificationTokenExpiration: undefined,
      },
    }
  );

  res.render("auth/verified", {
    path: "/verified",
    pageTitle: "You're account has been verified!",
  });
};

exports.postLogin = async (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;

  User.findOne(email)
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

      if (!user.verified) {
        return res.status(401).render("auth/login", {
          path: "/login",
          pageTitle: "Login into your account!",
          errorMessage:
            "Your account hasn't been verified, check your email and verify.",
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
            return req.session.save(async (err) => {
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

exports.postSignUp = async (req, res, next) => {
  const firstName = req.body.firstName;
  const lastName = req.body.lastName;
  const email = req.body.email;
  const password = req.body.password;
  const age = req.body.age;
  const favorite = { books: [] };
  const verified = false;

  const errors = validationResult(req);
  const errorArray = errors.array();

  // check if there's validation error
  if (!errors.isEmpty()) {
    return res.status(422).render("auth/signup", {
      path: "/signup",
      pageTitle: "Create an account!",
      firstNameErrMsg: getMsgForPath(errorArray, "firstName"),
      lastNameErrMsg: getMsgForPath(errorArray, "lastName"),
      emailErrMsg: getMsgForPath(errorArray, "email"),
      pwErrMsg: getMsgForPath(errorArray, "password"),

      oldInput: {
        email,
        password,
        firstName,
        lastName,
        age,
      },
    });
  }

  // generate random number (size = 32)
  crypto.randomBytes(32, async (err, buffer) => {
    // checking an error occured after generating random values
    if (err) {
      return res.redirect("/signup");
    }

    try {
      // query db whether user already exists
      const user = await User.findOne(email);

      // return to sign up page if user exists
      if (user) {
        return res.redirect("/signup");
      }

      // converted the randomBytes buffer to hex string
      const token = buffer.toString("hex");

      // hash user password
      const hashedPassword = await bcryptjs.hash(password, 12);

      // save user
      const newUser = new User(
        firstName,
        lastName,
        email,
        hashedPassword,
        +age,
        favorite,
        verified
      );
      await newUser.save();

      // mail options for nodemailer
      const mailOptions = {
        from: '"<Book Buddy>" bookbuddy@gmail.com',
        to: email,
        subject: "Verify Your Account on Book Buddy",
        html: `
          <main>
            <p>Dear ${firstName},</p>
            <p>Welcome to Book Buddy! 📚✨ To ensure the security of your account, we kindly ask you to verify your email address.</p>

            <p>Please click on the following link to complete the verification process: <a href="http://localhost:3030/verify-email/${token}">Verification Link</a></p>

            <p>Note: This link is valid for the next 30 minutes. If you don't verify your account within this timeframe, you may need to request a new verification email.</p>

            <p>If you did not sign up for Book Buddy, please ignore this email.</p>

            <p>Thank you for being a part of our reading community!</p>

            <p>Best,<br>
              [Your Book Sharing Platform] Team</p>
          </main>
    `,
      };

      // send verification email
      await signUpVerification(res, next, email, mailOptions, token);
    } catch (err) {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    }
  });
};

exports.postLogout = (req, res, next) => {
  req.session.destroy((err) => {
    res.redirect("/login");
  });
};
