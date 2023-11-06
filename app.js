const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");

const shopRoute = require("./routes/shop");
const authRoute = require("./routes/auth");
const userRoute = require("./routes/user");

const { mongoConnect } = require("./utils/database");

const app = express();
require("dotenv").config();

app.set("view engine", "ejs");
app.set("views", "views");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "/public")));

app.use("/user", userRoute);
app.use(shopRoute);
app.use(authRoute);

mongoConnect(() => {
  app.listen(3030);
});
