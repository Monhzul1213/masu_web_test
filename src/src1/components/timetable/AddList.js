import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useTable, usePagination, useRowSelect, useSortBy } from 'react-table';

import { DynamicAIIcon, Check, NoHeaderTable } from "../all/all_m";
import { timeList1 } from "../../../helpers";
import { SelectableCell } from "./EditableCell";

export function AddList(props) {
  const { data, setData, setChecked } = props;
  const { i18n } = useTranslation();
  const [columns, setColumns] = useState([]);
  const [data1, setData1] = useState([]);


  useEffect(() => {
    const style = { display: 'flex', alignItems: 'center', justifyContent: 'center', maxWidth: 72 };
    setColumns([
      {
        id: 'check', noSort: true, isBtn: true, customStyle: { width: 40 },
        Cell: ({ row, onClickCheck }) =>  !row?.original?.new ? <div style={style}><Check checked={row?.original?.checked} onClick={e => onClickCheck(e, row)} /></div> : '',
      },
      { accessor: 'date', customStyle: { width: 300 },
       Cell: props => <div >{props?.value.toLocaleDateString("mn-MN", { weekday: "long", year: "numeric", month: "2-digit", day: "2-digit"})}</div> 
      },
      { accessor: 'beginTime', isBtn: true, width: 70,
        Cell: props => <SelectableCell {...props} data={timeList1} initialValue='09:00' />
      },
      { accessor: 'endTime', isBtn: true, width: 70, 
        Cell: props => <SelectableCell {...props} data={timeList1} initialValue='18:00'/>
      },
      { accessor: 'add', isBtn: true, customStyle: { width: 10 },
        Cell:  ({ row, onClickAdd }) => <div style={style}> { row?.original?.new ? <DynamicAIIcon name ='AiOutlineMinusCircle' className='tm_icon1' onClick={e => onClickDelete(e, row)} /> 
                                                              : <DynamicAIIcon name ='AiOutlinePlusCircle' className='tm_icon' onClick={e => onClickAdd(e, row)} />}</div>  
      }
    ]);
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [i18n?.language]);

  const onClickCheck = (e, item) => {
    e?.preventDefault();
    setChecked(false);
    setData(old => old.map((row, index) => {
      if (index === item?.index) return { ...old[item?.index], checked: !row?.checked };
      return row
    }));
  }

  const onClickAdd = (e, row) => {
    let data1 = [...data];
    data1.splice(row?.index + 1, 0, {...row.original, new: true});
    setData(data1);
    setData1(data1)
    console.log(data1)
  }  

  const onClickDelete = (e, row) => {
    let data2 = [...data1]; 
    data2.splice(row?.index , 1, {...row?.original});
    setData(data2)
    // console.log(data2)
    // let fruits = ['Apple', 'Banana', 'Mango', 'Orange']
    // let removed = fruits.splice(row?.index, 1);
    console.log(data1)
  }

  const updateMyData = async (rowIndex, columnId, value) => {
    setData(old => old.map((row, index) => {
      if(index === rowIndex){
        if(columnId === 'beginTime') return { ...old[rowIndex], [columnId]: value };
        return { ...old[rowIndex], [columnId]: value };
      }
      return row
    }));
  }

  const tableInstance = useTable({ columns, data, autoResetPage: true, autoResetSortBy: false, 
    initialState: { pageIndex: 0, pageSize: 100 }, onClickCheck, onClickAdd, updateMyData}, useSortBy, usePagination, useRowSelect);
  const tableProps = { tableInstance};
  return (
    <div>
      {data?.length && <NoHeaderTable {...tableProps}/>}
    </div>
  );
}
