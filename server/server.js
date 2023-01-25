const express = require("express");
const app = express();
const dotenv = require("dotenv").config();
const cors = require("cors");
const appRouting = require("./routing/route");
const DB = require("./connectDB/DB");
const cron = require("node-cron");
const { Y_CRVToken } = require("./services/yCRVService");
const { LiquidityData } = require("./web3/web3Service");

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const PORT = process.env.PORT;

let liquidityEvent = new LiquidityData();

// cron.schedule("*/2 * * * *", () => {
//   new Y_CRVToken().insertPriceTokenIntoDB();
// });

setInterval(()=>{
  // new Y_CRVToken().insertDataFromEvent(liquidityEvent);

},2000)
// cron.schedule("*/5 * * * *", () => {
// });

app.use("/", appRouting);
app.get("/", (req, res) => {
  res.json("Welcome to Trendz");
});

app.listen(PORT || 5000, (err) => {
  if (err) console.log(err);
  console.log(`Connect PORT ${PORT}`);
});
