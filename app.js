const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");
const { mongoConnect } = require("./utils/database");
const multer = require("multer");
const csurf = require("csurf");

const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);

const MONGODB_URI = process.env.MONGODB_URI;

const app = express();
require("dotenv").config();

const store = new MongoDBStore({
  uri: MONGODB_URI,
  collection: "sessions",
});

const csrfProtection = csurf();

app.set("view engine", "ejs");
app.set("views", "views");

const shopRoute = require("./routes/shop");
const authRoute = require("./routes/auth");
const userRoute = require("./routes/user");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "/public")));

app.use(
  session({
    resave: false,
    saveUninitialized: false,
    secret: "aythejuggernaut, the best cloud engineer",
    store: store,
  })
);

app.use(csrfProtection);

app.use((req, res, next) => {
  res.locals.isAuthenticated = req.session.isLoggedIn;
  res.locals.csrfToken = req.csrfToken();

  next();
});

app.use("/user", userRoute);
app.use(shopRoute);
app.use(authRoute);

mongoConnect(() => {
  app.listen(3030);
});
