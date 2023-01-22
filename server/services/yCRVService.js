const DB = require("../connectDB/DB");
const timezone = "Asia/Jerusalem";
const moment = require("moment-timezone");
const currentDateTime = moment().tz(timezone).format("YYYY-MM-DD HH:mm");

class Y_CRVToken {
  constructor() {
    this.db = DB;
  }
  async insertPrice() {
    try {
      const response = await fetch(
        "https://api.coingecko.com/api/v3/simple/price?ids=curve-dao-token&vs_currencies=usd"
      );
      const data = await response.json();
      const price = data["curve-dao-token"].usd;
      const sql = `INSERT INTO Trendz.TrendzToken (yCRVToken, TrendzDate) VALUES ('${price}','${currentDateTime}')`;
      DB.query(sql, (err) => {
        if (err) throw err;
        console.log("Price inserted into the database successfully.");
      });
    } catch (err) {
      console.error(err);
      console.log("Error fetching and inserting the price");
    }
  }

  async dataHandle(req, res) {
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
