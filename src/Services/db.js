const mongoose = require("mongoose");
exports.Connect = (connectionUri, options) => {
  return mongoose.connect(connectionUri, options);
};

exports.Disconnect = () => {
  return mongoose.connection.close();
};
