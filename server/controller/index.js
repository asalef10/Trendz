const Y_CRVToken = require("../services/y_crv/ycrv_Service");
const LiquidityData = require("../web3/y_crv/y_crv");

const trendzApi = (req, res) => {
  try {
    res.status(200).json("Welcome To Trendz");
  } catch (err) {
    res.status(500).json("Error With Server");
    console.log(err);
  }
};
const getBalance = async (req, res) => {
  try {
    const web3BalanceService = LiquidityData;
    const tokenBalance = await web3BalanceService.balanceToken(req, res);
    return tokenBalance;
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: error.message });
  }
};
const getRecentPoolLedger = async (req, res) => {
  try {
    const ledgerPool =  Y_CRVToken;
    const data = await ledgerPool.get_Ledger(req, res);
    return data;
  } catch (err) {
    console.log(err);
  }
};
const getTotalAddressTx = async (req, res) => {
  try {
    const txPool = Y_CRVToken;
    const data = await txPool.totalAddressTx(req, res);
    return data;
  } catch (err) {
    console.log(err);
  }
};

module.exports = {
  getBalance,
  getRecentPoolLedger,
  getTotalAddressTx,
  trendzApi,
};
