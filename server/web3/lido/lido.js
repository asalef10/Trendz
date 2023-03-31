const Web3 = require("web3");
const provider = `https://mainnet.infura.io/v3/${process.env.KEY_INFURA}`;

const lidoLiquidityABI = require("../../artifacts/lido/lidoABI.json");
const web3 = new Web3(provider);

async function call() {
  const lidoLiquidityAddress =
    "0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84"; 

  const lidoLiquidity = new web3.eth.Contract(
    lidoLiquidityABI,
    lidoLiquidityAddress 
  );
  let latestBlock = await web3.eth.getBlockNumber();
  console.log(latestBlock);
  const filter = {
    fromBlock: "0xFB6877", 
    toBlock: "0xFB99F4" ,
    address: lidoLiquidityAddress,
  };

  lidoLiquidity.getPastEvents("allEvents", filter, (error, events) => {
    if (error) {
      console.error(error);
      return;
    }
    
    events.forEach(event => {
      const topicHash = event.raw.topics[0];
      const decodedLog = web3.eth.abi.decodeLog(
        event.raw.abi,
        event.raw.data,
        [topicHash]
      );
      console.log(event.event, decodedLog);
    });
  });
}

module.exports = call;
