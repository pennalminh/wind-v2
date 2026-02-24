"use strict";

const express = require("express");
const router = express.Router();

const { getMonthlyReport } = require("../controllers/monthlyReportController");

router.route("/monthly-report").get(getMonthlyReport);

module.exports = router;
