import React, { useState, useEffect } from 'react';
import { useTable, usePagination, useRowSelect, useSortBy } from 'react-table';
import { useTranslation } from 'react-i18next';

import { PaginationTable, Table } from '../../../all';
import { SelectableCell } from './EditableCell';

export function List(props){
  const { data, setData, setEdited, setError, disabled } = props;
  const { t, i18n } = useTranslation();
  const [columns, setColumns] = useState([]);
  const [statusData] = useState(t('count.status2'))

  useEffect(() => {
    let columns = [
      {
        Header: t('order.status'), accessor: 'status', isBtn: true, width: 150,
        Cell: props => <SelectableCell {...props} data={statusData}/>
      },
      { Header: t('inventory.t_site'), accessor: 'siteName' },
      { Header: t('shop.city'), accessor: 'branchName' },
      { Header: t('shop.district'), accessor: 'subBranchName' },
      { Header: t('config.terminal'), accessor: 'terminalName' },
      { Header: t('pos.type'), accessor: 'systemTypeName' },
      // {
      //   Header: t('tax.file'), accessor: 'fileName', isBtn: true,
      //   Cell: ({ value, onUpload, row }) => <UploadFile disabled={disabled} value={value} onUpload={file => onUpload(file, row?.index)} types={zipTypes} />
      // }
    ];
    // if(disabled && status?.value === 4){
    //   columns.push({ Header: t('tax.file'), accessor: 'fileName', Cell: ({ value }) => <div className='cell_file'>{value ?? 'Upload'}</div> });
    // } else if(status?.value === 4){
    //   columns.push({
    //     Header: t('tax.file'), accessor: 'fileName', isBtn: true,
    //     Cell: ({ value, onUpload, row }) => <UploadFile value={value} onUpload={file => onUpload(file, row?.index)} types={zipTypes} />
    //   })
    // }
    setColumns(columns);
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [i18n?.language, disabled]);

  const onUpload = (file, rIndex) => {
    setData(old => old.map((row, index) => {
      if(index === rIndex){
        let fileRaw = { FileData: file?.str64, FileType: file?.type };
        return { ...old[rIndex], fileName: file?.name, fileRaw };
      } else return row;
    }));
    setEdited && setEdited(true);
    setError && setError(null);
  }
  
  const updateMyData = async (rowIndex, columnId, value) => {
    setData(old => old.map((row, index) => {
      if(index === rowIndex){
        if(columnId === 'status') return { ...old[rowIndex], [columnId]: value  };
        return { ...old[rowIndex], [columnId]: value };
      }
      return row;
    }));
  }

  const maxHeight = 'calc(100vh - var(--header-height) - var(--page-padding) * 4 - 120px - var(--pg-height))';
  const tableInstance = useTable({ columns, data, autoResetPage: false, initialState: { pageIndex: 0, pageSize: 25,
    sortBy: [{ id: 'siteName', desc: true }] }, onUpload, updateMyData }, useSortBy, usePagination, useRowSelect);
  const tableProps = { tableInstance };

  return (
    <div className='add_back' style={{paddingTop: 0, overflowX: 'scroll'}}>
      <div id='paging' style={{overflowY: 'scroll', minWidth: 780, maxHeight}}>
        <Table {...tableProps} />
      </div>
      <PaginationTable {...tableProps} />
    </div>
  );
}