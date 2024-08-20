"use strict";

const { parseStringToArray } = require("../common/format");
const { writeDataWindy, writeDataWindyHistory } = require("../db/writeData");

const getDataWindy = async (req, res) => {
  try {
    const arrData = parseStringToArray(req.body.wind_speed);
    await writeDataWindy(arrData);
    await writeDataWindyHistory(arrData.slice(0, 24));
  } catch (error) {
    return error;
  }
};

module.exports = {
  getDataWindy,
};
