import React, { useState, useEffect } from 'react';
import { useTable, usePagination, useRowSelect, useSortBy, useExpanded} from 'react-table';
import { useTranslation } from 'react-i18next';

import { Empty1, Money, TableDetail, DynamicFAIcon  } from '../../../components/all/all_m';
import { Header } from './Header';
import { formatNumber } from '../../../../helpers';
import { Detail } from './Detail';

export function List(props){
  const { data, excelName, setError, onSearch, size, setData, autoResetExpanded, isDtl, setIsDtl, onRowClick, isDate, setIsDate } = props;
  const { t, i18n } = useTranslation();
  const [columns, setColumns] = useState([]);
  const [maxHeight, setMaxHeight] = useState('300px');

  useEffect(() => {
    const customStyle = { width: 40 };
    const style = { display: 'flex', alignItems: 'center', justifyContent: 'center'};
    setColumns([
      { id: 'expander', noSort: true, isBtn: true, Header: '', customStyle,
      Cell: ({ row }) => row?.original?.useVariant !== 'Y' ? '' :
        (<div style={style}>
          <DynamicFAIcon {...row.getToggleRowExpandedProps()} name={row.isExpanded ? 'FaChevronUp': 'FaChevronDown'} className='t_expand' />
        </div>)
      },
      { Header: t('report.siteName'), accessor: 'siteName', exLabel:t('report.siteName'), Footer: t('report.total') + data?.length, customStyle : { minWidth: 100 } },
      { Header: t('menu.inventory'), accessor: 'invtName', exLabel:t('menu.inventory'), customStyle : { minWidth: 200 } },
      { Header: t('inventory.barcode'), accessor: 'barCode', exLabel:t('inventory.barcode'), customStyle : { minWidth: 100 }  },
      { Header: t('inventory.category'), accessor: 'categoryName', exLabel:t('inventory.category'), customStyle : { minWidth: 100 }  },
      { Header: <div style={{textAlign: 'right'}}>{t('order.t_qty')}</div>, accessor: 'orderQty', exLabel: t('order.t_qty'), customStyle : { minWidth: 130 }, 
        Cell: props => <div style={{textAlign: 'right', paddingRight: 15}}>{formatNumber(props?.value)}</div>,
        Footer: info => {
          const total = React.useMemo(() =>
            info.rows.reduce((sum, row) => row.values.orderQty + sum, 0),
            [info.rows]  )
          return <><div style={{textAlign: 'right', paddingRight: 15}}>{formatNumber(total)} </div></>
          }
      },
      { Header: <div style={{textAlign: 'right'}}>{t('report_receipt.c_title2')}</div>, accessor: 'salesQty' ?? 0, exLabel: t('report_receipt.c_title2'), customStyle : { minWidth: 100 }, 
      Cell: props => <div style={{textAlign: 'right', paddingRight: 15}}>{formatNumber(props?.value)}</div>,
      },
      { Header: <div style={{textAlign: 'right'}}>{t('order.t_stock')}</div>, accessor: 'qty', exLabel: t('order.t_stock'), customStyle : { minWidth: 100 }, 
        Cell: props => <div style={{textAlign: 'right', paddingRight: 15}}>{formatNumber(props?.value)}</div>,
        Footer: info => {
          const total = React.useMemo(() =>
            info.rows.reduce((sum, row) => row.values.qty + sum, 0),
            [info.rows]  )
          return <><div style={{textAlign: 'right', paddingRight: 15}}>{formatNumber(total)} </div></>
          }
      },
      { Header: <div style={{textAlign: 'right'}}>{t('orders.cost')}</div>, accessor: 'cost', exLabel: t('orders.cost'),customStyle : { minWidth: 120 },
        Cell: props => <div style={{textAlign: 'right', paddingRight: 15}}><Money value={props?.value} fontSize={14} /></div>,
      },
      { Header: <div style={{textAlign: 'right'}}>{t('orders.totalCost')}</div>, accessor: 'totalCost', exLabel: t('orders.totalCost'), customStyle : { minWidth: 120 },
        Cell: props => <div style={{textAlign: 'right', paddingRight: 15}}><Money value={props?.value} fontSize={14} /></div>,
        Footer: info => {
          const total = React.useMemo(() =>
            info.rows.reduce((sum, row) => row.values.totalCost + sum, 0),
            [info.rows]  )
          return <><div style={{textAlign: 'right', paddingRight: 15}}><Money value={total} fontSize={14} /></div></>
          }
      },
      { Header: <div style={{textAlign: 'right'}}>{t('report.price')}</div>, accessor: 'price', exLabel: t('report.price'), customStyle : { minWidth: 90 },
        Cell: props => <div style={{textAlign: 'right', paddingRight: 15}}><Money value={props?.value} fontSize={14} /></div>,
      },
      { Header: <div style={{textAlign: 'right'}}>{t('report_receipt.t_total')}</div>, accessor: 'totalPrice', 
      exLabel: t('report_receipt.t_total'), customStyle : { minWidth: 120 },
      Cell: props => <div style={{textAlign: 'right', paddingRight: 15}}><Money value={props?.value} fontSize={14} /></div>,
      Footer: info => {
        const total = React.useMemo(() =>
          info.rows.reduce((sum, row) => row.values.totalPrice + sum, 0),
          [info.rows]  )
        return <><div style={{textAlign: 'right', paddingRight: 15}}><Money value={total} fontSize={14} /> </div></>
        }
      },
      { Header: t('pos.t_status'), accessor: 'statusName', exLabel:t('pos.t_status') , customStyle : { minWidth: 90 } },
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

  const tableInstance = useTable({ columns, data, autoResetPage: false, autoResetSortBy: false, autoResetExpanded,
    initialState: { pageIndex: 0, pageSize: 100000,  },}, 
    useSortBy, useExpanded, usePagination, useRowSelect);
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
            <TableDetail {...tableProps} /> 
          </div>  
        </div>
      }
    </div>
  );
}