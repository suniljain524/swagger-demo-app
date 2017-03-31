function execQuery(connPool, query) {
  return new Promise((resolve, reject) =>{
    connPool.getConnection((err, connection) => {
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
