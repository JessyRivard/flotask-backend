var express = require("express");
var router = express.Router();
var Tasks = require("../models/tasks");

router.get("/", function(req, res, next) {});

router.post("/create", function(req, res, next) {
  try {
    var msg = [];
    if (req.body.task) {
      var newTask = new Tasks({
        task: req.body.task,
        details: req.body.details,
        due: req.body.due,
        priority: req.body.priority,
        meta: {
          created: new Date(),
          completed: false,
          deleted: false
        }
      });
      newTask.save();
      msg.push("Saved Successfully.");
    } else if (!req.body.task) {
      msg.push("Task name is missing.");
    }
    res.send(msg);
  } catch (error) {
    return next(err);
  }
});

module.exports = router;
