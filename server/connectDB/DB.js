const mysql = require("mysql");
let HOST = process.env.DB_HOST
let USER = process.env.DB_USER
let PASSWORD = process.env.DB_PASSWORD
let DATABASE = process.env.DB_TB

const db = mysql.createConnection({
  host: HOST,
  user: USER,
  password: PASSWORD,
  database: DATABASE,
});

db.connect(function (err) { 
  if (err) {
     
    return console.error("error: " + err.message);
  }

  console.log("Connected to the MySQL server.");
}); 

module.exports = db;





