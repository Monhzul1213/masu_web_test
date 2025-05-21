import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useTable, usePagination, useSortBy, useRowSelect } from 'react-table';

import { Modal } from 'antd';
import { Overlay, DynamicTBIcon, Error, Empty1, Money, Table } from '../../../../components/all';
import { formatNumber } from '../../../../helpers';

export function SalesRemain(props){
  const { data, visible, closeModal, loading, error} = props;
  const { t, i18n } = useTranslation();
  const [columns, setColumns] = useState([]);

  useEffect(() => {
    setColumns([
      { Header: t('report.siteName'), accessor: 'siteName', Footer: t('report.total') + data?.length, customStyle : { minWidth: 100 } },
      { Header: t('menu.inventory'), accessor: 'invtName', customStyle : { minWidth: 200 } },
      { Header: t('inventory.barcode'), accessor: 'barCode', customStyle : { minWidth: 100 }  },
      { Header: t('inventory.category'), accessor: 'categoryName', exLabel:t('inventory.category'), customStyle : { minWidth: 100 }  },
      { Header: <div style={{textAlign: 'right'}}>{t('order.t_qty')}</div>, accessor: 'orderQty',  customStyle : { minWidth: 130 }, 
        Cell: props => <div style={{textAlign: 'right', paddingRight: 15}}>{formatNumber(props?.value)}</div>
      },
      { Header: <div style={{textAlign: 'right'}}>{t('report_receipt.c_title2')}</div>, accessor: 'salesQty' ?? 0, customStyle : { minWidth: 100 }, 
      Cell: props => <div style={{textAlign: 'right', paddingRight: 15}}>{formatNumber(props?.value)}</div>,
      },
      { Header: <div style={{textAlign: 'right'}}>{t('order.t_stock')}</div>, accessor: 'qty', exLabel: t('order.t_stock'), customStyle : { minWidth: 100 }, 
        Cell: props => <div style={{textAlign: 'right', paddingRight: 15}}>{formatNumber(props?.value)}</div>,
      },
      { Header: <div style={{textAlign: 'right'}}>{t('orders.cost')}</div>, accessor: 'cost', exLabel: t('orders.cost'),customStyle : { minWidth: 120 },
        Cell: props => <div style={{textAlign: 'right', paddingRight: 15}}><Money value={props?.value} fontSize={14} /></div>,
      },
      { Header: <div style={{textAlign: 'right'}}>{t('orders.totalCost')}</div>, accessor: 'totalCost', exLabel: t('orders.totalCost'), customStyle : { minWidth: 120 },
        Cell: props => <div style={{textAlign: 'right', paddingRight: 15}}><Money value={props?.value} fontSize={14} /></div>,
      },
      { Header: <div style={{textAlign: 'right'}}>{t('report.price')}</div>, accessor: 'price', exLabel: t('report.price'), customStyle : { minWidth: 90 },
        Cell: props => <div style={{textAlign: 'right', paddingRight: 15}}><Money value={props?.value} fontSize={14} /></div>,
      },
      { Header: <div style={{textAlign: 'right'}}>{t('report_receipt.t_total')}</div>, accessor: 'totalPrice', 
        exLabel: t('report_receipt.t_total'), customStyle : { minWidth: 120 },
        Cell: props => <div style={{textAlign: 'right', paddingRight: 15}}><Money value={props?.value} fontSize={14} /></div>,
      },
      { Header: t('pos.t_status'), accessor: 'statusName', customStyle : { minWidth: 90 } },
    ]);
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [i18n?.language, data?.length]);

const tableInstance = useTable({
    columns,
    data,
    autoResetPage: false,
    autoResetSortBy: false,
    initialState: { pageIndex: 0, pageSize: 2500000, sortBy: [{ id: 'salesTime', desc: true }] }
}, useSortBy, usePagination, useRowSelect );

const tableProps = { tableInstance };

  return (
    <Modal title={null} footer={null} closable={false} open={visible} onCancel = {closeModal}  centered={true} width={800}>
        <Overlay loading={loading} className='m_back2'>
          <div >
            {error && <Error error={error}/>}
            <div className='row'>
              <DynamicTBIcon name='TbReportAnalytics' className='report_icon'/>
              <p style={{fontSize: 16, fontWeight: 600}}>{t('menu.invt_remainder')}</p>
            </div>
            {data?.length ? 
            <div className="table_scroll" style={{ overflow: 'scroll' }}>
                <div id="paging" style={{ marginTop: 10, minWidth: 720, maxHeight: 500 }}>
                    <Table {...tableProps} />
                </div>
            </div> : <Empty1/> }           
          </div>
        </Overlay>
    </Modal>
  )
}