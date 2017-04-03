function execQuery(mongodbConn) {
  return new Promise((resolve, reject) =>{
    mongodbConn.collection('startup_log').find({}).toArray(function(err, rows) {
      if (err) reject(err);
      resolve(rows)
    })
  })
}

module.exports = {
  execQuery
}
