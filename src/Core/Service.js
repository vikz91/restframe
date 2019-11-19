module.exports = class {
  constructor(mongooseModel) {
    this.Model = mongooseModel;
  }

  async ReadAll() {
    return this.Model.find({});
  }

  async Create(data) {
    data = new this.Model(data);
    return data.save();
  }

  async Read(id) {
    return this.Model.findOne({ _id: id });
  }

  async Update(id, data) {
    return this.Model.updateOne({ _id: id }, { $set: data });
  }

  async Delete(id) {
    let doc = await this.Model.findOne({ _id: id });
    if (!doc) {
      return `${id} not present`;
    }
    doc.remove();
    return `${id} removed!`;
  }

  async DeleteAll() {
    return this.Model.remove({});
  }
};
