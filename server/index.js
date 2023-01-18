const express = require("express");
const app = express();
const dotenv = require("dotenv").config();
const cors = require("cors");
const appRouting = require("./routing/route");
const DB = require("./connectDB/DB");
const { insertToken_price, getTokenData } = require("./controller");
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const FIVE_MIN = 1000 * 60 * 5;

setInterval(() => {
  insertToken_price();
}, FIVE_MIN);
app.use("/", appRouting);
app.listen(5000, (err) => {
  if (err) console.log(err);
  console.log("Connect PORT 5000");
});
