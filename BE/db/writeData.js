"use strict";

const { InfluxDB, Point } = require("@influxdata/influxdb-client");
const { calculatorWindSpeedFrom10to100meter } = require("../common/fomular");
require("dotenv").config();

const url = process.env.URL_INFLUX_DB;
const token = process.env.INFLUXDB_TOKEN;
const org = process.env.ORGANIZATION_ID;
const bucket = process.env.INFLUX_BUCKET;
const influxMeasurementWindAPI = process.env.INFLUX_MEASUREMENT_WINDY_API;
const influxMeasurementWindAPIHistory =
  process.env.INFLUX_MEASUREMENT_WINDY_API_HISTORY;

// Instantiate the InfluxDB client
const influxDB = new InfluxDB({ url, token });

// Create a write client from the getWriteApi method, providing your org and bucket.

// Apply default tags to all points if needed
const writeDataWindy = async (arrWindspeed) => {
  const writeApi = influxDB.getWriteApi(org, bucket);

  const writePromises = arrWindspeed?.map(async (data) => {
    let windSpeed = calculatorWindSpeedFrom10to100meter(data);
    const point = new Point(influxMeasurementWindAPI).floatField(
      "value",
      windSpeed
    );

    writeApi.writePoint(point);
  });

  await Promise.all(writePromises);
  await writeApi.flush();

  console.log("WRITE FINISHED");

  process.on("exit", () => {
    writeApi.close().then(() => {
      console.log("Ok");
    });
  });
};

const writeDataWindyHistory = async (arrWindspeed) => {
  const writeApi = influxDB.getWriteApi(org, bucket);

  const writePromises = arrWindspeed?.map(async (data) => {
    let windSpeed = calculatorWindSpeedFrom10to100meter(data);
    const point = new Point(influxMeasurementWindAPIHistory).floatField(
      "value",
      windSpeed
    );

    writeApi.writePoint(point);
  });

  await Promise.all(writePromises);
  await writeApi.flush();

  console.log("WRITE FINISHED");

  process.on("exit", () => {
    writeApi.close().then(() => {
      console.log("Ok");
    });
  });
};

const writePPrecipitation = async (arrData) => {
  const writeApi = influxDB.getWriteApi(org, bucket);

  const writePromises = arrData?.map(async (data) => {
    if (data == null) {
      data = 0;
    }
    const point = new Point("p_predictation").floatField("value", data);
    writeApi.writePoint(point);
  });

  await Promise.all(writePromises);
  await writeApi.flush();
  console.log("WRITE FINISHED");

  process.on("exit", () => {
    writeApi.close().then(() => {
      console.log("Ok");
    });
  });
};

module.exports = {
  writeDataWindy,
  writePPrecipitation,
  writeDataWindyHistory,
};
