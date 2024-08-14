"use strict";

const { Router } = require("express");
const { getDataWindy } = require("../controllers/windyController");

const router = Router();

router.post("/get-data-next-3-day", async function (req, res) {
  try {
    const response = await getDataWindy(req, res);
    res.json(response);
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
