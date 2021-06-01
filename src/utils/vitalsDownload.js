import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx-js-style';
import { excelTitleCell } from '../constants/index';

export const exportToCSV = (csvData) => {
  const identifier = new Date().getTime();
  const fileName = `${identifier}`;
  const fileType =
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
  const fileExtension = '.xlsx';
  const ws = XLSX.utils.json_to_sheet(csvData);
  excelTitleCell.map((cell) => {
    ws[cell].s = {
      font: { sz: 12, bold: true, color: '#FF00FF' },
      fill: {
        fgColor: {
          theme: 8,
          tint: 0.3999755851924192,
          rgb: 'FBE5D6',
        },
      },
      border: {
        top: { style: 'thin', color: 'FBE5D6' },
        bottom: { style: 'thin', color: 'FBE5D6' },
        right: { style: 'thin', color: 'FBE5D6' },
        left: { style: 'thin', color: 'FBE5D6' },
      },
    };
  });
  const wb = { Sheets: { vitals: ws }, SheetNames: ['vitals'] };
  const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
  const vitals = new Blob([excelBuffer], { type: fileType });
  FileSaver.saveAs(vitals, fileName + fileExtension);
};
