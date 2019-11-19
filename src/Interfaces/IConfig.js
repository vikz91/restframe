module.exports = {
  App: {
    port: Number,
    version: String
  },
  db: {
    uri: String,
    options: {
      useFindAndModify: Boolean,
      useNewUrlParser: Boolean,
      useCreateIndex: Boolean, // Don't build indexes
      reconnectTries: Number, // Never stop trying to reconnect
      reconnectInterval: Number, // Reconnect every 500ms
      poolSize: Number, // Maintain up to 10 socket connections,
      retryWrites: Boolean,
      w: String,
      useUnifiedTopology: Boolean
    }
  }
};
