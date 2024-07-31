import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useBlockLayout, useGlobalFilter, usePagination, useResizeColumns, useRowSelect, useSortBy, useTable } from 'react-table';

import { DynamicBSIcon, Money, TableResize, Check } from '../../../../../components/all';


export function InvtList(props){
  const { data, setData, setChecked, checked, setEdited } = props;
  const { t, i18n } = useTranslation();
  const [columns, setColumns] = useState([]);

  useEffect(() => {
    const style = {display: 'flex', alignItems: 'center', justifyContent: 'center' };
    setColumns([
      {  id: 'check', noSort: true, isBtn: true, width: 50,
      Header: ({ onClickCheckAll, checked }) => <div style={style}><Check checked={checked} onClick={onClickCheckAll} /></div>,
      Cell: ({ row, onClickCheck }) => <div style={style}><Check checked={row?.original?.checked} onClick={e => onClickCheck(e, row)} /></div>,
      },
      { Header: t('inventory.title'), accessor: 'invtDescr', customStyle: { minWidth: 150 }, width: 120, minWidth: 90},
      { Header: t('inventory.barcode'), accessor: 'barCode', isText: true, width: 100, minWidth: 90 },
      { Header: t('inventory.category'), accessor: 'categoryName', isBtn: true, width: 100},
      { Header: t('inventory.vendor'), accessor: 'vendName', isBtn: true, width: 100},
      { Header: <div style={{textAlign: 'right'}}>{t('count.isEach')}</div>, accessor: 'isEach', width: 100, minWidth: 80,
        Cell: ({ value }) => <div style={{textAlign: 'center'}}>{ value === 'Y' ? <DynamicBSIcon className='check_icon' name='BsCheckSquareFill' /> : <DynamicBSIcon className='check_icon1' name='BsCheckSquare' />}</div>
      },
      { Header: <div style={{textAlign: 'right'}}>{t('order.t_batch')}</div>, accessor: 'batchQty', width: 100, minWidth: 90,
        Cell: ({ value }) => <div style={{textAlign: 'right', paddingRight: 15}}>{value}</div>},
      { Header: <div style={{textAlign: 'right'}}>{t('inventory.t_stock')}</div>, accessor: 'qty', width: 100, minWidth: 90,
        Cell: ({ value }) => <div style={{textAlign: 'right', paddingRight: 15}}>{value}</div>},
      { Header: <div style={{textAlign: 'right'}}>{t('inventory.cost')}</div>, accessor: 'cost', width: 130, 
        Cell: ({ value }) => <div style={{textAlign: 'right', paddingRight: 15}}>{<Money value={value}/>}</div> },
      { Header: <div style={{textAlign: 'right'}}>{t('inventory.price')}</div>, accessor: 'price', width: 130, 
        Cell: ({ value }) => <div style={{textAlign: 'right', paddingRight: 15}}>{<Money value={value}/>}</div>},
      { Header: <div style={{textAlign: 'right'}}>{t('count.isService')}</div>, accessor: 'isService', width: 100, minWidth: 80,
        Cell: ({ value }) => <div style={{textAlign: 'center'}}>{ value === 'Y' ? <DynamicBSIcon className='check_icon' name='BsCheckSquareFill' /> : <DynamicBSIcon className='check_icon1' name='BsCheckSquare' />}</div>
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

  const tableInstance = useTable({ columns, data, autoResetPage: false, initialState: { pageIndex: 0, pageSize: 10000,  sortBy: [{ id: 'invtDescr', desc: true }] }, onClickCheck, onClickCheckAll, checked },
    useGlobalFilter, useSortBy, usePagination, useRowSelect, useBlockLayout, useResizeColumns);
  const tableProps = { tableInstance };

  return (
    <div >
        <div id='paging' className='table_scroll' style={{overflowY: 'scroll', maxHeight: 400, marginTop: 20}}>
          <TableResize {...tableProps} />
        </div>
        <p className='coupon_text'>{t('report.total')}: {data?.length}</p>
    </div>
  );
}
