const routing = require("express").Router();
const controller = require("../controller/index");
routing.get("/", controller.trendzApi);
routing.get("/getBalance", controller.getBalance);
routing.post("/getLedger", controller.getRecentPoolLedger);
routing.get("/getTotalAddressTx", controller.getTotalAddressTx);
module.exports = routing;
 