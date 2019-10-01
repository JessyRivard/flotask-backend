var express = require("express");
var router = express.Router();

var Lists = require("../models/lists");
var Tasks = require("../models/tasks");

router.get("/", function(req, res, next) {
  try {
    Lists.find({})
      .populate("tasks")
      .then(allLists => {
        res.send(allLists);
      });
  } catch (error) {
    return next(error);
  }
});

router.post("/create", function(req, res, next) {
  try {
    var msg = [];
    if (!req.body.title) {
      msg.push("Title is missing.");
    }
    if (req.body.title) {
      var newList = new Lists({
        title: req.body.title,
        meta: {
          created: new Date(),
          completed: false
        }
      });
      newList.save();
      msg.push("Created Successfully.");
    }
    res.send(msg);
  } catch (error) {
    return next(error);
  }
});

router.post("/archive", function(req, res, next) {
try {
  Lists.findById(req.body.id)
  .populate("tasks")
  .then(listWithItems => {
    listWithItems.meta.deleted = true;
    listWithItems.tasks.forEach(task => {
      Tasks.findById(task._id).then(singleTask => {
        singleTask.meta.deleted = true;
        singleTask.meta.lastEdited = new Date();
        singleTask.save();
      })
    listWithItems.save();
    });
  })
  res.send("List Archived Successfully.")
} catch (error) {
  return next(error);
}
})

module.exports = router;
