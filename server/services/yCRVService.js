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
  async insertDataFromEvent(_liquidityEvent) {
    try {
      this.liquidityEvent = _liquidityEvent;
      const currentDateTime = moment().tz(timezone).format("YYYY-MM-DD HH:mm");
      const sender_yCRVAddress = "0x0000000000000000000000000000000000000000";
      let amountIn = 0;
      let amountOut = 0;
      let data = await this.liquidityEvent?.eventData(this.liquidityEvent);
      if (data[0]) {
        data?.map((item) => {
          if (item.sender === sender_yCRVAddress) {
            let value = +Number(item.value).toFixed(3);
            amountOut += value;
            console.log(item);
            if (item.sender === sender_yCRVAddress) {
              const sql = `INSERT INTO Trendz.YCRV_Pool_Ledger (deposit, withdraw,value) VALUES ('${""}','${
                item.receiver
              }','${item.value}')`;
              this.DB_Insert(sql);
            } else {
              const sql = `INSERT INTO Trendz.YCRV_Pool_Ledger (deposit, withdraw,value) VALUES ('${
                item.receiver
              }','${""}','${item.value}')`;
              this.DB_Insert(sql);
            }
          } else if (item.sender !== sender_yCRVAddress) {
            let value = +Number(item.value).toFixed(3);
            amountIn += value;
          }
        }, []);
        amountOut = +amountOut.toFixed(3);
        amountIn = +amountIn.toFixed(3);
        const sql = `INSERT INTO Trendz.YCRV_Token_Liquidity (amountOut_tokenLiquidity, amountIn_tokeLiquidity,date) VALUES ('${amountOut}','${amountIn}','${currentDateTime}')`;
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

  async getDataFromDB(req, res) {
    const sql = `SELECT * FROM Trendz.TrendzToken;`;
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
}

module.exports = { Y_CRVToken };
