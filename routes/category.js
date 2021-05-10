const express = require("express");
const router = express.Router();

const topRatedData = require("../data/topRatedData.json");
const actionData = require("../data/actionData.json");
const comedyData = require("../data/comedyData.json");
const animatedData = require("../data/animatedData.json");

router.get("/:category", (req, res) => {
  if (req.params.category == "toprated") {
    res.send(topRatedData).status(200);
  } else if (req.params.category == "action") {
    res.send(actionData).status(200);
  } else if (req.params.category == "comedy") {
    res.send(comedyData).status(200);
  } else if (req.params.category == "animated") {
    res.send(animatedData).status(200);
  } else {
    res.send("error").status(500);
  }
});

module.exports = router;
