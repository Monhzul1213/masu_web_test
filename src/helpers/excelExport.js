import * as FileSaver from 'file-saver';
import XLSX from 'sheetjs-style';

import { Button } from '../components/all';

export const ExportExcel = ({ excelData, columns, fileName, text, className }) => {
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

  return (<Button className= {className ?? 'rp_list_select'} text={text} onClick={exportToExcel} />);
}

export const ExportExcel2 = ({ excelData, columns, fileName, text }) => {
  const fileType = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
  const fileExtension = ".xlsx";

  const exportToExcel = async () => {
    let excelData1 = excelData?.map(item => {
      let newItem = {};
      columns?.forEach(col => {
        if(col?.exLabel){
          let accessor = col.accessor?.split('.');
          newItem[col.exLabel] = item[accessor[0]][accessor[1]];
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

export const ExportExcel3 = ({ excelData, columns, fileName, text }) => {
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

  return (<a className='ii_link' text={text} onClick={exportToExcel} >{text}</a>);
}

export const InventoryExcel = ({ excelData, columns, fileName, text, width }) => {
  const fileType = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
  const fileExtension = ".xlsx";

  const exportToExcel = async () => {
    let excelData1 = excelData?.map(item => {
      let newItem = {};
      columns?.forEach(col => {
        if(col?.exLabel){
          let accessor = col.accessor?.split('.');
          newItem[col.exLabel] = item[accessor[0]][accessor[1]];
        }
      });
      return newItem;
    });
    const ws = XLSX.utils.json_to_sheet(excelData1);
    ws['!cols'] = width;
    ws["A1"].s = { font: { sz: '14', bold: true }};
    ws["B1"].s = { font: { sz: '14', bold: true }};
    ws["C1"].s = { font: { sz: '14', bold: true }};
    ws["D1"].s = { font: { sz: '14', bold: true }};
    ws["E1"].s = { font: { sz: '14', bold: true }};
    const wb = { Sheets: { data: ws }, SheetNames: ['data'] } ;
    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array",  cellStyles:true });
    const data = new Blob([excelBuffer], { type: fileType });
    FileSaver.saveAs(data, fileName + fileExtension);
  }

  return (<Button className='rp_list_select' text={text} onClick={exportToExcel} />);
}

export const ExportExcel4 = ({ excelData, columns, fileName, text }) => {
  const fileType = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
  const fileExtension = ".xlsx";

  const exportToExcel = async () => {
    let excelData1 = excelData?.map(item => {
      let newItem = {};
      columns?.forEach(col => {
        if(col?.exLabel1){
          newItem[col.exLabel1] = item[col.accessor]
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

  return (<a className='ii_link' text={text} onClick={exportToExcel} >{text}</a>);
}

export const AcctExcel = ({ excelData, columns, fileName, text, width }) => {
  const fileType = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
  const fileExtension = ".xlsx";
 
  const exportToExcel = async () => {
    let excelData1 = excelData?.map(item => {
      let newItem = {};
      columns?.forEach(col => {
        if (col?.exLabel) {
          newItem[col.exLabel] = item[col.accessor];
        }
      });
      return newItem;
    });
 
    if (!excelData1 || excelData1.length === 0) {
      excelData1 = [{}];
      columns?.forEach(col => {
        if (col?.exLabel) {
          excelData1[0][col.exLabel] = "";
        }
      });
    }
 
    const ws = XLSX.utils.json_to_sheet(excelData1);
    ws['!cols'] = width;
 
    const headerStyle = {
      border: {
        top: { style: "thin", color: { rgb: "000000" } },
        bottom: { style: "thin", color: { rgb: "000000" } },
        left: { style: "thin", color: { rgb: "000000" } },
        right: { style: "thin", color: { rgb: "000000" } },
      },
      fill: {
        patternType: "solid",
        fgColor: { rgb: "FFFF00" }
      },
      alignment: {
        horizontal: "center",
        vertical: "center",
      }
    };
   
    const headerKeys = Object.keys(excelData1[0]);
    headerKeys.forEach((key, index) => {
      const cellAddress = XLSX.utils.encode_cell({ r: 0, c: index });
      if (ws[cellAddress]) {
        ws[cellAddress].s = headerStyle;
      }
    });
   
 
    const wb = { Sheets: { data: ws }, SheetNames: ['data'] };
    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array", cellStyles: true });
    const data = new Blob([excelBuffer], { type: fileType });
    FileSaver.saveAs(data, fileName + fileExtension);
  };
 
  return (
    <a className='ii_link' text={text} onClick={exportToExcel}>
      {text}
    </a>
  );
};