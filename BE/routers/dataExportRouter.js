"use strict";

const { Router } = require("express");
const {
  dataExportPowerForeCastByPeriod,
} = require("../controllers/dataExportController");

const router = Router();

router.post(
  "/data-export-power-forecast-by-96-period",
  async function (req, res) {
    try {
      const response = await dataExportPowerForeCastByPeriod(req, res);
      res.json(response);
    } catch (error) {
      console.log(error);
    }
  }
);

module.exports = router;
