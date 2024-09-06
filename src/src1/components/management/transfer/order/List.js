import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useTable, usePagination, useRowSelect, useSortBy } from 'react-table';

import { Table, Check, Money } from '../../../../../components/all';


export function List(props){
  const { data, setData, setChecked, checked, setEdited } = props;
  const { t, i18n } = useTranslation();
  const [columns, setColumns] = useState([]);

  useEffect(() => {
    const style = { maxWidth: 72, display: 'flex', alignItems: 'center', justifyContent: 'center' };
    setColumns([
      {  id: 'check', noSort: true, isBtn: true, customStyle: { width: 15 },
      Header: ({ onClickCheckAll, checked }) => <div style={style}><Check checked={checked} onClick={onClickCheckAll} /></div>,
      Cell: ({ row, onClickCheck }) => <div style={style}><Check checked={row?.original?.checked} onClick={e => onClickCheck(e, row)} /></div>,
      },
      { Header: t('inventory.title'), accessor: 'invtName' }, 
      { Header: <div style={{textAlign: 'right'}}>{t('order.t_qty')}</div>, accessor: 'orderQty', width: 80, minWidth: 50,
      Cell: props =>  <div style={{textAlign: 'right', paddingRight: 15}}>{props?.value}</div> 
      },   
      { Header: <div style={{textAlign: 'right'}}>{t('report.price')}</div>, accessor: 'orderPrice', width: 130, minWidth: 70,
      Cell: props => <div style={{textAlign: 'right', paddingRight: 15}}><Money value={props?.value} fontSize={14} /></div>     
      },      
      { Header: <div style={{textAlign: 'right'}}>{t('report_receipt.t_total')}</div>, accessor: 'orderAmount', width: 130, minWidth: 70,
      Cell: props => <div style={{textAlign: 'right', paddingRight: 15}}><Money value={props?.value} fontSize={14} /></div>     
      },    
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

  const onClickCheckAll = e => {
    setChecked(!checked);
    setData(old => old.map((row, index) => {
      return { ...old[index], checked: !checked };
    }));
  }

  const maxHeight = 'calc(100vh - var(--header-height) - var(--page-padding) * 4 - 150px - var(--pg-height))';
  const tableInstance = useTable({ columns, data, autoResetPage: false, initialState: { pageIndex: 0, pageSize: 10000 }, onClickCheck, onClickCheckAll, checked },
    useSortBy, usePagination, useRowSelect);
  const tableProps = { tableInstance };

  return (
    <div >
        <div id='paging' style={{overflowY: 'scroll', maxHeight}}>
          <Table {...tableProps} />
        </div>
        <p className='coupon_text'>{t('report.total')}: {data?.length}</p>
    </div>
  );
}
