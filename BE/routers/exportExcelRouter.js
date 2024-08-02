"use strict";
const {
  exportExcel96Period,
  exportExcel96PeriodInNextDay,
  exportExcelInNext2Day,
} = require("../controllers/exportExcelController");
const { Router } = require("express");

const router = Router();

router.post("/export-csv-in-day", async function (req, res) {
  try {
    exportExcel96Period(req, res);
  } catch (error) {
    console.log(error);
  }
  res.status(200).json("oke");
});

router.post("/export-csv-in-next-day", async function (req, res) {
  try {
    exportExcel96PeriodInNextDay(req, res);
  } catch (error) {
    console.log(error);
  }
  res.status(200).json("oke");
});

router.post("/export-csv-in-next-2-day", async function (req, res) {
  try {
    exportExcelInNext2Day(req, res);
  } catch (error) {
    console.log(error);
  }
  res.status(200).json("oke");
});

module.exports = router;
