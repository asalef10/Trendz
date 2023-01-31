
const DB = require("../connectDB/DB");
let moment = require("moment");
const {
  query_Deposit,
  query_Withdraw,
  query_insertDataFromEvent_TransactionsTB,
  query_insertDataFromEvent_LiquidityTB,
  query_insertPriceTokenIntoDB,
  query_Leger_handle,
  query_Select_insert
} = require("./sql");
class Y_CRVToken {
  liquidityEvent;
  constructor() {
    this.db = DB;
  }
  async get_Ledger(req, res) {
    try {
      const type = req.body.type;
      const timeRange = req.body.timeRange;
      let response = await  query_Leger_handle(timeRange, type);
      const data = response;
      res.status(200).json({ response: data });
    } catch (err) {
      console.log(err);
      res.status(500).json({ error: "Failed to fetch data" });
    }
  }
  async insertDataFromEvent(_liquidityEvent) {
    try {
      this.liquidityEvent = _liquidityEvent;
      let currentDateTime = moment().format("YYYY-MM-DD HH:mm:ss");
      const sender_yCRVAddress = "0x0000000000000000000000000000000000000000";
      let blockExpenses = 0;
      let blockRevenues = 0;
      let data = await this.liquidityEvent?.getPastEventsInBlockRange(
        this.liquidityEvent
      );
      if (data[0]) {
        data.map(async (item) => {
          if (item.sender === sender_yCRVAddress) {
            let value = +Number(item.value).toFixed(3);
            blockExpenses += value;
            const sql =  query_insertDataFromEvent_TransactionsTB(
              item,
              "withdraw"
            );
            await  query_Select_insert(sql);
          } else if (item.sender !== sender_yCRVAddress) {
            let value = +Number(item.value).toFixed(3);
            blockRevenues += value;
            const sql =  query_insertDataFromEvent_TransactionsTB(item, "deposit");
            await  query_Select_insert(sql);
          }
        });
        const sql =  query_insertDataFromEvent_LiquidityTB(
          blockExpenses,
          blockRevenues,
          currentDateTime
        );
        await query_Select_insert(sql);
      }
    } catch (err) {
      console.log(err);
    }
  }
  async insertPriceTokenIntoDB() {
    try {
      let currentDateTime = moment().format("YYYY-MM-DD HH:mm:ss");
      const response = await fetch(
        "https://api.coingecko.com/api/v3/simple/price?ids=curve-dao-token&vs_currencies=usd"
      );
      const data = await response.json();
      const price = data["curve-dao-token"].usd;
      const sql =  query_insertPriceTokenIntoDB(price, currentDateTime);
      query_Select_insert(sql);
    } catch (err) {
      console.error(err);
      console.log("Error fetching and inserting the price");
    }
  }
  async totalAddressTx(req, res) {
    try {
      const deposit = await  query_Select_insert( query_Deposit);
      const withdraw = await  query_Select_insert( query_Withdraw);
      return res.status(200).json([
        { type: "deposit", deposit: deposit },
        { type: "withdraw", withdraw: withdraw },
      ]);
    } catch (err) {
      console.log(err);
    }
  }
}
module.exports = { Y_CRVToken };
