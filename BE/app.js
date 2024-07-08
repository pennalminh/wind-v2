const express = require("express");
const path = require("path");
const { writeDataWindyEvery3h } = require("./db/writeData");
const bodyParser = require("body-parser");
const exportExcelRouter = require("./routers/exportExcelRouter");
const dataExportRouter = require("./routers/dataExportRouter");
const { exportExcel96Period } = require("./controllers/exportExcelController");
const schedule = require("node-schedule");
const allowCrossDomain = require("./middlewares/allowCrossDomain");
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

writeDataWindyEvery3h();

app.get("/", (req, res) => {
  res.render("index");
});

app.use("/api", exportExcelRouter);
app.use("/api", dataExportRouter);

// Xuất CSV tự động vào 9h hằng ngày
schedule.scheduleJob("0 9 * * *", async function () {
  exportExcel96Period(req, res);
});

// Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
