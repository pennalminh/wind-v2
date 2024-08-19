"use strict";

const {
  exportPowerForeCastByPeriodInDay,
  exportPowerForeCastByPeriodIn2Day,
  exportPowerForeCastByPeriodInNextDay,
} = require("../actions");
const { writeExcelWithTemplate } = require("../actions/writeExcel");

const exportExcel96Period = async (req, res) => {
  try {
    const arrP = await exportPowerForeCastByPeriodInDay(96);
    writeExcelWithTemplate(arrP, "Dự báo trong ngày");
  } catch (error) {
    return error;
  }
};

const exportExcel96PeriodInNextDay = async (req, res) => {
  try {
    const arrP = await exportPowerForeCastByPeriodInNextDay(96);
    writeExcelWithTemplate(arrP, "Dự báo trong ngày tới");
  } catch (error) {
    return error;
  }
};

const exportExcelInNext2Day = async (req, res) => {
  try {
    const arrP = await exportPowerForeCastByPeriodIn2Day(48);

    writeExcelWithTemplate(arrP, "Dự báo trong 2 ngày tới");
  } catch (error) {
    return error;
  }
};

module.exports = {
  exportExcel96Period,
  exportExcel96PeriodInNextDay,
  exportExcelInNext2Day,
};
