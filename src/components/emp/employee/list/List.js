import React, { useState, useEffect } from 'react';
import { useTable, usePagination, useRowSelect, useSortBy } from 'react-table';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';

import { Check, CheckBtn, PaginationTable, Table } from '../../../all';
import { Subscription } from '../add';

export function List(props){
  const { data, setData, onClickAdd, setShow, checked, setChecked, size, onSubscribe, getData } = props;
  const { t, i18n } = useTranslation();
  const [columns, setColumns] = useState([]);
  const [visible, setVisible] = useState(false);
  const [invNo, setInvNo] = useState(null);
  const [emp, setEmp] = useState(null);
  const { user: { mail } } = useSelector(state => state.login);

  useEffect(() => {
    const customStyle = { width: 40 };
    const style = { display: 'flex', alignItems: 'center', justifyContent: 'center'};
    setColumns([
      {
        id: 'check', noSort: true, isBtn: true, customStyle,
        Header: ({ onClickCheckAll, checked }) => <div style={style}><Check checked={checked} onClick={onClickCheckAll} /></div>,
        Cell: ({ row, onClickCheck }) => {
          let disabled = row?.original?.isOwner === 'Y' || row?.original?.email?.toLowerCase() === mail?.toLowerCase();
          return (<div style={style}><CheckBtn checked={row?.original?.checked} onClick={e => onClickCheck(e, row)} disabled={disabled} /></div>)
        }
      },
      { Header: t('page.name'), accessor: 'empName' },
      { Header: t('employee.mail'), accessor: 'email' },
      { Header: t('page.phone'), accessor: 'phone' },
      { Header: t('employee.role'), accessor: 'roleName' },
      { Header: '', accessor: 'status', noSort: true, isBtn: true, customStyle: { maxWidth: 110 },
        Cell: ({ value, row, onClickLink }) => {
          let active = value === 0;
          return active && (<div className='table_link' onClick={() => onClickLink(row)}>{t('employee.pay')}</div>);
        }
      },
      { Header: t('order.status'), accessor: 'statusName' }
    ]);
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [i18n?.language]);

  const onClickCheckAll = e => {
    let count = false;
    setData(old => old.map((row, index) => {
      let disabled = row?.isOwner === 'Y' || row?.email?.toLowerCase() === mail?.toLowerCase();
      if(disabled) return row;
      else {
        if(!checked) count = true;
        return { ...old[index], checked: !checked };
      }
    }));
    setShow(count);
    setChecked(!checked);
  }

  const onClickCheck = (e, item) => {
    e?.preventDefault();
    setChecked(false);
    setShow(false);
    setData(old => old.map((row, index) => {
      if(index === item?.index){
        if(!row?.checked) setShow(true);
        return { ...old[item?.index], checked: !row?.checked };
      } else {
        if(row?.checked) setShow(true);
        return row;
      }
    }));
  }

  const onClickLink = row => {
    setVisible(true);
    setInvNo(row?.original?.invoiceNo);
    setEmp(row?.original);
  }

  const onRowClick = row => onClickAdd(row?.original);

  const onBack = () => {
    setVisible(false);
    setEmp(null);
    setInvNo(null);
  }

  const onPay = () => {
    onBack();
    getData && getData();
  }

  const onDone = async () => {
    onSubscribe(emp);
    onBack();
  }
  
  const maxHeight = size?.width > 440
    ? 'calc(100vh - var(--header-height) - var(--page-padding) * 3 - 7px - 51px - 10px - 37px)'
    : 'calc(100vh - var(--header-height) - var(--page-padding) * 3 - 7px - 105px - 10px - 37px)';
  const tableInstance = useTable({ columns, data, autoResetPage: false, autoResetSortBy: false, initialState: { pageIndex: 0, pageSize: 25 },
    onClickCheckAll, checked, onClickCheck, onClickLink }, useSortBy, usePagination, useRowSelect);
  const tableProps = { tableInstance, onRowClick };
  let subProps = { visible, invNo, emp, onBack, onDone, onPay, getData };

  return (
    <div>
      {visible && <Subscription {...subProps} />}
      <div className='table_scroll' style={{overflowX: 'scroll'}}>
        <div id='paging' style={{marginTop: 10, overflowY: 'scroll', maxHeight, minWidth: 720}}>
          <Table {...tableProps} />
        </div>
      </div>
      <PaginationTable {...tableProps} />
    </div>
  )
}