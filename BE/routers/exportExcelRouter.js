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
    const response = await exportExcel96Period(req, res);
    res.status(200).json(response);
  } catch (error) {
    console.log(error);
    res.status(500).json("error");
  }
});

router.post("/export-csv-in-next-day", async function (req, res) {
  try {
    const response = await exportExcel96PeriodInNextDay(req, res);
    res.status(200).json(response);
  } catch (error) {
    console.log(error);
    res.status(500).json("error");
  }
  
});

router.post("/export-csv-in-next-2-day", async function (req, res) {
  try {
    const response = await exportExcelInNext2Day(req, res);
    res.status(200).json(response);
  } catch (error) {
    console.log(error);
    res.status(500).json("error");
  }
});

module.exports = router;
