const DB = require("../connectDB/DB");
const timezone = "Asia/Jerusalem";
const moment = require("moment-timezone");
class Y_CRVToken {
  liquidityEvent;
  constructor() {
    this.db = DB;
  }
  async DB_Insert(sql) {
    try {
      DB.query(sql, (err) => {
        if (err) throw err;
        console.log(" inserted into the database successfully.");
      });
    } catch (err) {
      console.log(err);
    }
  }
  async DB_Select(req, res, sql) {
    return new Promise((resolve, reject) => {
      DB.query(sql, (err, result) => {
        if (err) {
          console.error(err);
          reject(
            res.status(500).json({ error: "Error querying the database" })
          );
        }
        resolve(res.status(200).json({ res: result }));
      });
    });
  }
  async get_poolLedger(req, res, timeRange) {
    try {

      let sql;
      
      if (timeRange === "24 hours") {
        sql = `SELECT amountOut_tokenLiquidity,amountIn_tokeLiquidity,date FROM Trendz.YCRV_Token_Liquidity WHERE date >= DATE_SUB(NOW(), INTERVAL 3 DAY);`
      } else if (timeRange === "3 days") {
        sql = `SELECT amountOut_tokenLiquidity,amountIn_tokeLiquidity,date FROM Trendz.YCRV_Token_Liquidity WHERE date >= DATE_SUB(NOW(), INTERVAL 3 DAY);`
      }
      this.DB_Select(req, res, sql);
    } catch (err) {
      console.log(err);
    }
  }

  async get_YCRV_InfoFromDB(req, res) {
    const sql = `SELECT * FROM Trendz.YCRV_Token_Info;`;
    this.DB_Select(req, res, sql);
  }
  async insertDataFromEvent(_liquidityEvent) {
    try {
      this.liquidityEvent = _liquidityEvent;
      const currentDateTime = moment().tz(timezone).format("YYYY-MM-DD HH:mm");
      const sender_yCRVAddress = "0x0000000000000000000000000000000000000000";
      let blockExpenses = 0;
      let blockRevenues = 0;
      let data = await this.liquidityEvent?.getPastEventsInBlockRange(
        this.liquidityEvent
      );
      if (data[0]) {
        data.map((item) => {
          if (item.sender === sender_yCRVAddress) {
            let value = +Number(item.value).toFixed(3);
            blockExpenses += value;
            const sql = `INSERT INTO Trendz.YCRV_Pool_Ledger ( withdraw,value) VALUES ('${item.receiver}','${item.value}')`;
            this.DB_Insert(sql);
          } else if (item.sender !== sender_yCRVAddress) {
            let value = +Number(item.value).toFixed(3);
            blockRevenues += value;
            const sql = `INSERT INTO Trendz.YCRV_Pool_Ledger (deposit,value) VALUES ('${item.receiver}','${item.value}')`;
            this.DB_Insert(sql);
          }
        });
        const sql = `INSERT INTO Trendz.YCRV_Token_Liquidity (amountOut_tokenLiquidity, amountIn_tokeLiquidity,date) VALUES ('${blockExpenses}','${blockRevenues}','${currentDateTime}')`;
        this.DB_Insert(sql);
      }
    } catch (err) {
      console.log(err);
    }
  }
  async insertPriceTokenIntoDB() {
    try {
      const currentDateTime = moment().tz(timezone).format("YYYY-MM-DD HH:mm");
      const response = await fetch(
        "https://api.coingecko.com/api/v3/simple/price?ids=curve-dao-token&vs_currencies=usd"
      );
      const data = await response.json();
      const price = data["curve-dao-token"].usd;
      const sql = `INSERT INTO Trendz.YCRV_Token_Info (yCRVToken, dateStore) VALUES ('${price}','${currentDateTime}')`;
      DB.query(sql, (err) => {
        if (err) throw err;
        console.log("Price inserted into the database successfully.");
      });
    } catch (err) {
      console.error(err);
      console.log("Error fetching and inserting the price");
    }
  }
}
module.exports = { Y_CRVToken };

// example

// Result {
//   '0': '0x0000000000000000000000000000000000000000',
//   '1': '0x796836732f8086F95e7DEF593B189f315F899889',
//   '2': '81348955953372124414',
//   sender: '0x0000000000000000000000000000000000000000',
//   receiver: '0x796836732f8086F95e7DEF593B189f315F899889',
//   value: '81.348955953372124414'
// }
