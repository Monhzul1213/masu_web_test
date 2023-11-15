import React, { useState, useEffect } from 'react';
import { useTable, usePagination, useRowSelect, useSortBy } from 'react-table';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';
import { message } from 'antd';

import { Money, Overlay, PaginationTable, Table } from '../../../all';
import { getList } from '../../../../services';

export function List(props){
  const { onClickAdd, data, size, getData, date } = props;
  const [columns, setColumns] = useState([]);
  const [maxHeight, setMaxHeight] = useState('300px');
  const { t, i18n } = useTranslation();
  const { user, token } = useSelector(state => state.login);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();


  useEffect(() => {
    setColumns([
      { Header: t('tax.customer'), accessor: 'label1' },
      { Header: t('invoice.invoice'), accessor: 'invoiceNo' },
      {
        Header: t('page.date'), accessor: 'invoiceDate', customStyle: { minWidth: 120 },
        Cell: ({ value }) => (<div>{moment(value).format('yyyy.MM.DD')}</div>)
      },
      { Header: t('invoice.type'), accessor: 'invoiceType' },
      { Header: t('invoice.time'), accessor: 'invoiceTime' },
      {
        Header: <div style={{textAlign: 'right'}}>{t('invoice.amount')}</div>, accessor: 'amount', customStyle: { width: 100 },
        Cell: ({ value }) => (<div style={{textAlign: 'right', paddingRight: 15}}><Money value={value} fontSize={14} /></div>)
      },
      { Header: t('order.status'), accessor: 'statusName' },
      { Header: '', accessor: 'isSendVat', noSort: true, isBtn: true, customStyle: { maxWidth: 110 },
        Cell: ({ value, row, onClickLink }) => {
          let active = row?.original?.status === 3 && value !== 'Y' && row?.original?.invoiceTime !== 'TRIAL';
          return active && (<div className='table_link' onClick={() => onClickLink(row)}><Overlay loading= {loading}>{t('system.tax_sent')}</Overlay></div>);
        }
      },
    ]);
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [i18n?.language]);

  useEffect(() => {
    if(size?.width >= 660) setMaxHeight('calc(100vh - var(--header-height) - var(--page-padding) * 3 - 7px - 51px - 10px - 37px)');
    else setMaxHeight('calc(100vh - var(--header-height) - var(--page-padding) * 3 - 7px - 110px - 10px - 37px)');
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [size?.width]);

  const onRowClick = row => onClickAdd(row?.original);

  
  const onClickLink = async (row) => {
    setLoading(true)
    let api = 'System/GetMasuVat' + ('?InvoiceNo=' + row?.original?.invoiceNo)
    let send = await dispatch(getList(user, token, api ));
    if(send?.error) message.error(send?.error)
    else {
      message.success(t('system.success'))
      let query = '?BeginDate=' + date[0]?.format('yyyy.MM.DD') + '&EndDate=' + date[1]?.format('yyyy.MM.DD');
      getData(query);    
    }
    setLoading(false)
  }
  

  const tableInstance = useTable({ columns, data, autoResetPage: false, autoResetSortBy: false, onClickLink,
    initialState: { pageIndex: 0, pageSize: 25, sortBy: [{ id: 'invoiceDate', desc: true }] }}, useSortBy, usePagination, useRowSelect);
  const tableProps = { tableInstance, onRowClick };

  return (
    <div>
      <div className='table_scroll' style={{overflowX: 'scroll'}}>
        <div id='paging' style={{marginTop: 10, overflowY: 'scroll', maxHeight, minWidth: 720}}>
          <Table {...tableProps} />
        </div>
      </div>
      <PaginationTable {...tableProps} />
    </div>
  );
}