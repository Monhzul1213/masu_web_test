import React, { useState, useEffect } from 'react';
import { useTable, useRowSelect, useSortBy } from 'react-table';
import { useTranslation } from 'react-i18next';

import { TableRow, Money } from '../../../../components/all';
import { formatNumber } from '../../../../helpers';

export function Detail(props){
  const { data } = props;
  const [columns, setColumns] = useState([]);
  const { t, i18n } = useTranslation();

  useEffect(() => {
    const customStyle = { width: 40 };
    setColumns([
      { id: 'expander', noSort: true, customStyle, Header: '', Cell: '' },
      { Header: t('report.siteName'), accessor: '', exLabel:t('report.siteName'), Footer: t('report.total'), customStyle : { width: 140 }},
      { Header: t('menu.inventory'), accessor: 'invtName', exLabel:t('menu.inventory'), customStyle : { width: 240 } },
      { Header: t('inventory.barcode'), accessor: 'barCode', exLabel:t('inventory.barcode'), customStyle : { width: 140 }  },
      { Header: <div style={{textAlign: 'right'}}>{t('order.t_qty')}</div>, accessor: 'orderQty', exLabel: t('order.t_qty'), customStyle : { width: 140 }, 
        Cell: props => <div style={{textAlign: 'right', paddingRight: 10}}>{formatNumber(props?.value)}</div>
      },
      { Header: <div style={{textAlign: 'right'}}>{t('report_receipt.c_title2')}</div>, accessor: 'salesQty', exLabel: t('order.t_qty'), customStyle : { width: 140 }, 
      Cell: props => <div style={{textAlign: 'right', paddingRight: 10}}>{formatNumber(props?.value)}</div>,
      },
      { Header: <div style={{textAlign: 'right'}}>{t('order.t_stock')}</div>, accessor: 'qty', exLabel: t('order.t_stock'), customStyle : { width: 140 }, 
        Cell: props => <div style={{textAlign: 'right', paddingRight: 5}}>{formatNumber(props?.value)}</div>
      },
      { Header: <div style={{textAlign: 'right'}}>{t('orders.cost')}</div>, accessor: 'cost', exLabel: t('orders.cost'), customStyle : { width: 140 },
        Cell: props => <div style={{textAlign: 'right', paddingRight: 5}}><Money value={props?.value} fontSize={14} /></div>,
      },
      { Header: <div style={{textAlign: 'right'}}>{t('orders.totalCost')}</div>, accessor: 'totalCost', exLabel: t('orders.totalCost'), customStyle : { width: 140 },
        Cell: props => <div style={{textAlign: 'right', paddingRight: 5}}><Money value={props?.value} fontSize={14} /></div>
      },
    ]);
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [i18n?.language]);

  const tableInstance = useTable({ columns, data, autoResetPage: false }, useSortBy, useRowSelect);
  const tableProps = { tableInstance, noHeader: true };
  const maxHeight = 'calc(70vh)';

  return (
    <div id='paging' style={{overflowY: 'scroll', maxHeight}}>
      <TableRow {...tableProps} />
    </div>
  )
}