const db = require("../db");

module.exports.getAllBooks = async (obj) => {
  let sqlParams = [];
  let sqlCondition = "";
  // Tìm theo type1
  if (obj.type1 !== undefined && obj.type1 !== null && obj.type1 !== "") {
    sqlCondition += " AND type1 = ?";
    sqlParams.push(obj.type1);
  }
  // Lấy tổng số lượng bản ghi
  const totalCountSql = `SELECT COUNT(*) as totalCount FROM product WHERE 1=1 ${sqlCondition}`;
  const [totalCountResult] = await db.query(totalCountSql, sqlParams);
  const totalCount = totalCountResult[0].totalCount;
  // Lấy dữ liệu
  const sql = `SELECT * FROM product WHERE 1=1 ${sqlCondition} ORDER BY 1 DESC LIMIT ? OFFSET ?`;
  const [data] = await db.query(sql, [
    ...sqlParams,
    obj.pageSize,
    (obj.page - 1) * obj.pageSize,
  ]);
  console.log(sqlParams);

  return { data, totalCount };
};

module.exports.getBookById = async (id) => {
  const [[record]] = await db.query("SELECT * FROM product WHERE product_id = ?", [id]);
  return record;
};
