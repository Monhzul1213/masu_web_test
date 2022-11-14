import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Check, Confirm, PaginationTable , Table} from '../../all/all_m';
import { useTable, usePagination, useRowSelect, useSortBy } from 'react-table';
export function List(props){
  const { onClickAdd, data,  setShow, checked, setChecked } = props;
  const { t, i18n } = useTranslation();
  const [open, setOpen] = useState(false);
  const [columns, setColumns] = useState([]);

  useEffect(() => {
    const customStyle = { width: 40 };
    const style = { display: 'flex', alignItems: 'center', justifyContent: 'center'};
    setColumns([
      {
        id: 'check', noSort: true, isBtn: true, customStyle,
        Header: ({ onClickCheckAll, checked }) => <div style={style}><Check checked={checked} onClick={onClickCheckAll} /></div>,
        Cell: ({ row, onClickCheck }) => <div style={style}><Check checked={row?.original?.checked} onClick={e => onClickCheck(e, row)} /></div>,
      },
      {
        Header: t('page.name'), accessor: 'Name',
         },
    ]);
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [i18n?.language]);

  const confirm = sure => {
    setOpen(false);
    
  };
  const onClickCheckAll = () => {
    setShow(!checked);
    setChecked(!checked);
   
  }

  const onClickCheck = (e, item) => {
    e?.preventDefault();
    setChecked(false);
 
  }
  

  const confirmProps = { open, text: t('page.delete_confirm'), confirm };
  const tableInstance = useTable({ columns, data, autoResetPage: false, initialState: { pageIndex: 0, pageSize: 25 },
    onClickCheckAll, checked, onClickCheck }, useSortBy, usePagination, useRowSelect);
  const tableProps = { tableInstance, onRowClick: onClickAdd};
  return (
    <div>
      {open && <Confirm {...confirmProps} />}
      <div style={{height: 20}} />
      <div className='list_back' id='paging'>
        <Table {...tableProps}/>
      </div>
      <PaginationTable {...tableProps} />
    </div>
  )
}