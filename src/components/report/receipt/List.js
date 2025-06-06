import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useTable, usePagination, useRowSelect, useSortBy, useBlockLayout, useResizeColumns } from 'react-table';
import moment from 'moment';

import { Money, DynamicBSIcon, TableRowResize } from '../../all';
import { Drawer } from './Drawer';
import { Header } from './Header';

export function List(props){
  const { data, size, loading, tab, excelName, getData, filter, period } = props;
  const { t, i18n } = useTranslation();
  const [columns, setColumns] = useState([]);
  const [columns1, setColumns1] = useState([]);
  const [maxHeight, setMaxHeight] = useState('300px');
  const [selected, setSelected] = useState(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    changeColumns([
      'sale.totalAmount', 'sale.totalDiscountAmount', 'sale.totalSalesAmount', 'sale.totalCashAmount', 'sale.totalNonCashAmount',
      'sale.vatDdtd', 'sale.vat_CustomerId', 'sale.useBonus', 'sale.useVoucher', 'sale.useCoupon', 'sale.useGiftCard', 'sale.consumerDescr'], period);
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [i18n?.language, period, data]);

  const changeColumns = (value) => {
    let columns = [
      { Header: t('report_receipt.t_no'), accessor: 'sale.salesNo', exLabel: t('report_receipt.t_no'), width: 125, maxWidth: 150, minWidth: 100 ,
      Footer: <div style={{textAlign: 'left', paddingLeft: 10}}>{t('report.total') + data?.length}</div> 
      },
      {
        Header: t('page.date'), accessor: 'sale.salesDate',
        width: 100, minWidth: 75, maxWidth: 100,
        exLabel: t('page.date'),
        Cell: ({ value }) => {
          return (<div>{moment(value)?.format('yyyy.MM.DD')}</div>)
        }
      },
      { Header: t('time.t_site'), accessor: 'sale.siteName', exLabel: t('time.t_site'), customStyle : {width: 200}, width: 150, minWidth: 90 },
      { Header: t('pos.title'), accessor: 'sale.terminalDescr', exLabel: t('pos.title'), width: 150, minWidth: 90 },
      { Header: t('time.t_emp'), accessor: 'sale.cashierName', exLabel: t('time.t_emp'), width: 150, minWidth: 90 },
      { Header: t('report_receipt.t_type'), accessor: 'sale.salesTypeName', exLabel: t('report_receipt.t_type'), width: 125, minWidth: 90 },
    ];
    setColumns1(value);
    t('report_receipt.columns')?.forEach(item => {
      let exists = value?.findIndex(val => val === item?.value) !== -1;
      if(exists){
        columns.push({
          Header: <div style={item?.value === 'sale.createdDate' ? {textAlign: 'left'} : {textAlign: 'right'}}>{item?.label}</div>, accessor: item?.value,
          width: 150, minWidth: 120,
          exLabel: item?.label,
          Cell: props => (
            item?.value === 'sale.createdDate' ? moment(props?.value)?.format('yyyy.MM.DD HH:mm:ss') :
            <div style={{textAlign: 'right', paddingRight: 15}}>
             {item?.value === 'sale.vat_CustomerId' ? props?.value : 
              item?.value === 'sale.customer' ? props?.value :
              item?.value === 'sale.consumerDescr' ? props?.value :
              item?.value === 'sale.useVoucher' ? (props?.value === 1 ? <DynamicBSIcon className='check_icon' name='BsCheckSquareFill' /> : <DynamicBSIcon className='check_icon1' name='BsCheckSquare' /> ) :
              item?.value === 'sale.useCoupon' ? (props?.value === 1 ? <DynamicBSIcon className='check_icon' name='BsCheckSquareFill' /> : <DynamicBSIcon className='check_icon1' name='BsCheckSquare' /> ) :
              item?.value === 'sale.useBonus' ? (props?.value === 1 ? <DynamicBSIcon className='check_icon' name='BsCheckSquareFill' /> : <DynamicBSIcon className='check_icon1' name='BsCheckSquare' /> ) :
              item?.value === 'sale.useGiftCard' ? (props?.value === 0 || props?.value === null ? <DynamicBSIcon className='check_icon1' name='BsCheckSquare' /> : <DynamicBSIcon className='check_icon' name='BsCheckSquareFill' /> ) :
              item?.value === 'sale.status' ? (props?.value === 1 ? <DynamicBSIcon className='check_icon1' name='BsCheckSquare' /> : <DynamicBSIcon className='check_icon' name='BsCheckSquareFill' /> ): 
              item?.value === 'sale.vatDdtd' ? props?.value: ( <Money value={props?.value} fontSize={14} />)}
            </div>
            ),
            Footer: info => {
              const total = React.useMemo(() =>
                info.rows.reduce((sum, row) => row.values[item?.value] + sum, 0),
                [info.rows]  )
              return <>{item?.value !== 'sale.customer' && item?.value !== 'sale.consumerDescr'  && item?.value !== 'sale.useBonus' 
                        && item?.value !== 'sale.useVoucher' && item?.value !== 'sale.useCoupon' && item?.value !== 'sale.useGiftCard' 
                        && item?.value !== 'sale.vatDdtd' && item?.value !== 'sale.vat_CustomerId' && item?.value !== 'sale.createdDate' && item?.value !== 'sale.status' 
                        ? <div style={{textAlign: 'right', paddingRight: 15}}>{item?.value === 'qty' || item?.value === 'returnQty' ? total : <Money value={total} fontSize={14} />} </div> : null}</>
            }
        });
      }
    });
    setColumns(columns);
  }

  useEffect(() => {
    if(size?.width >= 920) setMaxHeight('calc(100vh - var(--header-height) - var(--page-padding) * 6 - 37px - 117px - 38px - 39px)');
    else if(size?.width < 920 && size?.width >= 720)
      setMaxHeight('calc(100vh - var(--header-height) - var(--page-padding) * 6 - 83px - 117px - 38px - 39px)');
    else if(size?.width < 720)
      setMaxHeight('calc(100vh - var(--header-height) - var(--page-padding) * 4 - 38px - 39px)');
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [size?.width]);

  useEffect(() => {
    setOpen(false);
    setSelected(null);
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading, tab]);

  const onRowClick = row => {
    setSelected(row?.original);
    setOpen(true);
  }

  const tableInstance = useTable({ columns, data, autoResetPage: true, autoResetSortBy: false,
    initialState: { pageIndex: 0, pageSize: 2500000, sortBy: [{ id: 'sale.salesDate', desc: true }] }},
    useSortBy, usePagination, useRowSelect, useBlockLayout, useResizeColumns);
  const tableProps = { tableInstance, onRowClick, hasFooter: true };
  const drawerProps = { selected, open, setOpen };
  const filterProps = { onSearch: getData, size, filter, columns, data1 : data, excelName, 
  value: columns1, setValue: changeColumns, data: t('report_receipt.columns'), className: 'rp_list_drop' };

  return (
    <div>
      <Drawer {...drawerProps} />
      <Header {...filterProps} />        
      <div style={{overflowX: 'scroll'}}>
        <div id='paging' className='table_scroll' style={{overflowY: 'scroll', maxHeight, minWidth: 720}}>
          <TableRowResize {...tableProps} />
        </div>
      </div>
    </div>
  );
}