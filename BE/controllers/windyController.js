"use strict";
const { writeDataWindy, writeDataWindyHistory } = require("../db/writeData");

const getDataWindy = async (req, res) => {
  try {
    const arrData = req.body.wind_speed;
    await writeDataWindy(arrData);
    await writeDataWindyHistory(arrData.slice(0, 24));
  } catch (error) {
    return error;
  }
};

module.exports = {
  getDataWindy,
};
