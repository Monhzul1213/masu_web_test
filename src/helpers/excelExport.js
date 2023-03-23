import * as FileSaver from 'file-saver';
import XLSX from 'sheetjs-style';

import { Button } from '../components/all';

export const ExportExcel = ({ excelData, columns, fileName, text }) => {
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

  return (<Button className='rp_list_select' text={text} onClick={exportToExcel} />);
}