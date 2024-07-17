"use strict";

const { InfluxDB, Point } = require("@influxdata/influxdb-client");
const schedule = require("node-schedule");
const { callAPIWindy } = require("../api/windy");
const { caculatorWindSpeed } = require("../common/fomular");
require("dotenv").config();

const url = process.env.URL_INFLUX_DB;
const token = process.env.INFLUXDB_TOKEN;
const org = process.env.ORGANIZATION_ID;
const bucket = process.env.INFLUX_BUCKET;
const influxMeasurementWindAPI = process.env.INFLUX_MEASUREMENT_WINDY_API;

// Instantiate the InfluxDB client
const influxDB = new InfluxDB({ url, token });

// Create a write client from the getWriteApi method, providing your org and bucket.

// Apply default tags to all points if needed
const writeDataWindyEvery3h = async () => {
  const writeApi = influxDB.getWriteApi(org, bucket);
  schedule.scheduleJob("0 */3 * * *", async function () {
    const response = await callAPIWindy();
    const wind_u = response.data["wind_u-surface"][1];
    const wind_v = response.data["wind_v-surface"][1];
    const windSpeed = caculatorWindSpeed(wind_u, wind_v);

    const point = new Point(influxMeasurementWindAPI).floatField(
      "value",
      windSpeed
    );

    writeApi.writePoint(point);

    await writeApi.flush();
    console.log("WRITE FINISHED");

    process.on("exit", () => {
      writeApi.close().then(() => {
        console.log("Ok");
      });
    });
  });
};

const writePPrecipitation = async (arrData) => {
  const writeApi = influxDB.getWriteApi(org, bucket);

  const writePromises = arrData.map(async (data) => {
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
  writeDataWindyEvery3h,
  writePPrecipitation,
};
