const Web3 = require("web3");
const provider = `https://mainnet.infura.io/v3/${process.env.KEY_INFURA}`;
const web3 = new Web3(provider);
class LiquidityData {
  contractProtocol;
  contractERC20;
  contract_Liquidity_Address;
  new_fromBlock_Number;
  fromBlockNumber;
  constructor(contractProtocol, contractERC20, contract_Liquidity_Address) {
    this.contractProtocol = contractProtocol;
    this.contractERC20 = contractERC20;
    this.contract_Liquidity_Address = contract_Liquidity_Address;
    this.fromBlockNumber = 16476277;
  }
  async getPastEventsInBlockRange() {
    try {
      let latestBlock = await web3.eth.getBlockNumber();

      let eventData = [];
      const currentBlockNumber = await web3.eth.getBlockNumber();
      if (currentBlockNumber > this.fromBlockNumber) {
        const events = await this.contractProtocol.getPastEvents("Transfer", {
          fromBlock: this.fromBlockNumber,
          toBlock: latestBlock,
        });
        this.fromBlockNumber = latestBlock;
        events.map((item) => {
          let convertValue = web3.utils.fromWei(item.returnValues.value);
          item.returnValues.value = convertValue;
          eventData.push(item.returnValues);
        });
      }
      return eventData;
    } catch (err) {
      console.log(err);
    }
  }
  async balanceToken(req, res) {
    try {
      let balance = await this.contractERC20.methods
        .balanceOf(this.contract_Liquidity_Address)
        .call();
      let convertValue = web3.utils.fromWei(balance);
      return res.status(200).json(convertValue);
    } catch (err) {
      return res.status(500).json({ error: err.error });
    }
  }
}

module.exports = {
  LiquidityData,
};
