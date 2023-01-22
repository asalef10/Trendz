const tokenService = require("../services/yCRVService");
const web3Service = require("../web3/web3");
const getBalance = async (req, res) => {
  try {
    let service = new web3Service.Event_contract(req, res);
    const balance = await service.balanceToken(req, res);
    return balance;
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: error.message });
  }
};

const getEvent = async (req, res) => {
  try {
    let service = new web3Service.Event_contract(req, res);
    const allEvent = await service.Event();
    return allEvent;
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: error.message });
  }
};

const getTokenData = async (req, res) => {
  try {
    let token = new tokenService.Y_CRVToken(req, res);
    const data = await token.dataHandle(req, res);
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
