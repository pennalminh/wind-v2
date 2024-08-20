const {
  calculatorWindSpeed,
  powerWind,
  calculatorWindSpeedFrom10to100meter,
  fillArrayEnd,
} = require("../common/fomular");
const {
  getNumberTimePerday,
  getRecordOfWindApi,
  getDataYesterday,
  getRecordOfWindApiHistory,
} = require("../db/queryData");

const exportPowerForeCastByPeriodInDay = async (numPeriod) => {
  try {
    // P API+1
    const arrWinSpeedToday = await getRecordOfWindApi(24, 48);

    arrPAPIToday = [];
    arrWinSpeedToday.map((ws) => {
      for (let index = 0; index < 4; index++) {
        arrPAPIToday.push(powerWind(2, 6, ws));
      }
    });

    // Lấy dữ liệu thật trong DB
    const arrWsActualMinus1 = await getNumberTimePerday(numPeriod);

    const arrPActualMinus1 = arrWsActualMinus1?.map((ws) =>
      ws == null ? null : powerWind(2, 6, ws)
    );

    // Lấy dữ liệu windyAPI được lưu trong DB
    const currentHour = new Date().getHours();
    let limit = 24 - currentHour;
    const offset = 24;

    const dataWindAPIMinus1 = await getRecordOfWindApiHistory(limit, offset);

    let arrWsAPIMinus1 = Array(numPeriod).fill(null);
    let tempArr = [];
    dataWindAPIMinus1.forEach((ws) => {
      for (let index = 0; index < 4; index++) {
        tempArr.push(ws);
      }
    });

    arrWsAPIMinus1 = fillArrayEnd(arrWsAPIMinus1, tempArr);

    const arrPAPIMinus1 = arrWsAPIMinus1?.map((ws) =>
      ws == null ? null : powerWind(2, 6, ws)
    );

    // Tính sai số
    let arrDeviation = [];

    for (let index = 0; index < arrPActualMinus1.length; index++) {
      arrPActualMinus1[index] == null
        ? arrDeviation.push(null)
        : arrDeviation.push(
            Math.abs(
              ((arrPActualMinus1[index] - arrPAPIMinus1[index]) / 30) * 100
            )
          );
    }

    // Tính P dự báo
    let arrPForecast = [];
    for (let index = 0; index < arrPAPIToday.length; index++) {
      if (arrDeviation[index] == null) {
        arrPForecast.push(null);
        continue;
      }
      if (isNaN(arrDeviation[index])) {
        arrPForecast.push(arrPAPIToday[index]);
      } else {
        const pForecast =
          arrPAPIToday[index] * 0.7 + arrPActualMinus1[index] * 0.3;
        arrPForecast.push(pForecast);
      }
    }

    return arrPForecast.map((p) => (p > 30 ? 29 + Math.random() : p));
  } catch (error) {
    console.log(error);
  }
};

const exportPowerForeCastByPeriodInNextDay = async (numPeriod) => {
  // P API+1
  const arrWinSpeedNextDay = await getRecordOfWindApi(24, 24);

  arrPAPINextDay = [];
  arrWinSpeedNextDay.map((ws) => {
    for (let index = 0; index < 4; index++) {
      arrPAPINextDay.push(powerWind(2, 6, ws));
    }
  });

  // Lấy dữ liệu thật trong DB
  const arrWsActualMinus1 = await getDataYesterday(numPeriod);

  const arrPActualMinus1 = arrWsActualMinus1?.map((ws) => powerWind(2, 6, ws));

  // Lấy dữ liệu windyAPI được lưu trong DB
  let limit = 24;
  let offset = 24;

  const dataWindAPIMinus1 = await getRecordOfWindApiHistory(limit, offset);

  let arrWsAPIMinus1 = [];
  dataWindAPIMinus1.forEach((ws) => {
    for (let index = 0; index < 4; index++) {
      arrWsAPIMinus1.push(ws);
    }
  });

  const arrPAPIMinus1 = arrWsAPIMinus1?.map((ws) =>
    powerWind(2, 6, calculatorWindSpeedFrom10to100meter(ws))
  );

  // Tính sai số
  let arrDeviation = [];
  for (let index = 0; index < arrPActualMinus1.length; index++) {
    const deviation =
      ((arrPActualMinus1[index] - arrPAPIMinus1[index]) / 30) * 100;
    arrDeviation.push(Math.abs(deviation));
  }

  // Tính P dự báo
  let arrPForecast = [];
  for (let index = 0; index < arrPAPINextDay.length; index++) {
    const pForecast =
      arrPAPINextDay[index] * 0.7 + arrPActualMinus1[index] * 0.3;
    arrPForecast.push(pForecast);
  }

  return arrPForecast.map((p) => (p > 30 ? 29 + Math.random() : p));
};

const exportPowerForeCastByPeriodIn2Day = async (numPeriod) => {
  // P API+2
  const arrWinSpeedNext2Day = await getRecordOfWindApi(24, 0);

  arrPAPINext2Day = [];
  arrWinSpeedNext2Day.map((ws) => {
    for (let index = 0; index < 2; index++) {
      arrPAPINext2Day.push(powerWind(2, 6, ws));
    }
  });

  // Lấy dữ liệu windyAPI được lưu trong DB
  let limit = 24;
  let offset = 48;

  const dataWindAPIMinus1 = await getRecordOfWindApiHistory(limit, offset);

  let arrWsAPIMinus1 = [];
  dataWindAPIMinus1.forEach((ws) => {
    for (let index = 0; index < 2; index++) {
      arrWsAPIMinus1.push(ws);
    }
  });

  const arrPAPIMinus1 = arrWsAPIMinus1?.map((ws) =>
    powerWind(2, 6, calculatorWindSpeedFrom10to100meter(ws))
  );

  // Lấy dữ liệu thật trong DB
  const arrWsActualMinus1 = await getDataYesterday(numPeriod);

  const arrPActualMinus1 = arrWsActualMinus1?.map((ws) => powerWind(2, 6, ws));

  // Tính sai số
  let arrDeviation = [];
  for (let index = 0; index < arrPActualMinus1.length; index++) {
    const deviation =
      ((arrPActualMinus1[index] - arrPAPIMinus1[index]) / 30) * 100;
    arrDeviation.push(Math.abs(deviation));
  }

  // Tính P dự báo
  let arrPForecast = [];
  for (let index = 0; index < arrPAPINext2Day.length; index++) {
    const pForecast =
      arrPAPINext2Day[index] * 0.7 + arrPActualMinus1[index] * 0.3;
    arrPForecast.push(pForecast);
  }

  return arrPForecast.map((p) => (p > 30 ? 29 + Math.random() : p));
};

module.exports = {
  exportPowerForeCastByPeriodInDay,
  exportPowerForeCastByPeriodInNextDay,
  exportPowerForeCastByPeriodIn2Day,
};
