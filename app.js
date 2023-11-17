const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");
const { mongoConnect } = require("./utils/database");
const csurf = require("csurf");
const multer = require("multer");
const cloudinary = require("cloudinary").v2;

const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);

const MONGODB_URI = process.env.MONGODB_URI;
const { getDB } = require("./utils/database");

const app = express();
require("dotenv").config();

const store = new MongoDBStore({
  uri: MONGODB_URI,
  collection: "sessions",
  expires: 1000 * 60 * 60 * 24 * 5,
});

const csrfProtection = csurf();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  secure: true,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "files");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now().toString() + "-" + file.originalname);
  },
});

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "application/pdf" ||
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/jpeg"
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

app.set("view engine", "ejs");
app.set("views", "views");

const shopRoute = require("./routes/bookshop");
const authRoute = require("./routes/auth");
const userRoute = require("./routes/user");
const User = require("./models/user");

app.use(bodyParser.urlencoded({ extended: false }));

app.use(
  multer({ storage: fileStorage, fileFilter: fileFilter }).fields([
    { name: "file", maxCount: 1 },
    { name: "image", maxCount: 1 },
  ])
);

app.use(express.static(path.join(__dirname, "/public")));
app.use("/files", express.static(path.join(__dirname, "files")));

app.use(
  session({
    resave: false,
    saveUninitialized: false,
    secret: "aythejuggernaut, the best cloud engineer",
    store: store,
    cookie: {
      sameSite: "strict",
      httpOnly: true,
    },
  })
);

app.use(csrfProtection);

app.use((req, res, next) => {
  res.locals.isAuthenticated = req.session.isLoggedIn;
  res.locals.csrfToken = req.csrfToken();

  next();
});

app.use((req, res, next) => {
  const db = getDB();

  if (!req.session.user) {
    return next();
  }

  db.collection("users")
    .findOne({ email: req.session.user._id })
    .then((user) => {
      console.log("App.js", user);
      if (!user) {
        return next();
      }

      req.user = user;
      next();
    })
    .catch((err) => {
      console.log(err);
      return next();
    });
});

app.use("/user", userRoute);
app.use(shopRoute);
app.use(authRoute);

mongoConnect(() => {
  app.listen(3030);
});
