"use strict";
const { powerWind } = require("../common/fomular");
const { getActualDataInperiod, getDataPPredict } = require("../db/queryData");

const dataExportPowerForeCastByPeriod = async (req, res) => {
  try {
    const arrWindActual = await getActualDataInperiod(
      96,
      req.body.startDay,
      req.body.endDay
    );

    const arrPPredict = await getDataPPredict(
      req.body.startDay,
      req.body.endDay
    );

    return {
      predict: arrPPredict,
      actual: arrWindActual.map((p) => powerWind(2, 6, p)),
    };
  } catch (error) {
    return error;
  }
};

module.exports = {
  dataExportPowerForeCastByPeriod,
};
