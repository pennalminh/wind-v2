const { exportPowerForeCastByPeriodInDay } = require("../actions");

const dataExportPowerForeCastByPeriodInDay = async (req, res) => {
  try {
    const arrP = await exportPowerForeCastByPeriodInDay(96);
    return arrP;
  } catch (error) {
    return error;
  }
};

module.exports = {
  dataExportPowerForeCastByPeriodInDay,
};
