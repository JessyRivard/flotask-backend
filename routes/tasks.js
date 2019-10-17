var express = require("express");
var router = express.Router();

var Tasks = require("../models/tasks");
var Lists = require("../models/lists");

router.get("/", function(req, res, next) {
  try {
    Tasks.find({}).then(allTasks => {
      res.send(allTasks);
    });
  } catch (error) {
    return next(error);
  }
});

router.get("/find/:id", function(req, res, next) {
  try {
    Tasks.findById(req.params.id).then(selectedTask => {
      res.send(selectedTask);
    });
  } catch (error) {
    return next(error);
  }
});

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
          deleted: false,
          belongsTo: req.body.list
        }
      });
      newTask.save(function(error, savedTask) {
        Lists.findById(savedTask.meta.belongsTo).then(list => {
          list.tasks.push(savedTask._id);
          list.save();
        });
      });

      msg.push("Saved Successfully.");
    } else if (!req.body.task) {
      msg.push("Task name is missing.");
    }
    res.send(msg);
  } catch (error) {
    return next(error);
  }
});

router.post("/update", function(req, res, next) {
  try {
    Tasks.findById(req.body.id).then(task => {
      if (req.body.task && req.body.task !== task.task) {
        task.task = req.body.task;
      }
      if (req.body.details && req.body.details !== task.details) {
        task.details = req.body.details;
      }
      if (req.body.due && req.body.due !== task.due) {
        task.due = req.body.due;
      }
      if (req.body.priority && req.body.priority !== task.priority) {
        task.priority = req.body.priority;
      }
      if (req.body.completed && req.body.completed !== task.meta.completed) {
        task.meta.completed = req.body.completed;
      }
      task.meta.lastEdited = new Date();
      task.save();
      res.send("Updated Successfully");
    });
  } catch (error) {
    return next(err);
  }
});

router.post("/archive", function(req, res, next) {
  try {
    Tasks.findById(req.body.id).then(task => {
      task.meta.deleted = true;
      task.meta.lastEdited = new Date();
      task.save();
      res.send("Removed Successfully");
    });
  } catch (error) {
    return next(error);
  }
});

module.exports = router;
