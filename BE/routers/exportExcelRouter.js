"use strict";
const {
  exportExcel96Period,
  exportExcel96PeriodInNextDay,
  exportExcelInNext2Day,
  exportWeekly30MinData,
} = require("../controllers/exportExcelController");
const { Router } = require("express");

const router = Router();

router.post("/export-csv-in-day", async function (req, res) {
  try {
    const response = await exportExcel96Period(req);
    res.status(200).json(response);
  } catch (error) {
    console.error(error); // Use console.error for errors
    if (!res.headersSent) {
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
});

router.post("/export-csv-in-next-day", async function (req, res) {
  try {
    const response = await exportExcel96PeriodInNextDay(req);
    res.status(200).json(response);
  } catch (error) {
    console.error(error); // Use console.error for errors
    if (!res.headersSent) {
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
  
});

router.post("/export-csv-in-next-2-day", async function (req, res) {
  try {
    const response = await exportExcelInNext2Day(req);
    res.status(200).json(response);
  } catch (error) {
    console.error(error); // Use console.error for errors
    if (!res.headersSent) {
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
});

router.get("/export-csv-in-next-week", async function (req, res) {
  try {
    await exportWeekly30MinData(req, res);
  } catch (error) {
    console.error(error); // Use console.error for errors
    if (!res.headersSent) {
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
});

module.exports = router;