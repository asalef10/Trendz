const Web3 = require("web3");
const provider = `https://mainnet.infura.io/v3/${process.env.KEY_INFURA}`;

const web3 = new Web3(provider);
const yearnABI = require("../artifacts/yearnABI.json");
const contract_Liquidity_Address = "0x27B5739e22ad9033bcBf192059122d163b60349D";
const yCRV_Token = "0xFCc5c47bE19d06BF83eB04298b026F81069ff65b";
// const zap/zip = "0x01D7f32B6E463c96c00575fA97B8224326C6A6B9";
const contract = new web3.eth.Contract(yearnABI, contract_Liquidity_Address);
const erc20ABI = require("../artifacts/erc20ABI.json");

class LiquidityData {
  new_fromBlock_Number;
  fromBlockNumber;
  constructor() {
    this.fromBlockNumber = 16476277;
  }
  counterBlock(blockNumber) {
    this.fromBlockNumber = blockNumber;
  }
  async eventData() {
    try {
      let eventData = [];
      const events = await contract.getPastEvents("Transfer", {
        fromBlock: this.fromBlockNumber,
        toBlock: "latest",
        filter: {
          blockNumber: {
            gte: this.fromBlockNumber,
          },
        },
      });
      this.new_fromBlock_Number = events.at(-1).blockNumber;
      if (this.fromBlockNumber !== this.new_fromBlock_Number) {
        this.counterBlock(this.new_fromBlock_Number);
        events.map((item) => {
          let convertValue = web3.utils.fromWei(item.returnValues.value);
          item.returnValues.value = convertValue;
          eventData.push(item.returnValues);
        });

        return eventData;
      } else {
        return [];
      }
    } catch (err) {
      console.log(err);
    }
  }
  async balanceToken(req, res) {
    try {
      const contractERC20 = new web3.eth.Contract(erc20ABI, yCRV_Token);
      let balance = await contractERC20.methods
        .balanceOf(contract_Liquidity_Address)
        .call();
      let convertValue = web3.utils.fromWei(balance);
      return res.status(200).json(convertValue);
    } catch (err) {
      return res.status(500).json({ error: error.message });
    }
  }
}

module.exports = {
  LiquidityData,
};
