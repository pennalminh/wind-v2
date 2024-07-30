const { InfluxDB, Point } = require("@influxdata/influxdb-client");
const { fillArrayEnd } = require("../common/fomular");
require("dotenv").config();

/** Environment variables **/
const url = process.env.URL_INFLUX_DB;
const token = process.env.INFLUXDB_TOKEN;
const org = process.env.ORGANIZATION_ID;
const influxBucket = process.env.INFLUX_BUCKET;
const influxMeasurementWindAPI = process.env.INFLUX_MEASUREMENT_WINDY_API;

const influxDB = new InfluxDB({ url, token });
const queryApi = influxDB.getQueryApi(org);

const getNumberTimePerday = async (numberTimeInDay) => {
  const groupPerMinute = 1440 / numberTimeInDay;
  let arrResponse = Array(numberTimeInDay).fill(null);
  let tempArr = [];

  const previousDate = new Date();
  previousDate.setDate(previousDate.getDate() - 1);

  const today = new Date();
  today.setDate(today.getDate() - 1);
  today.setHours(7, 0, 0, 0);
  today.setHours(today.getHours() + 17);

  const fluxQuery = `
    from(bucket: "${influxBucket}")
    |> range(start: ${previousDate.toISOString()}, stop: ${today.toISOString()}) 
    |> filter(fn: (r) => r.device == "Turbine1" or  r.device == "Turbine2")
    |> aggregateWindow(every: ${groupPerMinute}m, fn: mean, createEmpty: true)
    |> yield(name: "mean")
    `;

  for await (const { values, tableMeta } of queryApi.iterateRows(fluxQuery)) {
    const o = tableMeta.toObject(values);
    tempArr.push(o._value);
  }

  const result = fillArrayEnd(arrResponse, tempArr);
  return result;
};

const getActualDataInperiod = async (numberTimeInDay, startDate, endDate) => {
  let arrResponse = [];
  const groupPerMinute = 1440 / numberTimeInDay;

  const fluxQuery = `
    from(bucket: "${influxBucket}")
    |> range(start: ${startDate}, stop:${endDate})
    |> filter(fn: (r) => r.device == "Turbine1" or  r.device == "Turbine2")
    |> aggregateWindow(every: ${groupPerMinute}m, fn: mean, createEmpty: true)
    |> yield(name: "mean")
    `;

  for await (const { values, tableMeta } of queryApi.iterateRows(fluxQuery)) {
    const o = tableMeta.toObject(values);
    arrResponse.push(o._value);
  }

  return arrResponse;
};

const getIn2Day = async (numberTime) => {
  const groupPerMinute = 2880 / numberTime;
  let currentTime = groupPerMinute;
  let arrResponse = new Array(numberTime).fill(null);

  for (let index = 0; index < numberTime; index++) {
    const fluxQuery = `
    from(bucket: "${influxBucket}")
    |> range(start: -${currentTime + groupPerMinute}h, stop: -${currentTime}h) 
    |> filter(fn: (r) => r.device == "Turbine1" or  r.device == "Turbine2")
    |> group()
    |> mean()
    `;

    currentTime += groupPerMinute;
    for await (const { values, tableMeta } of queryApi.iterateRows(fluxQuery)) {
      const o = tableMeta.toObject(values);
      arrResponse[index] = o._value;
    }
  }

  return arrResponse.reverse();
};

const getLimitRecordOfWindApi = async (limit) => {
  const fluxQuery = `
   from(bucket: "${influxBucket}")
    |> range(start: -5d)
    |> filter(fn: (r) => r._measurement == "${influxMeasurementWindAPI}")
    |> sort(columns: ["_time"], desc: true)
    |> limit(n: ${limit})
    `;

  let arrResponse = [];

  for await (const { values, tableMeta } of queryApi.iterateRows(fluxQuery)) {
    const o = tableMeta.toObject(values);
    arrResponse.push(o._value);
  }
  return arrResponse;
};

const getRecordOfWindApi = async () => {
  const currentHour = new Date().getHours();
  console.log(currentHour);
  let limit = (24 - currentHour) / 3;
  if (limit % 2 != 0) {
    limit = Math.round(limit) + 1;
  }
  console.log(limit);
  const offset = 8 - limit;
  const fluxQuery = `
   from(bucket: "${influxBucket}")
    |> range(start: -5d)
    |> filter(fn: (r) => r._measurement == "${influxMeasurementWindAPI}")
    |> sort(columns: ["_time"], desc: true)
    |> limit(n: ${limit}, offset: ${offset} )
    `;

  let arrResponse = [];

  for await (const { values, tableMeta } of queryApi.iterateRows(fluxQuery)) {
    const o = tableMeta.toObject(values);
    arrResponse.push(o._value);
  }
  return arrResponse;
};

const getDataPPredict = async (startDate, endDate) => {
  const fluxQuery = `
   from(bucket: "${influxBucket}")
    |> range(start: ${startDate}, stop:${endDate})
    |> filter(fn: (r) => r._measurement == "p_predictation")
    `;

  let arrResponse = [];

  for await (const { values, tableMeta } of queryApi.iterateRows(fluxQuery)) {
    const o = tableMeta.toObject(values);
    arrResponse.push(o._value);
  }
  return arrResponse;
};

module.exports = {
  getLimitRecordOfWindApi,
  getNumberTimePerday,
  getIn2Day,
  getActualDataInperiod,
  getDataPPredict,
  getRecordOfWindApi,
};
