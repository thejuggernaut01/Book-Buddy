const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");

const shopRoute = require("./routes/shop");
const authRoute = require("./routes/auth");

const app = express();

app.set("view engine", "ejs");
app.set("views", "views");

app.use(shopRoute);
app.use(authRoute);

app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.static(path.join(__dirname, "public")));

app.listen(3030);
