import React, { useState, useEffect } from 'react';
import { useTable, usePagination, useRowSelect, useSortBy } from 'react-table';
import { useTranslation } from 'react-i18next';

import { Money, FooterTable } from '../../../../components/all';
import { EditableCell1 } from './EditableCell';
import { divide } from '../../../../helpers';
import { EditableCell } from '../../../../components/invt/inventory/add/EditableCell';

export function UpdateList(props){
  const { data, setData } = props;
  const { t, i18n } = useTranslation();
  const [columns, setColumns] = useState([]);

  useEffect(() => {
    setColumns([
      { Header: t('report_receipt.invt'), accessor: 'invtName', customStyle: { width: 200 }, Footer: t('report.total') + data?.length},
      { Header: <div style={{textAlign: 'right'}}>{t('report_receipt.qty')}</div>, accessor: 'qty', isQty: true,
      Cell: props => <EditableCell1 {...props} />, customStyle: { width: 60 }},
      { Header: <div style={{textAlign: 'right'}}>{t('report_receipt.price')}</div>, accessor: 'price' , customStyle: { width: 100, minWidth: 50 },
      Cell: props => <EditableCell {...props} /> , isMoney: true, minWidth: 100
      },
      { Header: <div style={{textAlign: 'right'}}>{t('report_receipt.amt')}</div>, accessor: 'amount' , customStyle: { width: 100 },
      Cell: props => <div style={{textAlign: 'right', paddingRight: 15}}>{<Money value={props?.value} fontSize={14} />}</div>,  
      Footer: info => {
        const total = React.useMemo(() =>
          info.rows.reduce((sum, row) => row.values.amount + sum, 0),
          [info.rows]  )
        return <><div style={{textAlign: 'right', paddingRight: 15}}><Money value={total} fontSize={14} /></div></>
        } }, 
    ])
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [i18n?.language, + data?.length]);

  const updateData = (rowIndex, columnId, value, e) => {
    e?.preventDefault();
    setData(old => old.map((row, index) => {
      if(index === rowIndex){
        let qty = columnId === 'qty' ? parseFloat(value ? value : 0) : old[rowIndex]?.qty;
        let amount = divide(old[rowIndex]?.price, qty, true );
        return { ...old[rowIndex], qty, amount };
      } else {
        return row;
      }
    }));
  }

  const updateMyData = (rowIndex, columnId, value, e) => {
    e?.preventDefault();
    setData(old => old.map((row, index) => {
      if(index === rowIndex){
        let price = columnId === 'price' ? parseFloat(value ? value : 0) : old[rowIndex]?.price;
        let amount = divide(old[rowIndex]?.qty, price, true );
        return { ...old[rowIndex], price, amount };
      } else {
        return row;
      }
    }));
  }

  const tableInstance = useTable({ columns, data,  autoResetPage: true, autoResetSortBy: false,
    initialState: { pageIndex: 0, pageSize: 10000 }, updateData, updateMyData}, useSortBy, usePagination, useRowSelect);
  const tableProps = { tableInstance, hasFooter: true };


  return (
      <div className='table_scroll'>
        <div id='paging' style={{marginTop: 10, overflowY: 'scroll', maxHeight : 500, minWidth: 420}}>
          <FooterTable {...tableProps} />
        </div>
      </div>
  );
}
