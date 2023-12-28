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
  const [initialValue, setInitialValue] = useState('09:00');

  // useEffect(() => {
  //   data?.map(item => {
  //     setInitialValue(item?.endTime ? item?.endTime : '11:00')
  //   })
  // }, [])

  useEffect(() => {
    const style = { display: 'flex', alignItems: 'center', justifyContent: 'center', maxWidth: 72 };
    setColumns([
      {
        id: 'check', noSort: true, isBtn: true, customStyle: { width: 40 },
        Cell: ({ row, onClickCheck }) =>  <div style={style}><Check checked={row?.original?.checked} onClick={e => onClickCheck(e, row)} /></div>,
      },
      { accessor: 'date', customStyle: { width: 300 },
       Cell: props => <div >{props?.value.format("dddd") === 'Monday' ? 'Даваа   ' + props?.value.format("YYYY.MM.DD") 
                            : props?.value.format("dddd") === 'Tuesday' ? 'Мягмар   ' + props?.value.format("YYYY.MM.DD")
                            : props?.value.format("dddd") === 'Wednesday' ? 'Лхагва   ' + props?.value.format("YYYY.MM.DD")
                            : props?.value.format("dddd") === 'Thursday' ? 'Пүрэв   ' + props?.value.format("YYYY.MM.DD")
                            : props?.value.format("dddd") === 'Friday' ? 'Баасан   ' + props?.value.format("YYYY.MM.DD")
                            : props?.value.format("dddd") === 'Saturday' ? 'Бямба   ' + props?.value.format("YYYY.MM.DD")
                            : props?.value.format("dddd") === 'Sunday' ? 'Ням   ' + props?.value.format("YYYY.MM.DD") : ''  }</div> 
      },
      { accessor: 'beginTime', isBtn: true, width: 70,
        Cell: props => <SelectableCell {...props} data={timeList1} initialValue= {props?.row?.original?.endTime ? props?.row?.original?.endTime : initialValue}/>
      },
      { accessor: 'endTime', isBtn: true, width: 70, 
        Cell: props => <SelectableCell {...props} data={timeList1} initialValue='18:00'/>
      },
      { accessor: 'add', isBtn: true, customStyle: { width: 10 },
        Cell:  ({ row, onClickAdd }) => <div style={style}> { row?.original?.new ? <DynamicAIIcon name ='AiOutlineMinusCircle' className='tm_icon1' onClick={e => onClickAdd(e, row, row?.original?.minus)} /> 
                                                               : <DynamicAIIcon name ='AiOutlinePlusCircle' className='tm_icon' onClick={e => onClickAdd(e, row)} />}</div>  
      },
      // { accessor: 'delete', isBtn: true, customStyle: { width: 10 },
      //   Cell:  ({ row, onClickDelete }) => <div style={style}> { <DynamicAIIcon name ='AiOutlineMinusCircle' className='tm_icon1' onClick={e => onClickDelete(e, row, row?.original?.minus)} /> 
      //                                                         //: <DynamicAIIcon name ='AiOutlinePlusCircle' className='tm_icon' onClick={e => onClickAdd(e, row)} />
      //                                                       }</div>  
      // }
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

  const onClickAdd = (e, row, minus) => {
    if(!minus){
      let data1 = [...data];
      data1.splice(row?.index + 1, 0, {...row.original, new: true , minus: true, beginTime: row.original?.endTime ?? '10:00'});
      setData(data1);
      setInitialValue(data1[row?.index].endTime ?? '03:00') 
     } else {
      let data1 = [...data];
      data1.splice(row?.index, 1);
      setData(data1);
    }
  } 
  
  const onClickDelete = (e, row, minus) => {
      let data1 = [...data];
      data1.splice(row?.index, 1);
      setData(data1);
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
    initialState: { pageIndex: 0, pageSize: 100 }, onClickCheck, onClickAdd, updateMyData, onClickDelete}, useSortBy, usePagination, useRowSelect);
  const tableProps = { tableInstance};

  return (
    <div>
      {data?.length && <NoHeaderTable {...tableProps}/>}
    </div>
  );
}
