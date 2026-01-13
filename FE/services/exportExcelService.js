export class ExportExcelService {
    buildCsvContent(data, name) {
        const now = new Date();
        now.setHours(now.getHours() + 7);

        const dateStr = now.toISOString().split('T');

        const headerRows = [
            ['Tới:', 'Phòng Điều hành TTĐ', '', '', 'Từ:', 'Phòng'],
            ['Trung tâm Điều độ HTĐ Quốc gia'],
            ['Tel:', '04 39276162', '-', 'Fax:', '04 39276164', '', '', 'Tel:', '', '-', 'Fax:'],
            ['Email:', 'kehoachvanhanh_ttd@nldc.evn.vn', '', '', '', 'Email:'],
            [],
            ['BÁO CÁO VẬN HÀNH NGÀY'],
            [],
            ['Đơn vị công bố:', 'Nhà máy điện gió Hòa Đông']
        ];

        const headerCsv = headerRows
            .map(row => row.join(','))
            .join('\n');

        let totalP = 0;

        const mainRows = [
            [],
            [],
            ['Chu kỳ', 'T1 (MW)']
        ];

        data.forEach((p, index) => {
            if (!isNaN(p)) {
            totalP += Number(p);
            mainRows.push([index + 1, p]);
            } else {
            mainRows.push([index + 1, 'no data']);
            }
        });

        mainRows.push([
            'A ngày (MWh)',
            data.length === 96 ? totalP / 4 : totalP / 2
        ]);

        const mainCsv = mainRows
            .map(row => row.join(','))
            .join('\n');

        const BOM = '\uFEFF';

        BOM + headerCsv + '\n' + mainCsv;

        this.downloadCsv(BOM + headerCsv + '\n' + mainCsv, `BC_VanHanh_Ngay_${name}_${dateStr}.csv`);
    }

    async downloadCsv(csvContent, fileName) {
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    
        if (window.showSaveFilePicker) {
            try {
                const handle = await window.showSaveFilePicker({
                    suggestedName: fileName,
                    types: [{
                        description: 'CSV file',
                        accept: { 'text/csv': ['.csv'] },
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
            const link = document.createElement('a');
            link.setAttribute('href', url);
            link.setAttribute('download', fileName);
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
        }
    }
}

export const exportExcelService = new ExportExcelService();
