import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useTable, usePagination, useSortBy, useRowSelect } from 'react-table';

import { Modal } from 'antd';
import { Overlay, DynamicTBIcon, Error, Empty1, Money, Table } from '../../../../components/all';

export function SalesAr(props){
  const { data, visible, closeModal, loading, error} = props;
  const { t, i18n } = useTranslation();
  const [columns, setColumns] = useState([]);

  useEffect(() => { 
    setColumns([
        { Header: <div >{t('customer.title')}</div>, accessor: 'custName', exLabel: t('customer.title')},
        { Header: <div style={{textAlign: 'right'}}> {t('receive.amount_beg')} </div>, accessor: 'beginArAmount', exLabel: 'Эхний үлдэгдэл', 
        Cell: (props)=> <div style={{textAlign: 'right', paddingRight: '7px'}}> <Money value = {props?.value}/> </div> },
        { Header: <div style={{textAlign: 'right'}}> {t('receive.amount_receive_crea')} </div>, accessor: 'addAmount',exLabel: 'Авлага үүсгэсэн дүн',
        Cell: (props)=> <div style={{textAlign: 'right', paddingRight: '7px'}}> <Money value = {props?.value}/></div>  },
        { Header: <div style={{textAlign: 'right'}}> {t('receive.amount_receive_clos')} </div>, accessor: 'closeAmount',exLabel: 'Авлага хаасан дүн',
        Cell: (props)=> <div style={{textAlign: 'right', paddingRight: '7px'}}> <Money value = {props?.value}/></div>  },
        { Header: <div style={{textAlign: 'right'}}> {t('receive.amount_final')} </div>, accessor: 'endArAmount',exLabel: 'Эцсийн үлдэгдэл',
        Cell: (props)=> <div style={{textAlign: 'right', paddingRight: '7px'}}> <Money value = {props?.value}/></div>  }
      ]);
return () => {};
// eslint-disable-next-line react-hooks/exhaustive-deps
}, [i18n?.language]); 

const tableInstance = useTable({
    columns,
    data,
    autoResetPage: false,
    autoResetSortBy: false,
    initialState: { pageIndex: 0, pageSize: 250000, sortBy: [{ id: 'salesTime', desc: true }] }
}, useSortBy, usePagination, useRowSelect );

const tableProps = { tableInstance };

  return (
    <Modal title={null} footer={null} closable={false} open={visible} onCancel = {closeModal}  centered={true} width={800}>
        <Overlay loading={loading} className='m_back2'>
          <div >
            {error && <Error error={error}/>}
            <div className='row'>
              <DynamicTBIcon name='TbReportAnalytics' className='report_icon'/>
              <p style={{fontSize: 16, fontWeight: 600}}>{t('menu.report_receivable')}</p>
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