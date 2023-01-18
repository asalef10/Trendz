const routing = require("express").Router();
const controller = require("../controller/index");
routing.get("/getBalance", controller.getBalance);
routing.get("/getEvent", controller.getEvent);
routing.get("/getTokenData", controller.getTokenData);
module.exports = routing;
