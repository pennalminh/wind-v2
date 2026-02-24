const { InfluxDB, Point } = require("@influxdata/influxdb-client");
const { fillArrayEnd } = require("../common/fomular");
require("dotenv").config();

/** Environment variables **/
const url = process.env.URL_INFLUX_DB;
const token = process.env.INFLUXDB_TOKEN;
const org = process.env.ORGANIZATION_ID;
const influxBucket = process.env.INFLUX_BUCKET;
const influxMeasurementWindAPI = process.env.INFLUX_MEASUREMENT_WINDY_API;
const influxMeasurementWindAPIHistory =
  process.env.INFLUX_MEASUREMENT_WINDY_API_HISTORY;
const deviceName = process.env.DEVICE_NAME;

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
  today.setHours(0, 0, 0, 0);
  today.setHours(today.getHours() + 24);

  const fluxQuery = `
    from(bucket: "${influxBucket}")
    |> range(start: ${previousDate.toISOString()}, stop: ${today.toISOString()}) 
    |> filter(fn: (r) => r["device"] == "${deviceName}")
    |> filter(fn: (r) => r["name"] == "WT01-WS" or r["name"] == "WT02-WS" or r["name"] == "WT03-WS" or r["name"] == "WT04-WS" or r["name"] == "WT05-WS" or r["name"] == "WT06-WS" or r["name"] == "WT07-WS" or r["name"] == "WT08-WS") 
    |> aggregateWindow(every: ${groupPerMinute}m, fn: mean, createEmpty: true)
    |> group(columns: ["_time"])
    |> mean()
    `;

  for await (const { values, tableMeta } of queryApi.iterateRows(fluxQuery)) {
    const o = tableMeta.toObject(values);
    tempArr.push(o._value);
  }

  if (tempArr.length > numberTimeInDay) {
    tempArr.pop();
  }

  const result = fillArrayEnd(arrResponse, tempArr);

  return result;
};

const getActualDataInperiod = async (numberTimeInDay, startDate, endDate) => {
  let arrResponse = [];
  const groupPerMinute = 1440 / numberTimeInDay;
  const start = new Date(startDate);
  start.setHours(start.getHours() - 7);

  const end = new Date(endDate);
  end.setHours(end.getHours() - 7);

  const fluxQuery = `
    from(bucket: "${influxBucket}")
    |> range(start: ${start.toISOString()}, stop:${end.toISOString()})
    |> filter(fn: (r) => r["device"] == "${deviceName}")
    |> filter(fn: (r) => r["name"] == "WT01-WS" or r["name"] == "WT02-WS" or r["name"] == "WT03-WS" or r["name"] == "WT04-WS" or r["name"] == "WT05-WS" or r["name"] == "WT06-WS" or r["name"] == "WT07-WS" or r["name"] == "WT08-WS") 
    |> aggregateWindow(every: ${groupPerMinute}m, fn: mean, createEmpty: true)
    |> group(columns: ["_time"])
    |> mean()
    `;

  for await (const { values, tableMeta } of queryApi.iterateRows(fluxQuery)) {
    const o = tableMeta.toObject(values);
    arrResponse.push(o._value);
  }

  return arrResponse;
};

const getRecordOfWindApi = async (limit, offset) => {
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

  return arrResponse.reverse();
};

const getRecordOfWindApiHistory = async (limit, offset) => {
  const fluxQuery = `
   from(bucket: "${influxBucket}")
    |> range(start: -10d)
    |> filter(fn: (r) => r._measurement == "${influxMeasurementWindAPIHistory}")
    |> sort(columns: ["_time"], desc: true)
    |> limit(n: ${limit}, offset: ${offset} )
    `;

  let arrResponse = [];

  for await (const { values, tableMeta } of queryApi.iterateRows(fluxQuery)) {
    const o = tableMeta.toObject(values);
    arrResponse.push(o._value);
  }

  return arrResponse.reverse();
};

