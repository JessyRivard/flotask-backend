"use strict";
var mongoose = require("mongoose");

var Schema = mongoose.Schema;
var taskSchema = new Schema({
  task: { type: String, required: true },
  details: String,
  due: Date,
  priority: { type: Number, min: 1, max: 5 },
  meta: {
    created: Date,
    lastEdited: Date,
    completed: { type: Boolean, default: false },
    deleted: Boolean
  }
});

var Tasks = mongoose.model("task", taskSchema);

module.exports = Tasks;
