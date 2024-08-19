"use strict";

const { parseStringToArray } = require("../common/format");
const { writeDataWindy, writeDataWindyHistory } = require("../db/writeData");

const getDataWindy = async (req, res) => {
  try {
    const arrData = parseStringToArray(req.body.wind_speed);
    setTimeout(() => {
      writeDataWindyHistory(arrData.slice(0, 10));
    }, 1000);
    writeDataWindy(arrData);
  } catch (error) {
    return error;
  }
};

module.exports = {
  getDataWindy,
};
