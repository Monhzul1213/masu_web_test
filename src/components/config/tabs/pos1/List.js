import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useTable, usePagination, useRowSelect, useSortBy } from 'react-table';

import { ButtonRowAdd, Check, Confirm, PaginationTable, Table } from '../../../all';

export function List(props){
  const { onClickAdd, loaded, data, setData, onDelete } = props;
  const { t, i18n } = useTranslation();
  const [show, setShow] = useState(false);
  const [open, setOpen] = useState(false);
  const [columns, setColumns] = useState([]);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    setShow(false);
    setChecked(false);
    return () => {};
  }, [loaded])

  useEffect(() => {
    const style = { display: 'flex', alignItems: 'center' };
    setColumns([
      {
        id: 'check', noSort: true, isBtn: true,
        Header: ({ onClickCheckAll, checked }) => <div style={style}><Check checked={checked} onClick={onClickCheckAll} /></div>,
        Cell: ({ row, onClickCheck }) => <div style={style}><Check checked={row?.original?.checked} onClick={e => onClickCheck(e, row)} /></div>,
      },
      { Header: t('pos.t_name'), accessor: 'descr' },
      { Header: t('pos.t_site'), accessor: 'name' },
      { Header: t('pos.t_status'), accessor: 'statusDescr.valueStr1' },
      { Header: t('pos.t_system'), accessor: 'systemTypeDescr.valueStr1' },
      { Header: t('pos.t_noat'), accessor: 'noat' },
    ]);
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [i18n?.language]);

  const onClickCheckAll = () => {
    setShow(!checked);
    setChecked(!checked);
    data?.map(item => item.checked = !checked);
  }

  const onClickCheck = (e, row) => {
    e?.preventDefault();
    if(row && row?.original){
      setChecked(false);
      let list = data?.map(item => {
        if(item.terminalId === row?.original?.terminalId)
          item.checked = !item.checked;
        return item;
      });
      setData(list);
      let count = list?.filter(item => item.checked)?.length;
      setShow(count ? true : false);
    }
  }

  const onClickDelete = () => setOpen(true);

  const confirm = sure => {
    setOpen(false);
    if(sure){
      let toDelete = [];
      data?.forEach(item => {
        if(item?.checked) toDelete?.push({ siteId: item?.siteId, terminalId: item?.terminalId })
      });
      onDelete(toDelete);
    }
  };

  const addProps = { type: 'pos', onClickAdd, show, onClickDelete };
  const maxHeight = 'calc(100vh - var(--header-height) - var(--page-padding) * 4 - 36px - 10px - var(--pg-height) - 5px)';
  const tableInstance = useTable({ columns, data, autoResetPage: false, initialState: { pageIndex: 0, pageSize: 25 },
    onClickCheckAll, checked, onClickCheck }, useSortBy, usePagination, useRowSelect);
  const tableProps = { tableInstance, onRowClick: onClickAdd };
  const confirmProps = { open, text: t('page.delete_confirm'), confirm };

  return (
    <div className='card_container'>
      {open && <Confirm {...confirmProps} />}
      <div className='pos_row'><ButtonRowAdd {...addProps} /></div>
      <div id='paging' style={{marginTop: 10, overflowY: 'scroll', maxHeight}}>
        <Table {...tableProps} />
      </div>
      <PaginationTable {...tableProps} />
    </div>
  )
}