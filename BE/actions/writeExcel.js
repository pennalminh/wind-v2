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

    // Ghi dữ liệu CSV ra tệp
    fs.writeFileSync(csvFilePath, head + "\n" + mainDataCsv, "utf8");

    console.log("CSV file written successfully");
  } catch (error) {
    console.error(error);
  }
}

module.exports = {
  writeExcelWithTemplate,
};
