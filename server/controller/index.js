const tokenService = require("../services/yCRVService");
const web3Service = require("../web3/web3Service");
const getBalance = async (req, res) => {
  try {
    let web3BalanceService = new web3Service.LiquidityData(req, res);
    const tokenBalance = await web3BalanceService.balanceToken(req, res);
    return tokenBalance;
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: error.message });
  } 
};

const getEvent = async (req, res) => {
  try {
    let eventData = new web3Service.LiquidityData();
    const data = await eventData.eventData(req,res);
    return data;
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: error.message });
  }
};

const getTokenData = async (req, res) => {
  try {
    let tokenData = new tokenService.Y_CRVToken(req, res);
    const data = await tokenData.getDataFromDB(req, res);
    return data;
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getBalance,
  getEvent,
  getTokenData,
};
