import React, { useState, useEffect } from 'react';
import { useTable, usePagination, useRowSelect, useSortBy } from 'react-table';
import { useTranslation } from 'react-i18next';

import { zipTypes } from '../../../../helpers';
import { PaginationTable, Table, UploadFile } from '../../../all';

export function List(props){
  const { data, setData, setEdited, setError, disabled, status } = props;
  const { t, i18n } = useTranslation();
  const [columns, setColumns] = useState([]);

  useEffect(() => {
    let columns = [
      { Header: t('inventory.t_site'), accessor: 'siteName' },
      { Header: t('tax.location'), accessor: 'district' },
      { Header: t('pos.title'), accessor: 'descr' },
      {
        Header: t('tax.coordinate'), accessor: 'coordinate', customStyle: { width: 200 },
        Cell: ({ value }) => <div className='co_coord_text'>{value}</div>
      },
      // {
      //   Header: t('tax.file'), accessor: 'fileName', isBtn: true,
      //   Cell: ({ value, onUpload, row }) => <UploadFile disabled={disabled} value={value} onUpload={file => onUpload(file, row?.index)} types={zipTypes} />
      // }
    ];
    if(disabled && status?.value === 4){
      columns.push({ Header: t('tax.file'), accessor: 'fileName', Cell: ({ value }) => <div className='cell_file'>{value ?? 'Upload'}</div> });
    } else if(status?.value === 4){
      columns.push({
        Header: t('tax.file'), accessor: 'fileName', isBtn: true,
        Cell: ({ value, onUpload, row }) => <UploadFile value={value} onUpload={file => onUpload(file, row?.index)} types={zipTypes} />
      })
    }
    setColumns(columns);
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [i18n?.language, disabled, status?.value]);

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
  
  const maxHeight = 'calc(100vh - var(--header-height) - var(--page-padding) * 4 - 120px - var(--pg-height))';
  const tableInstance = useTable({ columns, data, autoResetPage: false, initialState: { pageIndex: 0, pageSize: 25,
    sortBy: [{ id: 'siteName', desc: true }] }, onUpload }, useSortBy, usePagination, useRowSelect);
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