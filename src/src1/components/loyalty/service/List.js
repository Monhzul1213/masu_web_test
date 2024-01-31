import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useTable, usePagination, useRowSelect, useSortBy } from 'react-table';

import { PaginationTable, Table, Check } from '../../../components/all/all_m';


export function List(props){
  const { data, setData, setChecked, setEdited } = props;
  const { t, i18n } = useTranslation();
  const [columns, setColumns] = useState([]);

  useEffect(() => {
        const style = { maxWidth: 72, display: 'flex', alignItems: 'center', justifyContent: 'center' };
    setColumns([
        {  id: 'check', noSort: true, isBtn: true, customStyle: { width: 15 },
        Header: <div style={style}>{t('inventory.t_choose')}</div>,
        Cell: ({ row, onClickCheck }) => <div style={style}><Check checked={row?.original?.checked} onClick={e => onClickCheck(e, row)} /></div>,
        },
      { Header: t('coupon.consumer'), accessor: 'firstName' },
      { Header: t('coupon.phone'), accessor: 'phone'},      
      { Header: t('coupon.email'), accessor: 'email'},      
      { Header: t('coupon.age'), accessor: 'age' },      
      { Header: t('coupon.gender'), accessor: 'gender' }
    ]);
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [i18n?.language]);


  const onClickCheck = (e, item) => {
    e?.preventDefault();
    setChecked(false);
    setEdited && setEdited(true);
    setData(old => old.map((row, index) => {
      if (index === item?.index) return { ...old[item?.index], checked: !row?.checked };
      return row
    }));
  }

  const maxHeight = 'calc(100vh - var(--header-height) - var(--page-padding) * 4 - 150px - var(--pg-height))';
  const tableInstance = useTable({ columns, data, autoResetPage: false, initialState: { pageIndex: 0, pageSize: 25 }, onClickCheck },
    useSortBy, usePagination, useRowSelect);
  const tableProps = { tableInstance };

  return (
    <div >
        <div id='paging' style={{overflowY: 'scroll', maxHeight}}>
          <Table {...tableProps} />
        </div>
        <PaginationTable {...tableProps} />
    </div>
  );
}
