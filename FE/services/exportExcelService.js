export class ExportExcelService {
    buildCsvContent(data, name) {
        const now = new Date();
        now.setHours(now.getHours() + 7);

        const dateStr = now.toISOString();

        const headerRows = [
            ["Tới:", "Phòng Điều hành TTĐ", "", "", "Từ:", "Phòng"],
            ["Trung tâm Điều độ HTĐ Quốc gia"],
            ["Tel:", "04 39276162", "-", "Fax:", "04 39276164", "", "", "Tel:", "", "-", "Fax:"],
            ["Email:", "kehoachvanhanh_ttd@nldc.evn.vn", "", "", "", "Email:"],
            [],
            ["BÁO CÁO VẬN HÀNH NGÀY"],
            [],
            ["Đơn vị công bố:", "Nhà máy điện gió Hòa Đông"]
        ];

        const headerCsv = headerRows
            .map(row => row.join(","))
            .join("\n");

        let totalP = 0;

        const mainRows = [
            [],
            [],
            ["Chu kỳ", "T1 (MW)"]
        ];

        data.forEach((p, index) => {
            if (!isNaN(p)) {
            totalP += Number(p);
            mainRows.push([index + 1, p]);
            } else {
            mainRows.push([index + 1, "no data"]);
            }
        });

        mainRows.push([
            "A ngày (MWh)",
            data.length === 96 ? totalP / 4 : totalP / 2
        ]);

        const mainCsv = mainRows
            .map(row => row.join(","))
            .join("\n");

        const BOM = "\uFEFF";

        this.downloadCsv(BOM + headerCsv + "\n" + mainCsv, `BC_VanHanh_Ngay_${name}_${dateStr[0]}.csv`);
    }

    async downloadCsv(csvContent, fileName) {
        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    
        if (window.showSaveFilePicker) {
            try {
                const handle = await window.showSaveFilePicker({
                    suggestedName: fileName,
                    types: [{
                        description: "CSV file",
                        accept: { "text/csv": [".csv"] },
                    }],
                });
                const writable = await handle.createWritable();
                await writable.write(blob);
                await writable.close();
            } catch (err) {
                console.error(err);
            }
        } else {
            const url = URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.setAttribute("href", url);
            link.setAttribute("download", fileName);
            link.style.visibility = "hidden";
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
        }
    }

    async buildWeeklyPowerCsvContent(weeklyPowerData, name) {
        const { weekNumber, year, dailyData } = weeklyPowerData;

        const now = new Date();
        now.setHours(now.getHours() + 7);
        const dateStr = now.toISOString();

        const headerRows = [
            ["Tới:", "Phòng Điều độ", "", "", "", "", "From:", ],
            ["", "Trung tâm điều độ HTĐ miền Nam", "", "", "", "", "", ],
            ["", "Tel: 028.22210221", "", "", "", "", "", "Tel: 02992.22.00.66"],
            ["", "Email: a2.dieudo@gmail.com", "", "", "", "", "", "Email: Diengiolachoa20@tds.com.vn"],
            [`CÔNG BỐ CÔNG SUẤT TUẦN ${weekNumber}/${year}`],
            ["", "Đơn vị công bố:", "", "", "", "", "", ],
            ["", "Thời gian áp dụng:", "", "", "", "", "", `Từ ngày ... đến ...`],
            ["", "1. Công suất khả dụng:"],
        ];

        const dataHeaderRows = [
            ["Giờ", "CSCB (MW)", "CSCB (MW)", "Tổng công suất dự kiến (MW)", "Tổng công suất dự kiến (MW)", "Tổng công suất dự kiến (MW)", "Tổng công suất dự kiến (MW)", "Tổng công suất dự kiến (MW)", "Tổng công suất dự kiến (MW)", "Tổng công suất dự kiến (MW)"],
            ["Giờ", "Pmin", "Pmax", "Thứ hai", "Thứ ba", "Thứ tư", "Thứ năm", "Thứ sáu", "Thứ bảy", "Chủ nhật"],
        ];

        const mainDataRows = dailyData.map((hourData, index) => {
            const hour = Math.floor(index / 2);
            const minute = (index % 2) * 30;
            const formattedHour = `${hour.toString().padStart(2, '0')}h${minute.toString().padStart(2, '0')}`;
            return [formattedHour, (typeof hourData[0] === "number" ? hourData[0] : 0), ...hourData.slice(1).map(val => (typeof val === "number" ? val : ""))];
        });

        const dailyTotals = Array(7).fill(0);
        let pminTotal = 0;
        let pmaxTotal = 0;

        dailyData.forEach(hourData => {
            pminTotal += typeof hourData[0] === "number" ? hourData[0] : 0;
            pmaxTotal += typeof hourData[1] === "number" ? hourData[1] : 0;
            for (let i = 0; i < 7; i++) {
                dailyTotals[i] += typeof hourData[i + 2] === "number" ? hourData[i + 2] : 0;
            }
        });

        const aNgayRow = [
            "A ngày (MWh)",
            pminTotal.toFixed(3),
            pmaxTotal.toFixed(3),
            ...dailyTotals.map(total => (total / 2).toFixed(3)) 
        ];
        
        const finalRows = [...headerRows, [], ...dataHeaderRows, ...mainDataRows, aNgayRow];

        const csvContent = finalRows.map(row => row.join(",")).join("\n");
        const BOM = "\uFEFF";

        this.downloadCsv(BOM + csvContent, `${name}_${dateStr}.csv`);
    }
}

export const exportExcelService = new ExportExcelService();