const getDataPPredict = async (startDate, endDate) => {
  const start = new Date(startDate);
  start.setHours(start.getHours() + 24);

  const end = new Date(endDate);
  end.setHours(end.getHours() + 24);

  const fluxQuery = `
   from(bucket: "${influxBucket}")
    |> range(start: ${start.toISOString()}, stop:${end.toISOString()})
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

  console.log(groupPerMinute);

  let currentTime = groupPerMinute;
  let arrResponse = new Array(numberTime).fill(null);
  let tempArr = [];
  const start = new Date();
  start.setDate(start.getDate() - 2);
  start.setHours(24, 0, 0, 0);

  const end = new Date();
  end.setDate(end.getDate() - 1);
  end.setHours(24, 0, 0, 0);

  const fluxQuery = `
   from(bucket: "${influxBucket}")
    |> range(start: ${start.toISOString()}, stop: ${end.toISOString()}) 
    |> filter(fn: (r) => r["device"] == "${deviceName}")
    |> filter(fn: (r) => r["name"] == "WT01-WS" or r["name"] == "WT02-WS" or r["name"] == "WT03-WS" or r["name"] == "WT04-WS" or r["name"] == "WT05-WS" or r["name"] == "WT06-WS" or r["name"] == "WT07-WS" or r["name"] == "WT08-WS") 
    |> aggregateWindow(every: ${groupPerMinute}m, fn: mean, createEmpty: true)
    |> group(columns: ["_time"])
    |> mean()
    `;

  currentTime += groupPerMinute;
  for await (const { values, tableMeta } of queryApi.iterateRows(fluxQuery)) {
    const o = tableMeta.toObject(values);
    tempArr.push(o._value);
  }

  const result = fillArrayEnd(arrResponse, tempArr);
  return result;
};

const getData2daysAgo = async (numberTime) => {
  const groupPerMinute = 2880 / numberTime;
  let currentTime = groupPerMinute;
  let arrResponse = new Array(numberTime).fill(null);
  let tempArr = [];
  const start = new Date();
  start.setDate(start.getDate() - 3);
  start.setHours(24, 0, 0, 0);

  const end = new Date();
  end.setDate(end.getDate() - 1);
  end.setHours(24, 0, 0, 0);

  const fluxQuery = `
   from(bucket: "${influxBucket}")
    |> range(start: ${start.toISOString()}, stop: ${end.toISOString()}) 
    |> filter(fn: (r) => r["device"] == "${deviceName}")
    |> filter(fn: (r) => r["name"] == "WT01-WS" or r["name"] == "WT02-WS" or r["name"] == "WT03-WS" or r["name"] == "WT04-WS" or r["name"] == "WT05-WS" or r["name"] == "WT06-WS" or r["name"] == "WT07-WS" or r["name"] == "WT08-WS") 
    |> aggregateWindow(every: ${groupPerMinute}m, fn: mean, createEmpty: true)
    |> group(columns: ["_time"])
    |> mean()
    `;

  currentTime += groupPerMinute;
  for await (const { values, tableMeta } of queryApi.iterateRows(fluxQuery)) {
    const o = tableMeta.toObject(values);
    tempArr.push(o._value);
  }

  const result = fillArrayEnd(arrResponse, tempArr);
  return result;
};

const queryInfluxForWeekly30MinData = async () => {
  const now = new Date();
  const dayOfWeek = now.getDay(); // 0 for Sunday, 1 for Monday, ..., 6 for Saturday

  // Calculate the start of the current week (Monday)
  const currentWeekStart = new Date(now);
  currentWeekStart.setDate(now.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1));
  currentWeekStart.setHours(0, 0, 0, 0);

  // Calculate the start of the previous week (Monday)
  const lastWeekStart = new Date(currentWeekStart);
  lastWeekStart.setDate(currentWeekStart.getDate() - 7);
  lastWeekStart.setHours(lastWeekStart.getHours() - 7); // Adjust for UTC+7

  // Calculate the end of the previous week (Sunday)
  const lastWeekEnd = new Date(currentWeekStart);
  lastWeekEnd.setMilliseconds(lastWeekEnd.getMilliseconds() - 1); // Set to 23:59:59.999 Sunday
  lastWeekEnd.setHours(lastWeekEnd.getHours() - 7); // Adjust for UTC+7

  const fluxQuery = `
    from(bucket: "${influxBucket}")
    |> range(start: ${lastWeekStart.toISOString()}, stop: ${lastWeekEnd.toISOString()})
    |> filter(fn: (r) => r["device"] == "${deviceName}")
    |> filter(fn: (r) => r["name"] == "WT01-WS" or r["name"] == "WT02-WS" or r["name"] == "WT03-WS" or r["name"] == "WT04-WS" or r["name"] == "WT05-WS" or r["name"] == "WT06-WS" or r["name"] == "WT07-WS" or r["name"] == "WT08-WS") 
    |> aggregateWindow(every: 30m, fn: mean, createEmpty: true)
    |> group(columns: ["_time"])
    |> mean()
  `;

  let arrResponse = [];
  for await (const { values, tableMeta } of queryApi.iterateRows(fluxQuery)) {
    const o = tableMeta.toObject(values);
    arrResponse.push(o);
  }
  return arrResponse;
};

module.exports = {
  getNumberTimePerday,
  getActualDataInperiod,
  getDataPPredict,
  getRecordOfWindApi,
  getDataYesterday,
  getData2daysAgo,
  getRecordOfWindApiHistory,
  queryInfluxForWeekly30MinData,
};
