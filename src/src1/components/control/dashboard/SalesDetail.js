import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useTable, usePagination, useSortBy, useResizeColumns, useBlockLayout } from 'react-table';

import { Modal } from 'antd';
import { Overlay, DynamicTBIcon, Error, Empty1, Money, TableRowResize } from '../../../../components/all';


export function SalesDetail(props){
  const { data, size, visible, closeModal, loading, error} = props;
  const { t, i18n } = useTranslation();
  const [columns, setColumns] = useState([]);

  useEffect(() => {
    setColumns([
      {Header: t( 'page.time'), accessor: 'salesDate', width: 100, minWidth: 75, maxWidth: 100},
      { Header: t('order.site'), accessor: 'siteName',  width: 135, minWidth: 90},
      { Header: <div style={{textAlign: 'right'}}>{t('Борлуулалт')}</div>, accessor: 'totalSalesAmt',  width: 135, minWidth: 90,
        Cell: ({ value }) => <div style={{textAlign: 'right', paddingRight: 15}}>{<Money value={value} fontSize={14} />}</div> },
      { Header: <div style={{textAlign: 'right'}}>{t('Борлуулалтын тоо')}</div>, accessor: 'salesQty',  width: 135, minWidth: 90,
        Cell: ({ value }) => <div style={{textAlign: 'right', paddingRight: 15}}>{value}</div> },
      { Header: <div style={{textAlign: 'right'}}>{t('bill.refund')}</div>, accessor: 'totalReturnAmt',  width: 135, minWidth: 90,
        Cell: ({ value }) => <div style={{textAlign: 'right', paddingRight: 15}}>{<Money value={value} fontSize={14} />}</div> },
      { Header: <div style={{textAlign: 'right'}}>{t('Буцаалтын тоо')}</div>, accessor: 'returnQty',  width: 135, minWidth: 90,
        Cell: ({ value }) => <div style={{textAlign: 'right', paddingRight: 15}}>{value}</div>  },
      { Header: <div style={{textAlign: 'right'}}>{t('Хөнгөлөлт')}</div>, accessor: 'totalDiscAmt',  width: 135, minWidth: 90,
        Cell: ({ value }) => <div style={{textAlign: 'right', paddingRight: 15}}>{<Money value={value} fontSize={14} />}</div> },
      { Header: <div style={{textAlign: 'right'}}>{t('Цэвэр борлуулалт')}</div>, accessor: 'totalNetSalesAmt', width: 135, minWidth: 90,
        Cell: ({ value }) => <div style={{textAlign: 'right', paddingRight: 15}}>{<Money value={value} fontSize={14} />}</div> },
      { Header: <div style={{textAlign: 'right'}}>{t('Бэлэн')}</div>, accessor: 'totalCashAmount',  width: 135, minWidth: 90,
        Cell: ({ value }) => <div style={{textAlign: 'right', paddingRight: 15}}>{<Money value={value} fontSize={14} />}</div> },
      { Header: <div style={{textAlign: 'right'}}>{t('Бэлэн бус')}</div>, accessor: 'totalNonCashAmount',  width: 135, minWidth: 90,
        Cell: ({ value }) => <div style={{textAlign: 'right', paddingRight: 15}}>{<Money value={value} fontSize={14} />}</div> },
      { Header: <div style={{textAlign: 'right'}}>{t('Барааны өртөг')}</div>, accessor: 'costOfGoods',  width: 135, minWidth: 90 ,
        Cell: ({ value }) => <div style={{textAlign: 'right', paddingRight: 15}}>{<Money value={value} fontSize={14} />}</div>},
      { Header: <div style={{textAlign: 'right'}}>{t('Нийт ашиг')}</div>, accessor: 'totalProfitAmt', width: 135, minWidth: 90,
        Cell: ({ value }) => <div style={{textAlign: 'right', paddingRight: 15}}>{<Money value={value} fontSize={14} />}</div> }
    ]);
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [i18n?.language]);

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
              <p style={{fontSize: 16, fontWeight: 600}}>{t('report_receipt.c_title2')}</p>
            </div>
            {data?.length ? <div className='table_scroll' id='paging' style={{marginTop: 0, overflow: 'scroll', maxHeight, minWidth : 220}}>
              <TableRowResize {...tableProps}/>
            </div> : <Empty1 {...emptyProps} /> }    
          </div>
        </Overlay>
    </Modal>
  )
}