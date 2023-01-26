const { Y_CRVToken } = require("../services/yCRVService");
const { LiquidityData } = require("../web3/web3Service");

const getBalance = async (req, res) => {
  try {
    let web3BalanceService = new LiquidityData(req, res);
    const tokenBalance = await web3BalanceService.balanceToken(req, res);
    return tokenBalance;
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: error.message });
  }
};

const getTokenData = async (req, res) => {
  try {
    let tokenData = new Y_CRVToken(req, res);
    const data = await tokenData.get_YCRV_InfoFromDB(req, res);
    return data;
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: err.message });
  }
};
const getRecentPoolLedger = async (req, res) => {
  try {
    const timeRange = req.body.timeRange;
    let ledgerPool = new Y_CRVToken(req, res);
    let data = ledgerPool.get_poolLedger(req, res, timeRange);
    return data;
  } catch (err) {
    console.log(err);
  }
};

module.exports = {
  getBalance,
  getTokenData,
  getRecentPoolLedger,
};
