import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useTable, usePagination, useRowSelect, useSortBy } from 'react-table';
import { Modal } from 'antd';

import { Money, Overlay, FooterTable } from '../../all/all_m';


export function SalesDtl(props){
  const { data, size, visible, closeModal, loading} = props;
  const { t, i18n } = useTranslation();
  const [columns, setColumns] = useState([]);

  useEffect(() => {
    setColumns([
      { Header: t('inventory.title'), accessor: 'invtName', customStyle: { width: 200 }, Footer: <div style={{paddingLeft: 15}}>{t('report.total') }</div>},
      { Header: t('inventory.category'), accessor: 'categoryName', customStyle: { width: 200 } },
      { Header: <div style={{textAlign: 'right'}}>{t('inventory.t_qty')}</div>, accessor: 'qty', customStyle: { width: 100 },
      Cell: props => <div style={{textAlign: 'right', paddingRight: 15}}>{props?.value}</div>},
      { Header: <div style={{textAlign: 'right'}}>{t('discount.amount')}</div>, accessor: 'amount', customStyle: { minWidth: 100 },
        Cell: props => <div style={{textAlign: 'right', paddingRight: 15}}><Money value={props?.value} fontSize={14} /></div>,
        Footer: info => {
          const total = React.useMemo(() =>
            info.rows.reduce((sum, row) => row.values.amount + sum, 0),
            [info.rows]  )
          return <><div style={{textAlign: 'right', paddingRight: 15}}>{<Money value={total} fontSize={14} />} </div></>
      }},
    ]);
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [i18n?.language,]);

  const maxHeight = size?.width > 380
  ? 'calc(100vh - var(--header-height) - var(--page-padding) * 3 - 7px - 51px - 10px - 37px)'
  : 'calc(100vh - var(--header-height) - var(--page-padding) * 3 - 7px - 210px - 10px - 37px)';
  const tableInstance = useTable( { columns, data, autoResetPage: false,  
    initialState: { pageIndex: 0, pageSize: 250000 , sortBy: [{ id: 'amount', desc: true }]}}, useSortBy, usePagination, useRowSelect);
  const tableProps = { tableInstance };

  return (
    <Modal title={null} footer={null} open={visible} onCancel = {closeModal}  centered={true} width={650}>
        <Overlay loading={loading} className='m_back2'>
            <div className='dtl_title_back'>
              <p style={{fontSize: 16, fontWeight: 600}}>{t('menu.report_invtentory')}</p>
            </div>
            <div style={{overflowX: 'scroll', marginTop: 20, marginBottom: 20}} >
                <div id='paging' style={{marginTop: 0, overflowY: 'scroll', maxHeight, minWidth : 220}}>
                    <FooterTable {...tableProps} />
                </div>
            </div>
        </Overlay>
    </Modal>
  )
}