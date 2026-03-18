const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const exportExcelRouter = require("./routers/exportExcelRouter");
const dataExportRouter = require("./routers/dataExportRouter");
const windyRouter = require("./routers/windyRouter");
const monthlyReportRouter = require("./routers/monthlyReportRouter");
const schedule = require("node-schedule");
const allowCrossDomain = require("./middlewares/allowCrossDomain");
const { exportPowerForeCastByPeriodInDay } = require("./actions");
const { writeExcelWithTemplate } = require("./actions/writeExcel");
const app = express();

require("dotenv").config();

// Middleware
app.use(allowCrossDomain);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.json());

// View Engine
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.get("/", (req, res) => {
  res.render("index");
});

app.use("/api", exportExcelRouter);
app.use("/api", dataExportRouter);
app.use("/api", windyRouter);
app.use("/api", monthlyReportRouter);

// Xuất CSV tự động vào 9h hằng ngày
schedule.scheduleJob(
  {
    hour: 9,
    minute: 0,
    tz: "Asia/Ho_Chi_Minh",
  },
  async function () {
    const arrP = await exportPowerForeCastByPeriodInDay(96);
    writeExcelWithTemplate(arrP, "Dự báo trong ngày");
  },
);

// Ghi lại dữ liệu dự đoán vào 00h
// schedule.scheduleJob(
//   {
//     hour: 0,
//     minute: 13,
//     tz: "Asia/Ho_Chi_Minh",
//   },
//   async function () {
//     const arrP = await exportPowerForeCastByPeriodInDay(96);
//     await writePPrecipitation(arrP);
//   }
// );

// Server
const PORT = process.env.PORT || 3000;
const os = require("os");

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  const networkInterfaces = os.networkInterfaces();
  for (const interfaceName in networkInterfaces) {
    const networkInterface = networkInterfaces[interfaceName];
    for (const iface of networkInterface) {
      if (iface.family === "IPv4" && !iface.internal) {
        console.log(`Accessible at: http://${iface.address}:${PORT}`);
      }
    }
  }
});
