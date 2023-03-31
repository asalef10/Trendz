const Web3 = require("web3");
const provider = `https://mainnet.infura.io/v3/${process.env.KEY_INFURA}`;
const web3 = new Web3(provider);
const { LiquidityData } = require("../web3Service");
const erc20ABI = require("../../artifacts/erc20ABI.json");
const yCRV_Token = "0xFCc5c47bE19d06BF83eB04298b026F81069ff65b";
const yearnABI = require("../../artifacts/yearn/yearnABI.json");
const contract_Liquidity_Address = "0x27B5739e22ad9033bcBf192059122d163b60349D";

const ycrv_contract = new web3.eth.Contract(
  yearnABI,
  contract_Liquidity_Address
);
const contractERC20 = new web3.eth.Contract(erc20ABI, yCRV_Token);

module.exports = new LiquidityData( 
  ycrv_contract,
  contractERC20,
  contract_Liquidity_Address
);
