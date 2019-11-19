const express = require("express");
const router = express.Router();
const debug = require("debug")("App:Framework:Api");
const autoBind = require("auto-bind");

module.exports = class {
  constructor(service, endpoint) {
    this.Service = service;
    this.endpoint = endpoint;

    autoBind(this);
  }

  async ReadAll(req, res, next) {
    const result = await this.Service.ReadAll().catch(next);
    return res.status(200).json({ data: result });
  }

  async Create(req, res) {
    const result = await this.Service.Create(req.body).catch(next);
    return res.status(201).json({ data: result });
  }

  async Read(req, res) {
    const result = await this.Service.Read(req.params.id).catch(next);
    return res.status(200).json({ data: result });
  }

  async Update(req, res) {
    const result = await this.Service.Update(req.params.id, req.body).catch(
      next
    );
    return res.status(200).json({ data: result });
  }

  async Delete(req, res) {
    const result = await this.Service.Delete(req.params.id).catch(next);
    return res.status(200).json({ data: result });
  }

  async DeleteAll(req, res) {
    const result = await this.Service.DeleteAll().catch(next);
    return res.status(200).json({ data: result });
  }

  async Search(req, res) {
    const result = await this.Service.ReadAll().catch(next);
    return res.status(200).json({ data: result });
  }

  async SearchAdvanced(req, res) {
    const result = await this.Service.ReadAll().catch(next);
    return res.status(200).json({ data: result });
  }

  Setup() {
    router
      .route(`${this.endpoint}`)
      .get(this.ReadAll)
      .post(this.Create)
      .delete(this.DeleteAll);

    router
      .route(`${this.endpoint}/:id`)
      .get(this.Read)
      .put(this.Update)
      .delete(this.Delete);

    return router;
  }
};
