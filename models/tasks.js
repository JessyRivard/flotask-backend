"use strict";
var mongoose = require("mongoose");

var Schema = mongoose.Schema;
var taskSchema = new Schema({
  task: { type: String, required: true },
  details: String,
  due: Date,
  priority: Number,
  meta: {
    created: Date,
    lastEdited: Date,
    lastViewed: Date,
    completed: Boolean,
    deleted: Boolean
  }
});

var Tasks = mongoose.model("task", taskSchema);

module.exports = Tasks;
