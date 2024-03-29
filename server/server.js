const express = require("express");
const app = express();
const dotenv = require("dotenv").config();
const cors = require("cors");
const appRouting = require("./routing/route");
const DB = require("./connectDB/DB");
const cron = require("node-cron");
const Y_CRVToken = require("./services/y_crv/ycrv_Service");
const LiquidityData_ycrv = require("./web3/y_crv/y_crv");
const call = require("./web3/lido/lido");
const os = require("os");
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const PORT = process.env.PORT;
async function x(){
  await call()
//  await LiquidityData_stETH.getPastEventsInBlockRange()
}
x()
const isWindows = () => {
  if (os.platform() === "win32") {
    return true;
  } else {
    return false;
  }
};
cron.schedule("*/2 * * * *", () => {
  if (isWindows()) {
    console.log("Running on localhost");
  } else {
    Y_CRVToken.insertPriceTokenIntoDB();
  }
});

cron.schedule("*/5 * * * *", () => {
  if (isWindows()) {
    console.log("Running on localhost");
  } else {
    Y_CRVToken.insertDataFromEvent(LiquidityData_ycrv);
  }
});

app.use("/", appRouting);

app.listen(PORT || 5000, (err) => {
  if (err) console.log(err);
  console.log(`Connect PORT ${PORT}`);
});

let result = true + true;
