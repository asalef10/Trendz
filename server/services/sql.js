const DB = require("../connectDB/DB");

const query_Deposit = `SELECT address, SUM(value) as 'value'
      FROM Trendz.YCRV_Pool_Transactions
      WHERE type = 'deposit'
      GROUP BY address
      HAVING COUNT(address) > 1
      ORDER BY value DESC
      LIMIT  5
      `;

const query_Withdraw = `SELECT address, SUM(value) as 'value'
      FROM Trendz.YCRV_Pool_Transactions
      WHERE type = 'withdraw'
      GROUP BY address
      HAVING COUNT(address) > 1
      ORDER BY value DESC
      LIMIT 5
      `;

const query_insertDataFromEvent_TransactionsTB = (item, type) => {
  return `INSERT INTO Trendz.YCRV_Pool_Transactions ( address,value,type) VALUES ('${item.receiver}','${item.value}','${type}')`;
};
const query_insertDataFromEvent_LiquidityTB = (
  blockExpenses,
  blockRevenues,
  currentDateTime
) => {
  return `INSERT INTO Trendz.YCRV_Token_Liquidity (amountOut_tokenLiquidity, amountIn_tokeLiquidity,date) VALUES ('${blockExpenses}','${blockRevenues}','${currentDateTime}')`;
};
const query_insertPriceTokenIntoDB = (price, currentDateTime) => {
  return `INSERT INTO Trendz.YCRV_Token_Info (yCRVToken, dateStore) VALUES ('${price}','${currentDateTime}')`;
};

const query_Select_insert =(sql) =>{
      return new Promise((resolve, reject) => {
        DB.query(sql, (err, result) => {
          if (err) {
            console.error(err);
            reject(err);
          }
          console.log("Method success");
          resolve(result);
        });
      });
    }

const query_Query_handle = async (range, type) => {
  try {
    let sql;
    if (type === "Token") {
      sql = `SELECT yCRVToken, dateStore,dateStore FROM Trendz.YCRV_Token_Info WHERE dateStore >= DATE_SUB(NOW(), INTERVAL ${range});`;
      const result = await query_Select_insert(sql);
      const dataObject = result.reduce((acc, curr) => {
        return { ...acc, [curr.dateStore]: curr.yCRVToken };
      }, {});
      return dataObject;
    } else {
      sql = `SELECT amountOut_tokenLiquidity,amountIn_tokeLiquidity,date FROM Trendz.YCRV_Token_Liquidity WHERE date >= DATE_SUB(NOW(), INTERVAL ${range});`;
      const result = await query_Select_insert(sql);
      const data = result.reduce(
        (acc, curr) => {
          acc[0].push(curr.amountIn_tokeLiquidity);
          acc[1].push(curr.amountOut_tokenLiquidity);
          acc[2].push(curr.date);
          return acc;
        },
        [[], [], []]
      );
      return data;
    }
  } catch (err) {
    console.log(err);
  }
};

module.exports = {
  query_Deposit,
  query_Withdraw,
  query_insertDataFromEvent_TransactionsTB,
  query_insertDataFromEvent_LiquidityTB,
  query_insertPriceTokenIntoDB,
  query_Query_handle,
  query_Select_insert
};
