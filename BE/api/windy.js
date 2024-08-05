const axios = require("axios");
require("dotenv").config();

const url = process.env.URL_API_WINDY;
const lat = process.env.LAT;
const long = process.env.LONG;
const key = process.env.TOKEN_API_WINDY;

// const body = {
//   lat: process.env.LAT,
//   lon: process.env.LONG,
//   model: "gfs",
//   parameters: ["wind"],
//   levels: ["surface"],
//   key: process.env.TOKEN_API_WINDY,
// };

const callAPIWindy = async () => {
  try {
    const response = await axios.get(
      `${url}?lat=${lat}&lon=${long}&appid=${key}`
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

module.exports = {
  callAPIWindy,
};
