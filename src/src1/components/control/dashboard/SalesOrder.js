import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useTable, usePagination, useSortBy, useResizeColumns, useBlockLayout } from 'react-table';

import { Modal } from 'antd';
import { Overlay, DynamicTBIcon, Error, Empty1, Money, TableRowResize } from '../../../../components/all';
import moment from 'moment';


export function SalesOrder(props){
  const { data, size, visible, closeModal, loading, error} = props;
  const { t, i18n } = useTranslation();
  const [columns, setColumns] = useState([]);

  useEffect(() => {
    setColumns([
      { Header: t('page.date'), accessor: 'salesDate', Footer: t('report.total') + data?.length, exLabel: t('page.date'), width: 100, minWidth: 90 ,
        Cell: ({ value }) => {
          return (<div>{moment(value)?.format('yyyy.MM.DD')}</div>)
        }
      },
      { Header: t('time.t_site'), accessor: 'siteName', exLabel: t('time.t_site'), width: 130, minWidth: 90 ,},
      { Header: t('pos.title'), accessor: 'terminalName', exLabel: t('pos.title'), width: 80, minWidth: 70 , },
      { Header: t('orders.location'), accessor: 'ticket', exLabel: t('orders.location'), width: 130, minWidth: 80 },
      { Header: t('time.t_emp'), accessor: 'cashierName', exLabel: t('time.t_emp'), width: 100, minWidth: 80  },
      { Header: t('report_receipt.t_type'), accessor: 'salesTypeName', exLabel: t('report_receipt.t_type'), width:100, minWidth: 80 },
      { Header: t('menu.customer'), accessor: 'customer', exLabel: t('menu.customer'), width:110, minWidth: 80 },
      { Header: <div style={{textAlign: 'right'}}>{t('report.amount')}</div>, accessor: 'totalAmount' , width: 100, minWidth: 90 ,
       exLabel: t('report.amount'),
      Cell: props => <div style={{textAlign: 'right', paddingRight: 15}}>{<Money value={props?.value} fontSize={14} />}</div>,  
      Footer: info => {
        const total = React.useMemo(() =>
          info.rows.reduce((sum, row) => row.values.totalAmount + sum, 0),
          [info.rows]  )
        return <><div style={{textAlign: 'right', paddingRight: 15}}><Money value={total} fontSize={14} /></div></>
        } },
      { Header: <div style={{textAlign: 'right'}}>{t('report.discount')}</div>, accessor: 'totalDiscountAmount' , 
        exLabel: t('report.discount'), width: 100, minWidth: 90 ,
        Cell: props => <div style={{textAlign: 'right', paddingRight: 15}}>{<Money value={props?.value} fontSize={14} />}</div>,  
        Footer: info => {
          const total = React.useMemo(() =>
            info.rows.reduce((sum, row) => row.values.totalDiscountAmount + sum, 0),
            [info.rows]  )
        return <><div style={{textAlign: 'right', paddingRight: 15}}><Money value={total} fontSize={14} /></div></>
      } },
      { Header: <div style={{textAlign: 'right'}}>{t('report.salesAmount')}</div>, accessor: 'totalSalesAmount' , 
      exLabel: t('report.salesAmount'), width: 100, minWidth: 90,
      Cell: props => <div style={{textAlign: 'right', paddingRight: 15}}>{<Money value={props?.value} fontSize={14} />}</div>,  
      Footer: info => {
        const total = React.useMemo(() =>
          info.rows.reduce((sum, row) => row.values.totalSalesAmount + sum, 0),
          [info.rows]  )
        return <><div style={{textAlign: 'right', paddingRight: 15}}><Money value={total} fontSize={14} /></div></>
        } }, 
        { Header: <div style={{textAlign: 'right'}}>{t('report.cash')}</div>, accessor: 'totalCashAmount' , 
        exLabel: t('report.cash'), width: 100, minWidth: 90,
        Cell: props => <div style={{textAlign: 'right', paddingRight: 15}}>{<Money value={props?.value} fontSize={14} />}</div>,  
        Footer: info => {
          const total = React.useMemo(() =>
            info.rows.reduce((sum, row) => row.values.totalCashAmount + sum, 0),
            [info.rows]  )
          return <><div style={{textAlign: 'right', paddingRight: 15}}><Money value={total} fontSize={14} /></div></>
        } },
        { Header: <div style={{textAlign: 'right'}}>{t('report.non_cash')}</div>, accessor: 'totalNonCashAmount' , 
        exLabel: t('report.non_cash'), width: 100, minWidth: 90,
        Cell: props => <div style={{textAlign: 'right', paddingRight: 15}}>{<Money value={props?.value} fontSize={14} />}</div>,  
        Footer: info => {
          const total = React.useMemo(() =>
            info.rows.reduce((sum, row) => row.values.totalNonCashAmount + sum, 0),
            [info.rows]  )
          return <><div style={{textAlign: 'right', paddingRight: 15}}><Money value={total} fontSize={14} /></div></>
          } },
        { Header: t('report_receipt.t_type'), accessor: 'descr', exLabel: t('report_receipt.t_type'), width: 90, minWidth: 90 },
    ])
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [i18n?.language, data?.length]);

  const maxHeight = size?.width > 380
  ? 'calc(100vh - var(--header-height) - var(--page-padding) * 3 - 7px - 51px - 10px - 37px)'
  : 'calc(100vh - var(--header-height) - var(--page-padding) * 3 - 7px - 210px - 10px - 37px)';
  const tableInstance = useTable({ columns, data, autoResetPage: true, autoResetSortBy: false,
    initialState: { pageIndex: 0, pageSize: 2500000, sortBy: [{ id: 'salesDate', desc: true }] }}, useSortBy, usePagination, useBlockLayout, useResizeColumns);
  const tableProps = { tableInstance, hasFooter: true };
  const emptyProps = { icon: 'MdSchedule', type: 'time', noDescr: true };

  return (
    <Modal title={null} footer={null} closable={false} open={visible} onCancel = {closeModal}  centered={true} width={800}>
        <Overlay loading={loading} className='m_back2'>
          <div >
            {error && <Error error={error}/>}
            <div className='row'>
              <DynamicTBIcon name='TbReportAnalytics' className='report_icon'/>
              <p style={{fontSize: 16, fontWeight: 600}}>{t('menu.report_order')}</p>
            </div>
            {data?.length ? <div className='table_scroll' id='paging' style={{marginTop: 0, overflow: 'scroll', maxHeight, minWidth : 220}}>
              <TableRowResize {...tableProps}/>
            </div> : <Empty1 {...emptyProps} /> }           
          </div>
        </Overlay>
    </Modal>
  )
}