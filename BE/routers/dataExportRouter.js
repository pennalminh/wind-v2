"use strict";

const { Router } = require("express");
const {
  dataExportPowerForeCastByPeriodInDay,
} = require("../controllers/dataExportController");

const router = Router();

router.get(
  "/data-export-power-forecast-by-96-period-in-day",
  async function (req, res) {
    try {
      const response = await dataExportPowerForeCastByPeriodInDay(req, res);
      res.json(response);
    } catch (error) {
      console.log(error);
    }
  }
);

module.exports = router;
