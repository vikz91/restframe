const debug = require("debug")("App:www");
const http = require("http");
const path = require("path");
const autoBind = require("auto-bind");

module.exports = class {
  constructor(port) {
    autoBind(this);
    this.app = null;
    this.server = null;
    this.port = this.NormalizePort(port || process.env.PORT || "3000");
  }

  async Listen(appPromise) {
    this.app = await appPromise;
    this.app.set("port", this.port);

    this.server = http.createServer(this.app);
    this.server.listen(this.port);
    this.server.on("error", this.OnError);
    this.server.on("listening", this.OnListening);
  }

  NormalizePort(val) {
    var port = parseInt(val, 10);

    if (isNaN(port)) {
      // named pipe
      return val;
    }

    if (port >= 0) {
      // port number
      return port;
    }

    return false;
  }

  OnError(error) {
    if (error.syscall !== "listen") {
      throw error;
    }

    var bind = typeof port === "string" ? "Pipe " + port : "Port " + port;

    // handle specific listen errors with friendly messages
    switch (error.code) {
      case "EACCES":
        console.error(bind + " requires elevated privileges");
        process.exit(1);
        break;
      case "EADDRINUSE":
        console.error(bind + " is already in use");
        process.exit(1);
        break;
      default:
        throw error;
    }
  }

  OnListening() {
    var addr = this.server.address();
    var bind = typeof addr === "string" ? "pipe " + addr : "port " + addr.port;
    debug("Listening on " + bind);
  }
};
