const mongoose = require('mongoose')
mongoose.Promise = global.Promise

let isConnected

module.exports = () => {
  if (isConnected) {
    console.info('=> using existing database connection')
    return Promise.resolve()
  }

  console.info('=> using new database connection')

  return mongoose.connect(process.env.MONGO_URI, {
    useCreateIndex: true,
    keepAlive: 1,
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  }).then(db => {
    isConnected = db.connections[0].readyState
  })
}
