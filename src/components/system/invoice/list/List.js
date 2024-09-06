import React, { useState, useEffect } from 'react';
import { useTable, usePagination, useRowSelect, useSortBy } from 'react-table';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';
import { message } from 'antd';

import { Money, Overlay, FooterTable, Empty1 } from '../../../all';
import { getList } from '../../../../services';
import { Header } from './Header';

export function List(props){
  const { onClickAdd, data, size, getData, date, setError, onSearch, excelName } = props;
  const [columns, setColumns] = useState([]);
  const [maxHeight, setMaxHeight] = useState('300px');
  const { t, i18n } = useTranslation();
  const { user, token } = useSelector(state => state.login);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();


  useEffect(() => {
    setColumns([
      { Header: t('tax.customer'), accessor: 'label1', exLabel: t('tax.customer'), Footer: <div style={{textAlign: 'left', paddingLeft: 15}}>{t('report.total') + data?.length}</div>},
      { Header: t('invoice.invoice'), accessor: 'invoiceNo', exLabel: t('invoice.invoice') },
      {
        Header: t('page.date'), accessor: 'invoiceDate', customStyle: { minWidth: 120 }, exLabel: t('page.date'),
        Cell: ({ value }) => (<div>{moment(value).format('yyyy.MM.DD')}</div>)
      },
      { Header: t('invoice.type'), accessor: 'invoiceType', exLabel: t('invoice.type'), },
      { Header: t('invoice.time'), accessor: 'invoiceTime', exLabel: t('invoice.time'), },
      {
        Header: <div style={{textAlign: 'right'}}>{t('invoice.amount')}</div>, accessor: 'amount', customStyle: { width: 100 }, exLabel: t('invoice.amount'),
        Cell: ({ value }) => (<div style={{textAlign: 'right', paddingRight: 15}}><Money value={value} fontSize={14} /></div>),
        Footer: info => {
          const total = React.useMemo(() =>
            info.rows.reduce((sum, row) => row.values.amount + sum, 0),
            [info.rows]  )
          return <><div style={{textAlign: 'right', paddingRight: 15}}>{<Money value={total} fontSize={14} />} </div></>
        }
      },
      { Header: t('order.status'), accessor: 'statusName', exLabel: t('order.status') },
      { Header: t('order.bank'), accessor: 'bankName', exLabel: t('order.bank') },
      { Header: '', accessor: 'isSendVat', noSort: true, isBtn: true, customStyle: { maxWidth: 110 },
        Cell: ({ value, row, onClickLink }) => {
          let active = row?.original?.status === 3 && value !== 'Y' && row?.original?.invoiceTime !== 'TRIAL';
          return active && (<div className='table_link' onClick={() => onClickLink(row)}><Overlay loading= {loading}>{t('system.tax_sent')}</Overlay></div>);
        }
      },
    ]);
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [i18n?.language, data?.length]);

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
    initialState: { pageIndex: 0, pageSize: 1000000, sortBy: [{ id: 'invoiceDate', desc: true }] }}, useSortBy, usePagination, useRowSelect);
  const tableProps = { tableInstance, onRowClick, hasFooter: true };
  const headerProps = {setError, onSearch, size, excelName, data, columns};
  const emptyProps = { icon: 'MdReceipt', type: 'time', onClickAdd, noDescr: true };

  return (
      <div className='table_scroll'>
        <Header {...headerProps}/>
        <div id='paging' style={{marginTop: 10, overflowY: 'scroll', maxHeight, minWidth: 720}}>
          {!data?.length ? <Empty1 {...emptyProps} /> :<FooterTable {...tableProps} /> }
        </div>
      </div>
  );
}