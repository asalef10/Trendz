const routing = require("express").Router();
const controller = require("../controller/index");
routing.get("/getBalance", controller.getBalance);
routing.post("/getLedger", controller.getRecentPoolLedger);
routing.get("/getTokenData", controller.getTokenData);
module.exports = routing;
