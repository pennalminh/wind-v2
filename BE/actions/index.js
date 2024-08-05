const { callAPIWindy } = require("../api/windy");
const {
  calculatorWindSpeed,
  powerWind,
  calculatorWindSpeedFrom10to100meter,
  fillArrayEnd,
} = require("../common/fomular");
const {
  getNumberTimePerday,
  getLimitRecordOfWindApi,
  getRecordOfWindApi,
  getDataYesterday,
  getData2daysAgo,
} = require("../db/queryData");

const exportPowerForeCastByPeriodInDay = async (numPeriod) => {
  try {
    // P API+1
    const arrPAPIPlus1 = await getPowerWinToDayWindy();

    // Lấy dữ liệu thật trong DB
    const arrWsActualMinus1 = await getNumberTimePerday(numPeriod);

    const arrPActualMinus1 = arrWsActualMinus1?.map((ws) =>
      ws == null ? null : powerWind(2, 6, ws)
    );

    // Lấy dữ liệu windyAPI được lưu trong DB
    const currentHour = new Date().getHours();
    let limit = (24 - currentHour) / 3;
    if (limit % 2 != 0) {
      limit = Math.round(limit);
    }
    const offset = 8 - limit;

    const dataWindAPIMinus1 = await getRecordOfWindApi(
      numPeriod,
      limit,
      offset
    );

    let arrWsAPIMinus1 = Array(numPeriod).fill(null);
    let tempArr = [];
    dataWindAPIMinus1.forEach((ws) => {
      for (let index = 0; index < 12; index++) {
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
    for (let index = 0; index < arrPAPIPlus1.length; index++) {
      if (arrDeviation[index] == null) {
        arrPForecast.push(null);
        continue;
      }
      if (isNaN(arrDeviation[index])) {
        arrPForecast.push(arrPAPIPlus1[index]);
      } else {
        const pForecast =
          arrPAPIPlus1[index] * 0.7 + arrPActualMinus1[index] * 0.3;
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
  const arrPAPIPlus1 = await getPowerWindInNextDayWindy(numPeriod);

  // Lấy dữ liệu thật trong DB
  const arrWsActualMinus1 = await getDataYesterday(numPeriod);

  const arrPActualMinus1 = arrWsActualMinus1?.map((ws) => powerWind(2, 6, ws));

  // Lấy dữ liệu windyAPI được lưu trong DB
  const currentHour = new Date().getHours();
  let limit = 8;
  let offset = parseInt(currentHour / 3);

  const dataWindAPIMinus1 = await getRecordOfWindApi(numPeriod, limit, offset);

  let arrWsAPIMinus1 = [];
  dataWindAPIMinus1.forEach((ws) => {
    for (let index = 0; index < 12; index++) {
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
  for (let index = 0; index < arrPAPIPlus1.length; index++) {
    if (isNaN(arrDeviation[index])) {
      arrPForecast.push(arrPAPIPlus1[index]);
    } else {
      const pForecast =
        arrPAPIPlus1[index] * 0.7 + arrPActualMinus1[index] * 0.3;
      arrPForecast.push(pForecast);
    }
  }

  return arrPForecast.map((p) => (p > 30 ? 29 + Math.random() : p));
};

const exportPowerForeCastByPeriodIn2Day = async (numPeriod) => {
  // P API+1
  const arrPAPIPlus1 = await getPowerWindInNextDay2Windy(numPeriod);

  // Lấy dữ liệu thật trong DB
  const arrWsActualMinus1 = await getDataYesterday(numPeriod);
  const arrPActualMinus1 = arrWsActualMinus1?.map((ws) => powerWind(2, 6, ws));

  // Lấy dữ liệu windyAPI được lưu trong DB
  const currentHour = new Date().getHours();
  let limit = 8;
  let offset = parseInt(currentHour / 3);

  const dataWindAPIMinus1 = await getRecordOfWindApi(numPeriod, limit, offset);

  let arrWsAPIMinus1 = [];
  dataWindAPIMinus1.forEach((ws) => {
    for (let index = 0; index < 12; index++) {
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
  for (let index = 0; index < arrPAPIPlus1.length; index++) {
    if (isNaN(arrDeviation[index])) {
      arrPForecast.push(arrPAPIPlus1[index]);
    } else {
      const pForecast = (arrDeviation[index] * 17) / 100;
      arrPForecast.push(pForecast);
    }
  }

  return arrPForecast.map((p) => (p > 30 ? 29 + Math.random() : p));
};

const getPowerWinToDayWindy = async () => {
  const response = await callAPIWindy();

  let arr96Pw = Array(96).fill(null);
  const currentHour = new Date().getHours();
  let lastEle = (24 - currentHour) / 3;
  let tempArr = [];

  for (let index = 0; index < lastEle; index++) {
    const ws = calculatorWindSpeedFrom10to100meter(
      response.list[index].wind.speed
    );

    const pw = powerWind(2, 6, ws);
    for (let j = 0; j < 12; j++) {
      tempArr.push(pw);
    }
  }

  const result = fillArrayEnd(arr96Pw, tempArr);
  return result;
};

const getPowerWindInNextDayWindy = async (numPeriod) => {
  const response = await callAPIWindy();
  let arrPw = Array(numPeriod).fill(null);
  const currentHour = new Date().getHours();
  let startEle = parseInt((24 - currentHour) / 3);
  let tempArr = [];

  for (let index = startEle; index < startEle; index++) {
    const ws = calculatorWindSpeedFrom10to100meter(
      response.list[index].wind.speed
    );

    const pw = powerWind(2, 6, ws);
    for (let j = 0; j < 12; j++) {
      tempArr.push(pw);
    }
  }

  const result = fillArrayEnd(arrPw, tempArr);
  return result;
};

const getPowerWindInNextDay2Windy = async (numPeriod) => {
  const response = await callAPIWindy();
  let arrPw = Array(numPeriod).fill(null);
  const currentHour = new Date().getHours();
  let startEle = parseInt((24 - currentHour) / 3);
  let tempArr = [];

  for (let index = startEle + 8; index < startEle + 16; index++) {
    const ws = calculatorWindSpeedFrom10to100meter(
      response.list[index].wind.speed
    );

    const pw = powerWind(2, 6, ws);
    for (let j = 0; j < 6; j++) {
      tempArr.push(pw);
    }
  }

  const result = fillArrayEnd(arrPw, tempArr);

  return result;
};

module.exports = {
  exportPowerForeCastByPeriodInDay,
  exportPowerForeCastByPeriodInNextDay,
  exportPowerForeCastByPeriodIn2Day,
};
