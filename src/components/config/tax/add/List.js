import React, { useState, useEffect } from 'react';
import { useTable, usePagination, useRowSelect, useSortBy } from 'react-table';
import { useTranslation } from 'react-i18next';

import { Table, PaginationTable, Check } from '../../../all';
import { SelectableCell } from './EditableCell';

export function List(props){
  const { data, setData, setEdited, setError, disabled, branch, subBranch, checked, setChecked} = props;
  const { t, i18n } = useTranslation();
  const [columns, setColumns] = useState([]);


  useEffect(() => {
    const style = {display: 'flex', alignItems: 'center', justifyContent: 'center' };
    let columns = [
      {  id: 'check', noSort: true, isBtn: true, width: 50,
      Header: ({ onClickCheckAll, checked }) => <div style={style}><Check checked={checked} onClick={onClickCheckAll} /></div>,
      Cell: ({ row, onClickCheck }) => <div style={style}><Check checked={row?.original?.checked} onClick={e => onClickCheck(e, row)} /></div>,
      },
      { Header: t('inventory.t_site'), accessor: 'name', width: 120 },
      {
        Header: t('shop.city'), accessor: 'branchCode', isBtn: true, width: 120,
        Cell: props => <SelectableCell {...props} data={branch} disabled={disabled} s_value ='branchCode' s_descr ='branchName' />
      },
      {
        Header: t('shop.district'), accessor: 'subBranchCode', isBtn: true, width: 120,
        Cell: (props) => <SelectableCell {...props} data={subBranch?.filter(item => item?.branchCode?.includes(props?.row?.original?.branchCode))} 
        disabled={disabled} s_value ='subBranchCode' s_descr ='subBranchName' />
      },
      {
        Header: <div style={{textAlign: 'right'}}>{t('config.terminal')}</div>, accessor: 'terminalName',
        Cell: ({ value }) => <div style={{textAlign: 'right', paddingRight: 15}}>{value}</div>
      },
      { Header: t('pos.type'), accessor: 'systemTypeName', width: 120 }
    ];
    setColumns(columns);
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [i18n?.language, branch]);

  const onClickCheck = (e, item) => {
    e?.preventDefault();
    setChecked(false);
    setEdited && setEdited(true);
    setData(old => old.map((row, index) => {
      if (index === item?.index) return { ...old[item?.index], checked: !row?.checked };
      return row
    }));
  }

  const onClickCheckAll = e => {
    setChecked(!checked);
    setData(old => old.map((row, index) => {
      return { ...old[index], checked: !checked };
    }));
  }

  const onPressDelete = rowIndex => {
    setData(old => old.map((row, index) => {
      if(index === rowIndex){
        let rowStatus = old[rowIndex]?.rowStatus === 'U' ? 'D' : 'I';
        return {...old[rowIndex], locationX: null, locationY: null, hasLocation: false, coordinate: '', rowStatus };
      } else return row;
    }));
    setEdited && setEdited(true);
    setError && setError(null);
  }

  const updateMyData = async (rowIndex, columnId, value) => {
    setData(old => old.map((row, index) => {
      if(index === rowIndex){
        if(columnId === 'branchCode') return { ...old[rowIndex], [columnId]: value, 'subBranchCode': null  };
        if(columnId === 'subBranchCode') return { ...old[rowIndex], [columnId]: value };
        return { ...old[rowIndex], [columnId]: value };
      }
      return row;
    }));
  }

  const maxHeight = 'calc(100vh - var(--header-height) - var(--page-padding) * 4 - 120px - var(--pg-height))';
  const tableInstance = useTable({ columns, data, autoResetPage: false, initialState: { pageIndex: 0, pageSize: 25,
    sortBy: [{ id: 'name', desc: true }] }, onClickCheck, onClickCheckAll, checked, onPressDelete, updateMyData }, useSortBy, usePagination, useRowSelect);
  const tableProps = { tableInstance };
  // const mapProps = { visible, selected, closeModal };
  
  return (
    <div className='add_back' style={{paddingTop: 0}}>
      {/* <Location {...mapProps} /> */}
      <div id='paging' style={{overflowY: 'scroll', maxHeight}}>
        <Table {...tableProps} />
      </div>
      <PaginationTable {...tableProps} />
    </div>
  );
}