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
const sendEmail = async (res, next, email, mailOptions, token, type) => {
  try {
    // query db whether user signed up successfully
    const db = getDB();
    const user = await User.findOne(email);

    // Check if the user exists
    // Handle the case where the user is not found
    if (!user) {
      return res.redirect("/signup");
    }

    if (type === "welcome") {
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
    }

    // // check if type if for signUpEmail
    if (type === "signUpEmail") {
      // updating the user model for verification
      await db.collection("users").updateOne(
        { email: email },
        {
          $set: {
            verificationToken: token,
            verificationTokenExpiration: Date.now() + 1800000,
          },
        }
      );
    }

    // check if type if for resetPW
    if (type === "resetPW") {
      // if user exists,
      // update user resetToken and resetTokenExpiration field
      await db.collection("users").updateOne(
        { email: email },
        {
          $set: {
            resetToken: token,
            resetTokenExpiration: Date.now() + 1800000,
          },
        }
      );
    }

    // send verification email to user
    transporter.sendMail(mailOptions, function (err, data) {
      if (err) {
        console.log(err);
      }
      if (type === "signUpEmail") {
        return res.redirect("/verify-email");
      }

      if (type === "resetPW") {
        return res.redirect("/reset-password");
      }

      res.redirect("/");
    });
  } catch (err) {
    const error = new Error(err);
    console.log(err);
    error.httpStatusCode = 500;

    return next(error);
  }
};

exports.getMsgForPath = getMsgForPath;
exports.sendEmail = sendEmail;
