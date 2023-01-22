const express = require("express");
const app = express();
const dotenv = require("dotenv").config();
const cors = require("cors");
const appRouting = require("./routing/route");
const DB = require("./connectDB/DB");
const { insertToken_price } = require("./controller");
const tokenService = require("./services/yCRVService");
const cron = require('node-cron');

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const PORT = process.env.PORT;
const TWO_MIN = 1000 * 60 * 2;

 
cron.schedule('*/2 * * * *', () => {
  let token = new tokenService.Y_CRVToken();
     token.insertPrice();
});




app.use("/Trendz", appRouting);
app.get("/", (req, res) => {
  res.json("Welcome to Trendz");
});

app.listen(PORT || 5000, (err) => {
  if (err) console.log(err);
  console.log(`Connect PORT ${PORT}`);
});
