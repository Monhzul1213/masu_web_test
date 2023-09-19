import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { usePagination, useRowSelect, useSortBy, useTable } from 'react-table';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';

import { getList, sendRequest } from '../../../services';
import { Money, PaginationTable, Table } from '../../all';
import { Subscription } from '../../emp/employee/add';

export function EmpList(props){
  const { data, width, hasData, getData, setError, setLoading } = props;
  const { t, i18n } = useTranslation();
  const [columns, setColumns] = useState([]);
  const [visible, setVisible] = useState(false);
  const [selected, setSelected] = useState(null);
  const { user, token } = useSelector(state => state.login);
  const dispatch = useDispatch();

  useEffect(() => {
    setColumns([
      { Header: t('invoices.employee'), accessor: 'empName' },
      { Header: t('invoices.invoice'), accessor: 'invoiceNo' },
      {
        Header: <div style={{textAlign: 'right'}}>{t('invoices.amt')}</div>, accessor: 'amount', customStyle: { width: 100 },
        Cell: props => (<div style={{textAlign: 'right', paddingRight: 15}}><Money value={props?.value} fontSize={15} /></div>)
      },
      {
        Header: t('invoices.begin'), accessor: 'beginDate', customStyle: { minWidth: 110 },
        Cell: ({ value }) => value ? (<div>{moment(value).format('yyyy.MM.DD')}</div>) : ''
      },
      {
        Header: t('invoices.end'), accessor: 'endDate', customStyle: { minWidth: 120 },
        Cell: ({ value }) => value ? (<div>{moment(value).format('yyyy.MM.DD')}</div>) : ''
      },
      { Header: t('invoices.status'), accessor: 'statusName' },
      {
        Header: '', accessor: 'empCode', noSort: true, isBtn: true, customStyle: { maxWidth: 140, minWidth: 140 },
        Cell: ({ value, row, onClickLink }) => {
          return (<div className='table_link' onClick={() => onClickLink(row)}>{t(row?.original?.invoiceNo ? 'invoices.extend' : 'invoices.pay')}</div>);
        }
      },
    ]);
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [i18n?.language]);

  const onClickLink = row => {
    setVisible(true);
    setSelected(row?.original);
    setError(null);
  }

  const onBack = () => {
    setVisible(false);
    setSelected(null);
  }

  const onDone = async () => {
    setVisible(false);
    if(!selected?.invoiceNo){
      setError(null);
      setLoading(true);
      let response = await dispatch(getList(user, token, 'Employee/GetEmployees?EmpCode=' + selected?.empCode));
      if(response?.error) setError(response?.error);
      else {
        let employee = response?.data && response?.data[0];
        let employeeSites = employee?.empsites?.map(item => {
          item.rowStatus = 'U';
          return item;
        });
        let data = [{...employee, employeeSites, rowStatus: 'U', status: 1, password: ''}];
        let response1 = await dispatch(sendRequest(user, token, 'Employee/Modify', data));
        if(response1?.error) setError(response1?.error);
        else getData && getData();
      }
      setLoading(false);
    }
  }

  const onPay = () => {
    onBack();
    getData && getData();
  }

  const maxHeight = hasData
    ? 'calc(100vh - var(--header-height) - var(--page-padding) * 4 - var(--pg-height) - 23px - 45px)'
    : 'calc(100vh - var(--header-height) - var(--page-padding) * 4 - var(--pg-height) - 23px - 5px)';
  const tableInstance = useTable({ columns, data, autoResetPage: false, initialState: { pageIndex: 0, pageSize: 25 }, onClickLink },
    useSortBy, usePagination, useRowSelect);
  const tableProps = { tableInstance, onRowClick: () => {} };
  const subProps = { visible, invNo: null, emp: selected, onBack, onDone, onPay };

  return (
    <div className='mo_container' style={{ width }}>
      {visible && <Subscription {...subProps} />}
      <p className='card_title'>{t('invoices.employee')}</p>
      <div style={{overflowX: 'scroll'}}>
        <div className='table_scroll' id='paging' style={{overflowY: 'scroll', maxHeight, minWidth: 540}}>
          <Table {...tableProps} />
        </div>
      </div>
      <PaginationTable {...tableProps} />
    </div>
  );
}