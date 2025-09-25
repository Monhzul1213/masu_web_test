import React, { useState, useEffect, useMemo } from 'react';
import { useTable, usePagination, useRowSelect, useSortBy, useExpanded, useResizeColumns} from 'react-table';
import { useTranslation } from 'react-i18next';

import { Empty1, Money, DynamicFAIcon  } from '../../../components/all/all_m';
import { Header } from './Header';
import { formatNumber } from '../../../../helpers';
import { Detail } from './Detail';
import { TableDetailResize } from '../../../../components/all';

export function List(props){
  const { data, excelName, setError, onSearch, size, setData, autoResetExpanded, isDtl, setIsDtl, onRowClick, isDate, setIsDate } = props;
  const { t, i18n } = useTranslation();
  const [columns, setColumns] = useState([]);
  const [maxHeight, setMaxHeight] = useState('300px');

  useEffect(() => {
    const style = { display: 'flex', alignItems: 'center', justifyContent: 'center'};
    setColumns([
      { id: 'expander', noSort: true, isBtn: true, Header: '', width: 30, minWidth: 30,
      Cell: ({ row }) => row?.original?.useVariant !== 'Y' ? '' :
        (<div style={style}>
          <DynamicFAIcon {...row.getToggleRowExpandedProps()} name={row.isExpanded ? 'FaChevronUp': 'FaChevronDown'} className='t_expand' />
        </div>)
      },
      { Header: t('report.siteName'), accessor: 'siteName', exLabel:t('report.siteName'), Footer: t('report.total') + data?.length, width:120, minWidth: 100 },
      { Header: t('menu.inventory'), accessor: 'invtName', exLabel:t('menu.inventory'), width: 250, minWidth: 100, },
      { Header: t('inventory.barcode'), accessor: 'barCode', exLabel:t('inventory.barcode'), width: 120, minWidth: 100},
      { Header: t('inventory.category'), accessor: 'categoryName', exLabel:t('inventory.category'), width: 120, minWidth: 100 },
      { Header: <div style={{textAlign: 'right'}}>{t('order.t_qty')}</div>, accessor: 'orderQty', exLabel: t('order.t_qty'), width: 120, minWidth: 100, 
        Cell: props => <div style={{textAlign: 'right', paddingRight: 10}}>{formatNumber(props?.value)}</div>,
        Footer: info => {
          const total = React.useMemo(() =>
            info.rows.reduce((sum, row) => row.values.orderQty + sum, 0),
            [info.rows]  )
          return <><div style={{textAlign: 'right', paddingRight: 10}}>{formatNumber(total)} </div></>
          }
      },
      { Header: <div style={{textAlign: 'right'}}>{t('report_receipt.c_title2')}</div>, accessor: 'salesQty' ?? 0, exLabel: t('report_receipt.c_title2'), width:120, minWidth: 100, 
      Cell: props => <div style={{textAlign: 'right', paddingRight: 10}}>{formatNumber(props?.value)}</div>,
      },
      { Header: <div style={{textAlign: 'right'}}>{t('order.t_stock')}</div>, accessor: 'qty', exLabel: t('order.t_stock'), width:120, minWidth: 100, 
        Cell: props => <div style={{textAlign: 'right', paddingRight: 10}}>{formatNumber(props?.value)}</div>,
        Footer: info => {
          const total = React.useMemo(() =>
            info.rows.reduce((sum, row) => row.values.qty + sum, 0),
            [info.rows]  )
          return <><div style={{textAlign: 'right', paddingRight: 10}}>{formatNumber(total)} </div></>
          }
      },
      { Header: <div style={{textAlign: 'right'}}>{t('orders.cost')}</div>, accessor: 'cost', exLabel: t('orders.cost'), width:120, minWidth: 100,
        Cell: props => <div style={{textAlign: 'right', paddingRight: 10}}><Money value={props?.value} /></div>,
      },
      { Header: <div style={{textAlign: 'right'}}>{t('orders.totalCost')}</div>, accessor: 'totalCost', exLabel: t('orders.totalCost'), width:120, minWidth: 100,
        Cell: props => <div style={{textAlign: 'right', paddingRight: 10}}><Money value={props?.value} /></div>,
        Footer: info => {
          const total = React.useMemo(() =>
            info.rows.reduce((sum, row) => row.values.totalCost + sum, 0),
            [info.rows]  )
          return <><div style={{textAlign: 'right', paddingRight: 10}}><Money value={total} /></div></>
          }
      },
      { Header: <div style={{textAlign: 'right'}}>{t('report.price')}</div>, accessor: 'price', exLabel: t('report.price'), width:120, minWidth: 100,
        Cell: props => <div style={{textAlign: 'right', paddingRight: 10}}><Money value={props?.value} /></div>,
      },
      { Header: <div style={{textAlign: 'right'}}>{t('report_receipt.t_total')}</div>, accessor: 'totalPrice', 
      exLabel: t('report_receipt.t_total'), width:120, minWidth: 100,
      Cell: props => <div style={{textAlign: 'right', paddingRight: 10}}><Money value={props?.value} /></div>,
      Footer: info => {
        const total = React.useMemo(() =>
          info.rows.reduce((sum, row) => row.values.totalPrice + sum, 0),
          [info.rows]  )
        return <><div style={{textAlign: 'right', paddingRight: 10}}><Money value={total} /> </div></>
        }
      },
      { Header: t('pos.t_status'), accessor: 'statusName', exLabel:t('pos.t_status'), width:120, minWidth: 100},
    ]);
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [i18n?.language, data?.length]);

  useEffect(() => {
    if(size?.width >= 920) setMaxHeight('calc(100vh - var(--header-height) - var(--page-padding) * 6 - 67px )');
    else if(size?.width < 920 && size?.width >= 620)
      setMaxHeight('calc(100vh - var(--header-height) - var(--page-padding) * 6 - 123px )');
    else if(size?.width < 620)
      setMaxHeight('calc(100vh - var(--header-height) - var(--page-padding) * 4 - 160px )');
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [size?.width]);

  const updateMyData = async (row, column, value, e, invvar, isEdit, isExpand) => {
    let item = data[row]?.msInventory;
    let newData = { invtID: item?.invtId, categoryID: item?.categoryId, cost: item?.cost };
    if(column === 'msInventory.categoryId') newData.categoryID = value;
    else if(column === 'msInventory.cost') newData.cost = parseFloat(value ? value : 0);
    else if(invvar) newData.invvar = invvar;
    // const response = await updateInventory(newData, isEdit, isExpand);
    // return response;
  }
  const defaultColumn = useMemo(() => ({ minWidth: 40, width: 150, maxWidth: 400 }), []);
  const tableInstance = useTable({ columns, data, defaultColumn, autoResetPage: false, autoResetSortBy: false, autoResetExpanded,
    initialState: { pageIndex: 0, pageSize: 100000,  },}, 
    useSortBy, useExpanded, usePagination, useRowSelect, useResizeColumns);
  const tableProps = { tableInstance, Detail: props => <Detail {...props} updateData={updateMyData} />,
    detailName: 'dtl', colSpan: 9, hasFooter: true, onRowClick };
  const filterProps = { columns, data, setData, excelName, setError, onSearch , size, isDtl, setIsDtl, isDate, setIsDate };
  const emptyProps = { icon: 'MdSchedule', type: 'time', noDescr: true };

  return (
    <div>
      <Header {...filterProps} />
      {!data?.length ? <Empty1 {...emptyProps} /> : 
        <div style={{overflowX: 'scroll'}}>
          <div className='table_scroll' id='paging' style={{marginTop: 10, overflow: 'scroll', maxHeight, minWidth: 720}}>
            <TableDetailResize {...tableProps} /> 
          </div>  
        </div>
      }
    </div>
  );
}