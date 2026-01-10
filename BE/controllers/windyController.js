"use strict";

const { parseStringToArray } = require("../common/format");
const { writeDataWindy } = require("../db/writeData");

const getDataWindy = async (req, res) => {
  try {
    const arrData = parseStringToArray(req.body.wind_speed);
    await writeDataWindy(arrData);
  } catch (error) {
    return error;
  }
};

module.exports = {
  getDataWindy,
};
