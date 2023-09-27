import React, { useState, useEffect } from 'react';
import { useTable, usePagination, useRowSelect, useSortBy } from 'react-table';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';

import { PaginationTable, Table } from '../../all';
import { SubscriptionSite } from '../../management/adjust/list';
import { Tax } from '../../system/invoice/list/Tax';
// import { siteSubscriptions1 } from '../../../helpers';
// import { sendRequest } from '../../../services';

export function List(props){
  const { data, onClickAdd, getData } = props;
  const { t, i18n } = useTranslation();
  const [columns, setColumns] = useState([]);
  const [visible, setVisible] = useState(false);
  const [visible1, setVisible1] = useState(false);
  // const [selected, setSelected] = useState(null);
  const [site, setSite] = useState(null);
  // const [loading, setLoading] = useState(false);
  // const [current, setCurrent] = useState(0);
  // const [error, setError] = useState(null);
  // const [amt, setAmt] = useState(0);
  // const [txnNo, setTxnNo] = useState('');
  const { useInventoryManagement } = useSelector(state => state.login.user);
  // const { user, token } = useSelector(state => state.login);
  // const dispatch = useDispatch();

  // useEffect(() => {
  //   let selected = siteSubscriptions1 && siteSubscriptions1[0];
  //   setSelected(selected);
  //   setAmt(selected?.amt);
  //   return () => {};
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, []);

  // const onSelect = item => {
  //   setSelected(item);
  //   setAmt(item?.amt);
  // }

  // const onNext = async () => {
  //   setError(null);
  //   setLoading(true);
  //   let data = { invoicetime: selected?.length, invoiceAmount: amt, siteID: [site?.siteId] }
  //   let response = await dispatch(sendRequest(user, token, 'Txn/ModSiteInvoice', data));
  //   if(response?.error) setError(response?.error);
  //   else {
  //     if(selected?.value === 2){
  //       onDone();
  //     } else {
  //       setCurrent(1);
  //       setTxnNo(response?.data?.invoiceNo);
  //     }
  //   }
  //   setLoading(false);
  // }

  useEffect(() => {
    setColumns([
      { Header: t('shop.t_name'), accessor: 'name' },
      { Header: t('shop.t_addr'), accessor: 'address_text' },
      {
        Header: <div style={{textAlign: 'right'}}>{t('shop.t_pqty')}</div>, accessor: 'posQty',
        Cell: props => <div style={{textAlign: 'right', paddingRight: 15}}>{props.value}</div>
      },
      {
        Header: '', accessor: 'status', noSort: true, isBtn: true, customStyle: { maxWidth: 110 },
        Cell: ({ value, row, onClickLink }) => {
          let active = useInventoryManagement && value === 1;
          return active && (<div className='table_link' onClick={() => onClickLink(row)}>{t('employee.pay')}</div>);
        }
    },
    ]);
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [i18n?.language]);

  const onClickLink = row => {
    setVisible(true);
    setSite(row?.original);
  }

  const onDone = () => {
    setVisible(false);
    setSite(null);
    getData();
  }

  // const onDone1 = () => {
  //   setVisible(false);    
  //   setVisible1(true);
  //   setSite(null);
  //   getData();
  // }

  const onBack = () => {
    setVisible1(false);
  }

  const maxHeight = 'calc(100vh - var(--header-height) - var(--page-padding) * 4 - 36px - 10px - var(--pg-height) - 5px)';
  const tableInstance = useTable( { columns, data, autoResetPage: false, initialState: { pageIndex: 0, pageSize: 25 }, onClickLink},
    useSortBy, usePagination, useRowSelect);
  const tableProps = { tableInstance, onRowClick: onClickAdd };
  const subProps = { visible, setVisible, site, onDone, noTrial: true, noBack: true, fromSite: true, };
                    // loading, setLoading, 
                    //  current, setCurrent, error, setError, selected, setSelected, amt, setAmt, txnNo, setTxnNo, onSelect, onNext  
  // const sub1Props = { visible: visible1, setVisible: setVisible1, onBack, print: true,  };

  return (
    <div>
      {/* {visible1 && <Tax {...sub1Props} />} */}
      {visible && <SubscriptionSite {...subProps} />}
      <div className='table_scroll' style={{overflowX: 'scroll'}}>
        <div id='paging' style={{marginTop: 10, overflowY: 'scroll', maxHeight, minWidth: 540}}>
          <Table {...tableProps} />
        </div>
      </div>
      <PaginationTable {...tableProps} />
    </div>
  );
}