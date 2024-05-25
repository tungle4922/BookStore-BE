const mysql = require("mysql2/promise");

const mysqlPool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "Tung4922@",
  database: "book_web",
});

mysqlPool
  .query("SELECT 1")
  .then(() => console.log("success"))
  .catch((err) => console.log("err"));

module.exports = mysqlPool;
