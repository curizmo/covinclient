import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx-js-style';
import { excelTitleCell, excelLabTitleCell } from '../constants/index';

const Headerstyle = {
  font: { sz: 12, bold: true, color: '#FF00FF' },
  fill: {
    fgColor: {
      theme: 8,
      tint: 0.3999755851924192,
      rgb: 'FBE5D6',
    },
  },
  wch: 16,
  border: {
    top: { style: 'thin', color: '#000000' },
    bottom: { style: 'thin', color: '#000000' },
    right: { style: 'thin', color: '#000000' },
    left: { style: 'thin', color: '#000000' },
  },
};

export const exportToCSV = (csvData) => {
  if (csvData.length !== 0) {
    const identifier = new Date().getTime();
    const fileName = `${identifier}`;
    const fileType =
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
    const fileExtension = '.xlsx';
    const ws = XLSX.utils.json_to_sheet(csvData);
    excelTitleCell.map((cell) => {
      ws[cell].s = Headerstyle;
    });
    const wb = {
      Sheets: { vitals: ws },
      SheetNames: ['vitals'],
    };
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const vitals = new Blob([excelBuffer], { type: fileType });
    FileSaver.saveAs(vitals, fileName + fileExtension);
  }
};

export const exportIndividualVitalsToCSV = (csvVitalsData, csvLabData) => {
  if (csvVitalsData.length !== 0) {
    const identifier = new Date().getTime();
    const fileName = `${identifier}`;
    const fileType =
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
    const fileExtension = '.xlsx';
    const ws = XLSX.utils.json_to_sheet(csvVitalsData);
    excelTitleCell.map((cell) => {
      ws[cell].s = Headerstyle;
    });
    const wsLab = XLSX.utils.json_to_sheet(csvLabData);
    if (csvLabData.length !== 0) {
      excelLabTitleCell.map((cell) => {
        wsLab[cell].s = Headerstyle;
      });
    }
    const wb = {
      Sheets: { vitals: ws, LabResults: wsLab },
      SheetNames: ['vitals', 'LabResults'],
    };
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const vitals = new Blob([excelBuffer], { type: fileType });
    FileSaver.saveAs(vitals, fileName + fileExtension);
  }
};
