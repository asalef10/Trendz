const { Y_CRVToken } = require("../services/yCRVService");
const { LiquidityData } = require("../web3/web3Service");

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
    let web3BalanceService = new LiquidityData(req, res);
    const tokenBalance = await web3BalanceService.balanceToken(req, res);
    return tokenBalance;
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: error.message });
  }
};
const getRecentPoolLedger = async (req, res) => {
  try {
    let ledgerPool = new Y_CRVToken(req, res);
    let data = ledgerPool.get_Ledger(req, res);
    return data;
  } catch (err) {
    console.log(err);
  }
};
const getTotalAddressTx = async (req, res) => {
  try {
    const txPool = new Y_CRVToken(req, res);
    const data = txPool.totalAddressTx(req, res);
    return data;
  } catch (err) {
    console.log(err);
  }
};

module.exports = {
  getBalance,
  getRecentPoolLedger,
  getTotalAddressTx,
  trendzApi
};
