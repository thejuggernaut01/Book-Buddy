const crypto = require("crypto");
const nodemailer = require("nodemailer");

const User = require("../models/user");
const { getDB } = require("./database");

// nodemailer transporter configuration
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    type: "OAuth2",
    user: process.env.MAIL_USERNAME,
    pass: process.env.MAIL_PASSWORD,
    clientId: process.env.OAUTH_CLIENTID,
    clientSecret: process.env.OAUTH_CLIENT_SECRET,
    refreshToken: process.env.OAUTH_REFRESH_TOKEN,
  },
});

// helper function to get msg from errorArray
// using the specified path
const getMsgForPath = (errorArray, path) => {
  for (const error of errorArray) {
    if (error.path === path) {
      return error.msg;
    }
  }
  return null;
};

// sign up verification function
// sends email after successful sign up
const signUpVerification = async (res, next, email, mailOptions, token) => {
  try {
    // query db whether user signed up successfully
    const db = getDB();
    const user = await User.findOne(email);

    // Check if the user exists
    // Handle the case where the user is not found
    if (!user) {
      return res.redirect("/signup");
    }

    // add verificationToken and verificationTokenExpiration to user object
    user.verificationToken = token;
    user.verificationTokenExpiration = Date.now() + 1800000;

    // updating the user model for verification
    await db.collection("users").updateOne(
      { email: email },
      {
        $set: {
          verificationToken: user.verificationToken,
          verificationTokenExpiration: user.verificationTokenExpiration,
        },
      }
    );

    // send verification email to user
    transporter.sendMail(mailOptions, function (err, data) {
      if (err) {
        console.log(err);
      }
      res.redirect("/verify-email");
    });
  } catch (err) {
    const error = new Error(err);
    console.log(err);
    error.httpStatusCode = 500;

    return next(error);
  }
};

exports.getMsgForPath = getMsgForPath;
exports.signUpVerification = signUpVerification;
