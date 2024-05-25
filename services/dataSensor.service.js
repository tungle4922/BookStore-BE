const db = require("../db");

module.exports.getAllDataSensor = async (obj) => {
  let sqlParams = [];
  let sqlCondition = "";
  // Tìm theo temperature
  if (
    obj.temperature !== undefined &&
    obj.temperature !== null &&
    obj.temperature !== ""
  ) {
    sqlCondition += " AND temperature = ?";
    sqlParams.push(obj.temperature);
  }
  // Tìm theo humidity
  if (
    obj.humidity !== undefined &&
    obj.humidity !== null &&
    obj.humidity !== ""
  ) {
    sqlCondition += " AND humidity = ?";
    sqlParams.push(obj.humidity);
  }
  // Tìm theo humidity
  if (
    obj.humidity !== undefined &&
    obj.humidity !== null &&
    obj.humidity !== ""
  ) {
    sqlCondition += " AND humidity = ?";
    sqlParams.push(obj.humidity);
  }
  // Tìm theo light
  if (obj.light !== undefined && obj.light !== null && obj.light !== "") {
    sqlCondition += " AND light = ?";
    sqlParams.push(obj.light);
  }
  // Tìm theo wind
  if (obj.wind !== undefined && obj.wind !== null && obj.wind !== "") {
    sqlCondition += " AND wind = ?";
    sqlParams.push(obj.wind);
  }
  // Tìm theo ngt1
  if (obj.createdDate !== undefined && obj.createdDate !== null && obj.createdDate !== "") {
    sqlCondition += " AND createdDate = ?";
    sqlParams.push(Date(obj.createdDate));
  }
  // Tìm theo ngày tạo
  if (obj.createdDate !== undefined && obj.createdDate !== null && obj.createdDate !== "") {
    const date = new Date(obj.createdDate);
    // const startDate = new Date(obj.createdDate);
    // startDate.setUTCHours(0, 0, 0, 0);
    // const endDate = new Date(obj.createdDate);
    // endDate.setUTCHours(23, 59, 59, 59);
    sqlCondition += " AND createdDate = ?";
    sqlParams.push(date.toISOString());
    // sqlParams.push(endDate.toISOString());
  }
  // Tìm theo id
  if (obj.id !== undefined && obj.id !== null && obj.id !== "") {
    sqlCondition += " AND id = ?";
    sqlParams.push(obj.id);
  }
  //search
  // if (obj.type !== undefined && obj.type !== null && obj.type !== "all") {
  //   sqlCondition += ` AND ${obj.type} = ?`;
  //   sqlParams.push(obj.search);
  // }
  // Tìm kiếm trong tất cả các cột
  if (obj.search !== undefined && obj.search !== null && obj.search !== "") {
    const searchTerms = obj.search.split(" ");
    const searchConditions = searchTerms.map((term) => {
      return `temperature LIKE ? OR humidity LIKE ? OR light LIKE ? OR wind LIKE ? OR createdDate LIKE ? OR id LIKE ?`;
    });
    sqlCondition += " AND (" + searchConditions.join(" OR ") + ")";
    searchTerms.forEach((term) => {
      sqlParams.push("%" + term + "%");
      sqlParams.push("%" + term + "%");
      sqlParams.push("%" + term + "%");
      sqlParams.push("%" + term + "%");
      sqlParams.push("%" + term + "%");
      sqlParams.push("%" + term + "%");
    });
  }
  // Lấy tổng số lượng bản ghi
  const totalCountSql = `SELECT COUNT(*) as totalCount FROM iot_exam.datasensors WHERE 1=1 ${sqlCondition}`;
  const [totalCountResult] = await db.query(totalCountSql, sqlParams);
  const totalCount = totalCountResult[0].totalCount;
  // Lấy dữ liệu
  const sql = `SELECT * FROM iot_exam.datasensors WHERE 1=1 ${sqlCondition} ORDER BY 1 DESC LIMIT ? OFFSET ?`;
  const [data] = await db.query(sql, [
    ...sqlParams,
    obj.pageSize,
    (obj.page - 1) * obj.pageSize,
  ]);
  console.log(sqlParams);

  return { data, totalCount };
};

module.exports.sortDataSensorHighToLow = async (obj) => {
  // Lấy tổng số lượng bản ghi
  const totalCountSql = `SELECT COUNT(*) as totalCount FROM iot_exam.datasensors WHERE 1=1`;
  const [totalCountResult] = await db.query(totalCountSql);
  const totalCount = totalCountResult[0].totalCount;
  // Lấy dữ liệu
  const offset = (obj.page - 1) * obj.pageSize;
  const sql = `SELECT * FROM iot_exam.datasensors ORDER BY ${obj.fieldName} DESC LIMIT ? OFFSET ?`;
  const [data] = await db.query(sql, [obj.pageSize, offset]);
  return { data, totalCount };
};

module.exports.sortDataSensorLowToHigh = async (obj) => {
  // Lấy tổng số lượng bản ghi
  const totalCountSql = `SELECT COUNT(*) as totalCount FROM iot_exam.datasensors WHERE 1=1`;
  const [totalCountResult] = await db.query(totalCountSql);
  const totalCount = totalCountResult[0].totalCount;
  // Lấy dữ liệu
  const offset = (obj.page - 1) * obj.pageSize;
  const sql = `SELECT * FROM iot_exam.datasensors ORDER BY ${obj.fieldName} ASC LIMIT ? OFFSET ?`;
  const [data] = await db.query(sql, [obj.pageSize, offset]);
  return { data, totalCount };
};

module.exports.getAllDataSensorByCurrentDate = async (obj) => {
  const offset = (obj.page - 1) * obj.pageSize;
  const sql =
    "SELECT * FROM iot_exam.datasensors WHERE DATE(createdDate) = CURDATE() LIMIT ? OFFSET ?";
  const [records] = await db.query(sql, [obj.pageSize, offset]);
  return records;
};

module.exports.getDataSensorById = async (id) => {
  const [[record]] = await db.query(
    "SELECT * FROM iot_exam.datasensors WHERE id = ?",
    [id]
  );
  return record;
};

module.exports.deleteDataSensor = async (id) => {
  const [{ affectedRows }] = await db.query(
    "DELETE FROM iot_exam.datasensors WHERE id = ?",
    [id]
  );
  return affectedRows;
};

module.exports.AddADataSensor = async (obj) => {
  const [{ affectedRows }] = await db.query(
    "INSERT INTO iot_exam.datasensors (temperature, humidity, light, wind, createdDate) VALUES (?, ?, ?, ?, NOW())",
    [obj.temp, obj.hum, obj.light, obj.wind]
  );
  return affectedRows;
};

module.exports.UpdateDataSensor = async (obj) => {
  const [{ affectedRows }] = await db.query(
    "UPDATE iot_exam.datasensors SET temperature = ?, humidity = ?, light = ?, lastModifiedDate = NOW() WHERE id = ?",
    [obj.temp, obj.hum, obj.light, obj.id]
  );
  return affectedRows;
};
