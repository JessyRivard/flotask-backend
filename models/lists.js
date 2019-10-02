"use strict";
var mongoose = require("mongoose");

var Schema = mongoose.Schema;
var listsSchema = new Schema({
  title: { type: String, required: true },
  tasks: [{ type: mongoose.Schema.Types.ObjectId, ref: "task" }],
  meta: {
    created: Date,
    deleted: { type: Boolean, default: false }
  }
});

var Lists = mongoose.model("list", listsSchema);

module.exports = Lists;
