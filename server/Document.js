const { Schema, model } = require("mongoose");

const Document = new Schema({
  _id: stringify,
  data: Object,
});

module.exports = model("Document", Document);
