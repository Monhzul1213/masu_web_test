import * as FileSaver from 'file-saver';
import XLSX from 'sheetjs-style';

import { Button } from '../components/all';

function getGroupedExport(columns, skipLastNHeaderRows = 0) {
  // Calculate max depth
  let maxDepth = 0;
  function calcDepth(cols, depth) {
    maxDepth = Math.max(maxDepth, depth);
    cols.forEach(col => {
      if (col.columns) calcDepth(col.columns, depth + 1);
    });
  }
  calcDepth(columns, 0);

  // Build header rows and merges
  const headerRows = Array.from({ length: maxDepth + 1 }, () => []);
  const merges = [];
  const flatColumns = [];

  function fillHeaderRows(cols, depth, colIndex) {
    let index = colIndex;
    cols.forEach(col => {
      const groupLabel = col.exLabel || (typeof col.Header === 'string' ? col.Header : '');
      if (col.columns) {
        const span = countLeafColumns(col.columns);
        headerRows[depth][index] = groupLabel;
        for (let i = 1; i < span; i++) headerRows[depth][index + i] = '';
        merges.push({ s: { r: depth, c: index }, e: { r: depth, c: index + span - 1 } });
        fillHeaderRows(col.columns, depth + 1, index);
        index += span;
      } else {
        headerRows[depth][index] = groupLabel;
        // fill blanks for lower rows
        for (let d = depth + 1; d <= maxDepth; d++) headerRows[d][index] = '';
        if (depth < maxDepth) merges.push({ s: { r: depth, c: index }, e: { r: maxDepth, c: index } });
        flatColumns.push({ exLabel: groupLabel, accessor: col.accessor });
        index++;
      }
    });
  }

  function countLeafColumns(cols) {
    return cols.reduce((sum, col) => sum + (col.columns ? countLeafColumns(col.columns) : 1), 0);
  }

  fillHeaderRows(columns, 0, 0);

  // Optionally skip last N header rows (for advanced cases)
  const usedHeaderRows =
    skipLastNHeaderRows > 0
      ? headerRows.slice(0, headerRows.length - skipLastNHeaderRows)
      : headerRows;

  return { headerRows: usedHeaderRows, flatColumns, merges };
}

function getValueByAccessor(obj, accessor) {
  if (!accessor) return '';
  return accessor.split('.').reduce((o, k) => (o ? o[k] : ''), obj);
}
export const ExportListExcel = ({
  excelData,
  columns,
  fileName,
  text,
  className,
  skipLastNHeaderRows = 0, 
}) => {
  const fileType =
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
  const fileExtension = ".xlsx";

  const exportToExcel = () => {
    const { headerRows, flatColumns, merges } = getGroupedExport(
      columns,
      skipLastNHeaderRows
    );

    const dataRows = excelData.map((item) =>
      flatColumns.map((col) => getValueByAccessor(item, col.accessor))
    );

    const sheetData = [...headerRows, ...dataRows];
    const ws = XLSX.utils.aoa_to_sheet(sheetData);
    ws["!merges"] = merges;

    const wb = { Sheets: { data: ws }, SheetNames: ["data"] };
    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const data = new Blob([excelBuffer], { type: fileType });
    FileSaver.saveAs(data, fileName + fileExtension);
  };

  return (
    <button
      className={className ?? "rp_list_select"}
      onClick={exportToExcel}
      type="button"
    >
      {text || "Export Excel"}
    </button>
  );
};


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
    if (!excelData1 || excelData1.length === 0) {
      excelData1 = [{}];
      columns?.forEach(col => {
        if (col?.exLabel) {
          excelData1[0][col.exLabel] = "";
        }
      });
    }
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

    if (!excelData1 || excelData1.length === 0) {
      excelData1 = [{}];
      columns?.forEach(col => {
        if (col?.exLabel) {
          excelData1[0][col.exLabel] = "";
        }
      });
    }
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
    if (!excelData1 || excelData1.length === 0) {
      excelData1 = [{}];
      columns?.forEach(col => {
        if (col?.exLabel) {
          excelData1[0][col.exLabel] = "";
        }
      });
    }
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