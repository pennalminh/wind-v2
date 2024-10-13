const xlsx = require("xlsx");
const fs = require("fs");
const path = require("path");
require("dotenv").config();

async function writeExcelWithTemplate(data, nameFile) {
  try {
    const excelFilePath = "../BE/sampleTemplate.xlsx";
    const currentDate = new Date();
    currentDate.setHours(currentDate.getHours() + 7);

    const formattedDate = currentDate
      .toISOString()
      .replace(/:/g, "-")
      .split(".")[0];
    const csvFilePath = path.join(
      process.env.PATH_SAVE_CSV,
      `${nameFile}-${formattedDate}.csv`
    );

    // Đọc tệp Excel
    const workbook = xlsx.readFile(excelFilePath);
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];

    // Chuyển đổi sheet thành JSON
    let dataHead = xlsx.utils.sheet_to_json(sheet, { header: 1 });

    // Lấy 8 dòng đầu tiên
    dataHead = dataHead.slice(0, 8);

    // Chuyển đổi dữ liệu thành CSV
    const head = dataHead.map((row) => row.join(",")).join("\n");

    let mainData = [[], [], ["Chu kỳ", "T1 (MW)"]];
    let totalP = 0;

    data.forEach((p, index) => {
      if (!isNaN(p)) {
        totalP += p;
        mainData.push([index + 1, p]);
      } else {
        mainData.push([index + 1, "no data"]);
      }
    });

    mainData.push([
      "A ngày (MWh)",
      data.length == 96 ? totalP / 4 : totalP / 2,
    ]);

    // Convert mainData array to CSV string
    const mainDataCsv = mainData.map((row) => row.join(",")).join("\n");

    // Ghi dữ liệu CSV ra tệp với BOM
    const bom = "\uFEFF"; // BOM cho UTF-8
    fs.writeFileSync(csvFilePath, bom + head + "\n" + mainDataCsv, "utf8");

    console.log("CSV file written successfully");
  } catch (error) {
    console.error(error);
  }
}

async function writeExcelWithTemplateWeek30m(data, nameFile) {
  try {
    const excelFilePath = "../BE/templateWeek30p.xlsx";
    const currentDate = new Date();
    currentDate.setHours(currentDate.getHours() + 7);

    const formattedDate = currentDate
      .toISOString()
      .replace(/:/g, "-")
      .split(".")[0];
    const csvFilePath = path.join(
      process.env.PATH_SAVE_CSV,
      `${nameFile}-${formattedDate}.csv`
    );

    // Đọc tệp Excel
    const workbook = xlsx.readFile(excelFilePath);
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];

    // Chuyển đổi sheet thành JSON
    let dataHead = xlsx.utils.sheet_to_json(sheet, { header: 1 });

    // Lấy 8 dòng đầu tiên
    dataHead = dataHead.slice(0, 13);

    // Chuyển đổi dữ liệu thành CSV
    const head = dataHead.map((row) => row.join(",")).join("\n");

    let mainData = [];

    for (let index = 0; index < 48; index++) {
      mainData.push([
        index + 1,
        0,
        data[index],
        0,
        data[index + 48],
        0,
        data[index + 48 * 2],
        0,
        data[index + 48 * 3],
        0,
        data[index + 48 * 4],
        0,
        data[index + 48 * 5],
        0,
        data[index + 48 * 6],
      ]);
    }

    // mainData.push([
    //   "A ngày (MWh)",
    //   data.length == 96 ? totalP / 4 : totalP / 2,
    // ]);

    // Convert mainData array to CSV string
    const mainDataCsv = mainData.map((row) => row.join(",")).join("\n");

    // Ghi dữ liệu CSV ra tệp với BOM
    const bom = "\uFEFF"; // BOM cho UTF-8
    fs.writeFileSync(csvFilePath, bom + head + "\n" + mainDataCsv, "utf8");

    console.log("CSV file written successfully");
  } catch (error) {
    console.error(error);
  }
}

async function writeExcelWithTemplateWeek60m(data, nameFile) {
  try {
    const excelFilePath = "../BE/templateWeek60p.xlsx";
    const currentDate = new Date();
    currentDate.setHours(currentDate.getHours() + 7);

    const formattedDate = currentDate
      .toISOString()
      .replace(/:/g, "-")
      .split(".")[0];
    const csvFilePath = path.join(
      process.env.PATH_SAVE_CSV,
      `${nameFile}-${formattedDate}.csv`
    );

    // Đọc tệp Excel
    const workbook = xlsx.readFile(excelFilePath);
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];

    // Chuyển đổi sheet thành JSON
    let dataHead = xlsx.utils.sheet_to_json(sheet, { header: 1 });

    // Lấy 8 dòng đầu tiên
    dataHead = dataHead.slice(0, 13);

    // Chuyển đổi dữ liệu thành CSV
    const head = dataHead.map((row) => row.join(",")).join("\n");

    let mainData = [];

    const arrSum = new Array(8).fill(0);

    for (let index = 0; index < 24; index++) {
      const pMax = Math.max(
        data[index],
        data[index + 24],
        data[index + 24 * 2],
        data[index + 24 * 3],
        data[index + 24 * 4],
        data[index + 24 * 5],
        data[index + 24 * 6]
      );

      arrSum[0] += pMax;
      arrSum[1] += data[index];
      arrSum[2] += data[index + 24];
      arrSum[3] += data[index + 24 * 2];
      arrSum[4] += data[index + 24 * 3];
      arrSum[5] += data[index + 24 * 4];
      arrSum[6] += data[index + 24 * 5];
      arrSum[7] += data[index + 24 * 6];

      mainData.push([
        `${index + 1}:00`,
        0.0,
        pMax,
        data[index],
        data[index + 24],
        data[index + 24 * 2],
        data[index + 24 * 3],
        data[index + 24 * 4],
        data[index + 24 * 5],
        data[index + 24 * 6],
      ]);
    }

    mainData.push([
      "A ngày (MWh)",
      [],
      arrSum[0],
      arrSum[1],
      arrSum[2],
      arrSum[3],
      arrSum[4],
      arrSum[5],
      arrSum[6],
      arrSum[7],
    ]);

    // Convert mainData array to CSV string
    const mainDataCsv = mainData.map((row) => row.join(",")).join("\n");

    // Ghi dữ liệu CSV ra tệp với BOM
    const bom = "\uFEFF"; // BOM cho UTF-8
    fs.writeFileSync(csvFilePath, bom + head + "\n" + mainDataCsv, "utf8");

    console.log("CSV file written successfully");
  } catch (error) {
    console.error(error);
  }
}

module.exports = {
  writeExcelWithTemplate,
  writeExcelWithTemplateWeek30m,
  writeExcelWithTemplateWeek60m,
};
