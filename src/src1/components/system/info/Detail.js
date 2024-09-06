import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useTable, usePagination, useRowSelect, useSortBy } from 'react-table';
import moment from 'moment';
import { useSelector, useDispatch } from 'react-redux';

import { Money, Table, Overlay, DynamicTBIcon } from '../../../../components/all';
import { Modal } from 'antd';
import { SalesDtl } from './SalesDtl';
import { getList } from '../../../../services';


export function Detail(props){
  const { data, size, visible, closeModal, loading} = props;
  const { t, i18n } = useTranslation();
  const [columns, setColumns] = useState([]);
  const [open, setOpen] = useState(false);
  const [detail, setDetail] = useState([]);
  const { user, token }  = useSelector(state => state.login);
  const dispatch = useDispatch();

  useEffect(() => {
    setColumns([
      { Header: t('page.date'), accessor: 'salesDate', customStyle: { minWidth: 20 },
      Cell: ({ value }) => { return (<div>{moment(value)?.format('yyyy.MM.DD')}</div>)} },
      { Header: <div style={{textAlign: 'right'}}>{t('discount.amount')}</div>, accessor: 'amt', customStyle: { minWidth: 50 },
        Cell: props => <div style={{textAlign: 'right', paddingRight: 15}}><Money value={props?.value} fontSize={14} /></div>},
      { Header: <div style={{textAlign: 'right'}}>{t('package.qty')}</div>, accessor: 'qty', customStyle: { minWidth: 50 },
      Cell: props => <div style={{textAlign: 'right', paddingRight: 15}}>{props?.value}</div>},
    ]);
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [i18n?.language,]);

 const onClickDetail = async(row) => {
    setOpen(true);
    let query = '?merchantid=' + row?.original?.merchantID + '&salesdate=' + moment(row?.original?.salesDate)?.format('yyyy.MM.DD');
    let api = 'Merchant/GetMerchantSalesDtl' + (query ?? '');
    const response = await dispatch(getList(user, token, api));
    setDetail(response?.data);
 }

 const closeDtlModal = () => {
  setOpen(false);
}

  const maxHeight = size?.width > 380
  ? 'calc(100vh - var(--header-height) - var(--page-padding) * 3 - 7px - 51px - 10px - 37px)'
  : 'calc(100vh - var(--header-height) - var(--page-padding) * 3 - 7px - 210px - 10px - 37px)';
  const tableInstance = useTable( { columns, data, autoResetPage: false,  initialState: { pageIndex: 0, pageSize: 250000 , sortBy: [{ id: 'salesDate', desc: true }]},
  }, useSortBy, usePagination, useRowSelect);
  const tableProps = { tableInstance, onRowClick: onClickDetail };
  let detailProps = { data: detail, visible: open, closeModal: closeDtlModal, loading};

  return (
    <Modal title={null} footer={null} closable={false} open={visible} onCancel = {closeModal}  centered={true} width={400}>
        {open && <SalesDtl {...detailProps} />}
        <Overlay loading={loading} className='m_back2'>
            <div >
            <div className='row'>
              <DynamicTBIcon name='TbReportAnalytics' className='report_icon'/>
              <p style={{fontSize: 16, fontWeight: 600}}>{t('menu.report_document')}</p>
            </div>
            <div className='table_scroll' id='paging' style={{marginTop: 0, overflow: 'scroll', maxHeight, minWidth : 220}}>
                <Table {...tableProps} />
            </div>
            </div>
        </Overlay>
    </Modal>
  )
}