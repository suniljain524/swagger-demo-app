function execQuery(mysqlConn, query) {
  return new Promise((resolve, reject) =>{
    mysqlConn.getConnection((err, connection) => {
      if (err) reject(err);
      connection.query(query, (err, rows) => {
        connection.release();
        if (err) reject(err);
        resolve(rows)
      });
    });
  })
}

module.exports = {
  execQuery
}
