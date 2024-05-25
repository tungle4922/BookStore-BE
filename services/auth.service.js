const db = require("../db");

module.exports.AddAUser = async (obj) => {
  const [{ affectedRows }] = await db.query(
    "INSERT INTO user (username, password, name, email, role, created_at) VALUES (?, ?, ?, ?, ?, NOW())",
    [obj.username, obj.password, obj.name, obj.email, obj.role]
  );
  return affectedRows;
};

module.exports.Login = async (obj) => {
  const [rows] = await db.query(
    "SELECT * FROM user WHERE username = ? AND password = ? LIMIT 1",
    [obj.username, obj.password]
  );
  return rows.length > 0;
};
