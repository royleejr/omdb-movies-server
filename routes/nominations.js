const express = require("express");
const router = express.Router();
const fs = require("fs");

const nominationsData = require("../data/nominationsData.json");
const nominationsSet = new Set();

router.get("/", (req, res) => {
  res.send(nominationsData).status(200);
});

router.post("/", (req, res) => {
  //add more validation when data set is more set in stone
  if (!req.body) {
    res.send("Please add item to post");
  } else {
    if (nominationsData.length === 5) {
      res.status(400).send("There are already 5 entries");
    } else {
      if (
        !nominationsData.find((nomination) => {
          nomination.imdbID === req.body.imdbID;
        })
      ) {
        const newNominationsData = [...nominationsData, req.body];
        fs.writeFileSync(
          "./data/nominationsData.json",
          JSON.stringify(newNominationsData, null, 2)
        );

        res.send(newNominationsData).status(200);
      } else {
        res.send("Already have entry");
      }
    }
  }
});

router.put("/", (req, res) => {
  if (!req.body) {
    res.send("Please add movie ID to delete");
  } else {
    const newNominationsData = nominationsData.filter((item) => {
      return item.imdbID !== req.body.imdbID;
    });
    if (newNominationsData.length === nominationsData.length) {
      res.send("ID did not match any from the nominations list");
    } else {
      fs.writeFileSync(
        "./data/nominationsData.json",
        JSON.stringify(newNominationsData, null, 2)
      );
      res.send(newNominationsData).status(200);
    }
  }
});

module.exports = router;
