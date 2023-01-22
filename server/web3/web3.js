const Web3 = require("web3");
const provider = `https://mainnet.infura.io/v3/${process.env.KEY_INFURA}`;

const web3 = new Web3(provider);
const yearnABI = require("../artifacts/yearnABI.json");
const contract_Liquidity_Address = "0x27B5739e22ad9033bcBf192059122d163b60349D";
const yCRV_Token = "0xFCc5c47bE19d06BF83eB04298b026F81069ff65b";
const sender_yCRVAddress = "0x01D7f32B6E463c96c00575fA97B8224326C6A6B9";
const addressNull = "0x0000000000000000000000000000000000000000";
const contract = new web3.eth.Contract(yearnABI, contract_Liquidity_Address);
const erc20ABI = require("../artifacts/erc20ABI.json");

class Event_contract {
  constructor(req, res) {
    this.req = req;
    this.res = res;
  }
  async Event() {
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
      return this.res
        .status(200)
        .json({ deposit: deposit, withdraw: withdraw });
    } catch (err) {
      console.log(err);
      return this.res.status(500).json({ error: error.message });
    }
  }

  async balanceToken() {
    try {
      const contractERC20 = new web3.eth.Contract(erc20ABI, yCRV_Token);
      let balance = await contractERC20.methods
        .balanceOf(contract_Liquidity_Address)
        .call();
      let convertValue = web3.utils.fromWei(balance);
      return this.res.status(200).json(convertValue);
    } catch (err) {
      return this.res.status(500).json({ error: error.message });
    }
  }
}

module.exports = {
  Event_contract,
};
