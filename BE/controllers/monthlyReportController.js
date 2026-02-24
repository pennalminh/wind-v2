"use strict";
const {
  exportMonthlyReport,
} = require("../actions");

const getMonthlyReport = async (req, res) => {
  try {
    const {filePath,fileName} = await exportMonthlyReport();
    res.download(filePath,fileName, (err) => {
      if (err) {
        console.error("Error downloading the file:", err);
        res.status(500).json({ error: "Failed to download the report." });
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getMonthlyReport,
};
