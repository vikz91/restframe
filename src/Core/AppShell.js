const createError = require("http-errors");
const express = require("express");
const cookieParser = require("cookie-parser");
const fs = require("fs");
const path = require("path");
const logger = require("morgan");
const debug = require("debug")("App:Server");
const app = express();
const autoBind = require("auto-bind");

const DB = require("../Services/db");

module.exports = class {
  constructor(Config, loaderPath) {
    this.srcDirectory = {};
    if (loaderPath.service) {
      this.srcDirectory.service = loaderPath.service;
    }
    if (loaderPath.serviceList) {
      this.srcDirectory.serviceList = loaderPath.serviceList;
    }

    this.Config = Config;
    autoBind(this);
  }

  SetupViewEngine() {
    debug("[Setup] ViewEngine");
    app.set("views", path.join(__dirname, "src/views"));
    app.set("view engine", "ejs");
  }

  SetupLogger() {
    debug("[Setup] Logger");
    app.use(logger("dev"));
  }

  SetupExpress() {
    debug("[Setup] Express");
    app.use(express.json());
    app.use(express.urlencoded({ extended: false }));
    app.use(cookieParser());
    app.use(express.static(path.join(__dirname, "public")));
  }

  SetupServices() {
    debug("[Setup] Services");
    // Load Models
    fs.readdirSync(path.join(this.srcDirectory, "Services")).forEach(
      service => {
        require(path.join(this.srcDirectory, "Services", service, `model`));
      }
    );

    // Load API routes
    fs.readdirSync(path.join(this.srcDirectory, "Services")).forEach(
      service => {
        let api = require(path.join(
          this.srcDirectory,
          "Services",
          service,
          `api`
        ));
        app.use("/api", api.Setup());
      }
    );
  }

  SetupErrorHandler() {
    debug("[Setup] ErrorHandler");
    app.use(function(req, res, next) {
      res.status(404).json({
        status: "error",
        msg: "Sorry can't find that!",
        route: req.path
      });
    });

    app.use(function logErrors(err, req, res, next) {
      console.error(err.stack);
      next(err);
    });

    // catch 404 and forward to error handler
    app.use(function(req, res, next) {
      next(createError(404));
    });

    app.use(function(err, req, res, next) {
      // set locals, only providing error in development
      res.locals.message = err.message;
      res.locals.error = req.app.get("env") === "development" ? err : {};

      // render the error page
      res.status(err.status || 500);
      res.json({ status: "error", msg: err.message });
    });
  }

  async SetupConnections() {
    debug("[Connecting] Database ...");
    return DB.Connect(this.Config.db.uri, this.Config.db.options)
      .then(() => {
        debug("[Connecting] Database ... ok");
      })
      .catch(err => {
        debug("[Connecting] Database ... err : ", err);
      });
  }

  async Bootstrap() {
    debug("[Init] Restgoose2 App");
    const conResult = await this.SetupConnections().catch(err => {
      return err;
    });
    this.SetupViewEngine();
    this.SetupLogger();
    this.SetupExpress();
    this.SetupServices();
    this.SetupErrorHandler();
    return app;
  }
};
