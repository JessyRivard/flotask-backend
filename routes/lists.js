var express = require("express");
var router = express.Router();

var Lists = require("../models/lists");

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
    res.send(null, error);
    next(error);
  }
});

router.post("/archive", function(req, res, next) {
try {
  Lists.findById(req.body.id).then(list => {
    list.meta.deleted = true;
  })
  .populate("tasks")
  .then(listWithItems => {
    console.log(listWithItems);
  })
  res.send(null, "Function not ready yet.")
} catch (error) {
  res.send(error);
  next(error);
}
})

module.exports = router;
