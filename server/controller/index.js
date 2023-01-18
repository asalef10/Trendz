const Web3 = require("web3");
const DB = require("../connectDB/DB");
const yearnABI = require("../artifacts/yearnABI.json");
const erc20ABI = require("../artifacts/erc20ABI.json");
const moment = require("moment-timezone");
const timezone = "Asia/Jerusalem";
const currentDateTime = moment().tz(timezone).format();
const contract_Liquidity_Address = "0x27B5739e22ad9033bcBf192059122d163b60349D";
const provider =
  "https://mainnet.infura.io/v3/3829b14aea8b40c982384f10c153121f";
const web3 = new Web3(provider);
const yCRV_Token = "0xFCc5c47bE19d06BF83eB04298b026F81069ff65b";

const contract = new web3.eth.Contract(yearnABI, contract_Liquidity_Address);
const contractERC20 = new web3.eth.Contract(erc20ABI, yCRV_Token);
const sender_yCRVAddress = "0x01D7f32B6E463c96c00575fA97B8224326C6A6B9";
const addressNull = "0x0000000000000000000000000000000000000000";

const getBalance = async (req, res) => {
  try {
    let balance = await contractERC20.methods
      .balanceOf(contract_Liquidity_Address)
      .call();
    let convertValue = web3.utils.fromWei(balance);

    res.json(convertValue);
    return balance;
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: error.message });
  }
};
const getEvent = async (req, res) => {
  try {
    let deposit = [];
    let withdraw = [];
    const events = await contract.getPastEvents("Transfer", {
      fromBlock: 0,
      toBlock: "latest",
    });
    events.map((item) => {
      if (
        item.returnValues.sender !== sender_yCRVAddress &&
        deposit.length !== 5 &&
        item.returnValues.sender !== addressNull
      ) {
        let convertValue = web3.utils.fromWei(item.returnValues.value);
        item.returnValues.value = convertValue;
        deposit.push(item.returnValues);
      } else if (
        item.returnValues.sender === sender_yCRVAddress &&
        withdraw.length !== 5 &&
        item.returnValues.sender !== addressNull
      ) {
        let convertValue = web3.utils.fromWei(item.returnValues.value);
        item.returnValues.value = convertValue;
        withdraw.push(item.returnValues);
      }
    });
    res.json({ deposit: deposit, withdraw: withdraw });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: error.message });
  }
};

const getTokenData = async (req, res) => {
  try {
    const sql = `SELECT * FROM Trendz.TrendzToken;`;
    DB.query(sql, (err, result) => {
      if (err) throw err;
      return res.status(200).json({ res: result });
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const insertToken_price = async (req, res) => {
  try {
    let balance = await contractERC20.methods
      .balanceOf(contract_Liquidity_Address)
      .call();
    console.log(balance + " price");
    let convertValue = web3.utils.fromWei(balance);

    const sql = `INSERT INTO Trendz.TrendzToken (yCRVToken, TrendzDate) VALUES ('${convertValue}','${currentDateTime}')`;
    DB.query(sql, (err) => {
      if (err) throw err;
      console.log("The registration price token was successful");
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getBalance,
  getEvent,
  insertToken_price,
  getTokenData,
};
