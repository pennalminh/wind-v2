"use strict";

const {
  exportPowerForeCastByPeriodInDay,
  exportPowerForeCastByPeriodIn2Day,
  exportPowerForeCastByPeriodInNextDay,
} = require("../actions");
const { queryInfluxForWeekly30MinData } = require("../db/queryData");
const { powerWind } = require("../common/fomular");

const exportExcel96Period = async (req) => {
  try {
    const arrP = await exportPowerForeCastByPeriodInDay(96);
    // writeExcelWithTemplate(arrP, "Dự báo trong ngày");
    return arrP;
  } catch (error) {
    throw error; // Re-throw the error to be caught by the router
  }
};

const exportExcel96PeriodInNextDay = async (req) => {
  try {
    const arrP = await exportPowerForeCastByPeriodInNextDay(96);
    // writeExcelWithTemplate(arrP, "Dự báo trong ngày tới");
    return arrP;
  } catch (error) {
    throw error; // Re-throw the error to be caught by the router
  }
};

const exportExcelInNext2Day = async (req) => {
  try {
    const arrP = await exportPowerForeCastByPeriodIn2Day(48);
    // writeExcelWithTemplate(arrP, "Dự báo trong 2 ngày tới");
    return arrP;
  } catch (error) {
    throw error; // Re-throw the error to be caught by the router
  }
};

const exportWeekly30MinData = async (req, res) => {
  try {
    const rawData = await queryInfluxForWeekly30MinData();

    // Initialize the 2D array for 48 intervals (30-min) x 7 days + Pmin + Pmax
    // [Pmin, Pmax, Mon, Tue, Wed, Thu, Fri, Sat, Sun]
    const weekly30MinData = Array(48)
      .fill(null)
      .map(() => [0, 0, null, null, null, null, null, null, null]);

    const intervalMaxes = {}; // To store the max power for each 30-min interval across all days

    rawData.forEach((item) => {
      const time = new Date(item._time);
      const hour = time.getHours();
      const minute = time.getMinutes();
      const dayOfWeek = time.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday

      // Calculate the 30-minute interval index (0 to 47)
      const intervalIndex = hour * 2 + (minute >= 30 ? 1 : 0);

      // Adjust dayOfWeek to start from Monday (1) to Sunday (7) for array indexing
      // Monday (1) -> index 2, Sunday (0) -> index 8
      const dayIndex = dayOfWeek === 0 ? 8 : dayOfWeek + 1; 

      const power = parseFloat(powerWind(2, 6, item._value).toFixed(1)); // Convert wind speed to power and fix to 1 decimal

      // Populate the data for the specific 30-min interval and day
      weekly30MinData[intervalIndex][dayIndex] = power;

      // Update interval max power
      if (!intervalMaxes[intervalIndex]) {
        intervalMaxes[intervalIndex] = 0;
      }
      intervalMaxes[intervalIndex] = Math.max(intervalMaxes[intervalIndex], power);
    });

    // Populate Pmax for each 30-minute interval
    for (let i = 0; i < 48; i++) {
      if (intervalMaxes[i] !== undefined) {
        weekly30MinData[i][1] = intervalMaxes[i]; // Set Pmax
      } else {
        // If no data for this interval across the week, Pmax is 0 (initialized)
        // Or can be set to a default value like 50 if that's a hard limit
        weekly30MinData[i][1] = 50; // Default Pmax if no data found for the interval
      }
    }

    res.json(weekly30MinData);
  } catch (error) {
    console.error("Error in exportWeekly30MinData:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = {
  exportExcel96Period,
  exportExcel96PeriodInNextDay,
  exportExcelInNext2Day,
  exportWeekly30MinData,
};