import * as FileSaver from 'file-saver';
import XLSX from 'sheetjs-style';

import { Button } from '../components/all';

export const ExportExcel = ({ excelData, columns, fileName, text }) => {
  const fileType = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
  const fileExtension = ".xlsx";

  const exportToExcel = async () => {
    let excelData1 = excelData?.map(item => {
      let newItem = {};
      columns?.forEach(col => {
        if(col?.exLabel){
          newItem[col.exLabel] = item[col.accessor]
        }
      });
      return newItem;
    });
    const ws = XLSX.utils.json_to_sheet(excelData1);
    const wb = { Sheets: { data: ws }, SheetNames: ['data'] } ;
    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const data = new Blob([excelBuffer], { type: fileType });
    FileSaver.saveAs(data, fileName + fileExtension);
  }

  return (<Button className='rp_list_select' text={text} onClick={exportToExcel} />);
}

export const ExportExcel2 = ({ excelData, columns, fileName, text }) => {
  const fileType = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
  const fileExtension = ".xlsx";

  const exportToExcel = async () => {
    let excelData1 = excelData?.map(item => {
      let newItem = {};
      columns?.forEach(col => {
        let accessor = col.accessor?.split('.');
        newItem[col.exLabel] = item[accessor[0]][accessor[1]];
      });
      return newItem;
    });
    const ws = XLSX.utils.json_to_sheet(excelData1);
    const wb = { Sheets: { data: ws }, SheetNames: ['data'] } ;
    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const data = new Blob([excelBuffer], { type: fileType });
    FileSaver.saveAs(data, fileName + fileExtension);
  }

  return (<Button className='rp_list_select' text={text} onClick={exportToExcel} />);
}

export const ExportExcel3 = ({ excelData, columns, fileName, text }) => {
  const fileType = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
  const fileExtension = ".xlsx";

  const exportToExcel = async () => {
    let excelData1 = excelData?.map(item => {
      let newItem = {};
      columns?.forEach(col => newItem[col.exLabel] = item[col.accessor]);
      return newItem;
    });
    const ws = XLSX.utils.json_to_sheet(excelData1);
    const wb = { Sheets: { data: ws }, SheetNames: ['data'] } ;
    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const data = new Blob([excelBuffer], { type: fileType });
    FileSaver.saveAs(data, fileName + fileExtension);
  }

  return (<a className='ii_link' text={text} onClick={exportToExcel} >{text}</a>);
}