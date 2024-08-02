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
    |> filter(fn: (r) => r["device"] == "SCADA-HD-WT")
    |> filter(fn: (r) => r["name"] == "WT01-WS" or r["name"] == "WT02-WS" or r["name"] == "WT03-WS" or r["name"] == "WT04-WS" or r["name"] == "WT05-WS" or r["name"] == "WT06-WS" or r["name"] == "WT07-WS" or r["name"] == "WT08-WS") 
    |> aggregateWindow(every: ${groupPerMinute}m, fn: mean, createEmpty: true)
    |> group(columns: ["_time"])
    |> mean()
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
    |> filter(fn: (r) => r["device"] == "SCADA-HD-WT")
    |> filter(fn: (r) => r["name"] == "WT01-WS" or r["name"] == "WT02-WS" or r["name"] == "WT03-WS" or r["name"] == "WT04-WS" or r["name"] == "WT05-WS" or r["name"] == "WT06-WS" or r["name"] == "WT07-WS" or r["name"] == "WT08-WS") 
    |> aggregateWindow(every: ${groupPerMinute}m, fn: mean, createEmpty: true)
    |> yield(name: "mean")
    `;

  for await (const { values, tableMeta } of queryApi.iterateRows(fluxQuery)) {
    const o = tableMeta.toObject(values);
    arrResponse.push(o._value);
  }

  return arrResponse;
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

const getRecordOfWindApi = async (numPeriod, limit, offset) => {
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

const getDataYesterday = async (numberTime) => {
  const groupPerMinute = 1440 / numberTime;
  let currentTime = groupPerMinute;
  let arrResponse = new Array(numberTime).fill(null);
  let tempArr = [];
  const start = new Date();
  start.setDate(start.getDate() - 1);
  start.setHours(7, 0, 0, 0);

  const end = new Date();
  end.setHours(7, 0, 0, 0);

  const fluxQuery = `
   from(bucket: "${influxBucket}")
    |> range(start: ${start.toISOString()}, stop: ${end.toISOString()}) 
    |> filter(fn: (r) => r["device"] == "SCADA-HD-WT")
    |> filter(fn: (r) => r["name"] == "WT01-WS" or r["name"] == "WT02-WS" or r["name"] == "WT03-WS" or r["name"] == "WT04-WS" or r["name"] == "WT05-WS" or r["name"] == "WT06-WS" or r["name"] == "WT07-WS" or r["name"] == "WT08-WS") 
    |> aggregateWindow(every: ${groupPerMinute}m, fn: mean, createEmpty: true)
    |> group(columns: ["_time"])
    |> mean()
    `;
  console.log(fluxQuery);

  currentTime += groupPerMinute;
  for await (const { values, tableMeta } of queryApi.iterateRows(fluxQuery)) {
    const o = tableMeta.toObject(values);
    tempArr.push(o._value);
  }

  const result = fillArrayEnd(arrResponse, tempArr);
  console.log(result);
  return result;
};

const getData2daysAgo = async (numberTime) => {
  const groupPerMinute = 2880 / numberTime;
  let currentTime = groupPerMinute;
  let arrResponse = new Array(numberTime).fill(null);
  let tempArr = [];
  const start = new Date();
  start.setDate(start.getDate() - 2);
  start.setHours(7, 0, 0, 0);

  const end = new Date();
  end.setHours(7, 0, 0, 0);

  const fluxQuery = `
   from(bucket: "${influxBucket}")
    |> range(start: ${start.toISOString()}, stop: ${end.toISOString()}) 
    |> filter(fn: (r) => r["device"] == "SCADA-HD-WT")
    |> filter(fn: (r) => r["name"] == "WT01-WS" or r["name"] == "WT02-WS" or r["name"] == "WT03-WS" or r["name"] == "WT04-WS" or r["name"] == "WT05-WS" or r["name"] == "WT06-WS" or r["name"] == "WT07-WS" or r["name"] == "WT08-WS") 
    |> aggregateWindow(every: ${groupPerMinute}m, fn: mean, createEmpty: true)
    |> group(columns: ["_time"])
    |> mean()
    `;

  console.log(fluxQuery);

  currentTime += groupPerMinute;
  for await (const { values, tableMeta } of queryApi.iterateRows(fluxQuery)) {
    const o = tableMeta.toObject(values);
    tempArr.push(o._value);
  }

  const result = fillArrayEnd(arrResponse, tempArr);

  console.log(result);

  return result;
};

module.exports = {
  getLimitRecordOfWindApi,
  getNumberTimePerday,
  getActualDataInperiod,
  getDataPPredict,
  getRecordOfWindApi,
  getDataYesterday,
  getData2daysAgo,
};
