import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useTable, usePagination, useRowSelect, useSortBy } from 'react-table';

import { Check, PaginationTable, Money, Table } from '../all/all_m';
import { Transaction } from './Transaction';


export function List(props){
  const { onClickAdd, data,  setData, loaded, setShow, autoResetExpanded, checked, setChecked, size} = props;
  const { t, i18n } = useTranslation();
  const [columns, setColumns] = useState([]);
  const [visible, setVisible] = useState(false);
  const [selected, setSelected] = useState(null);


  useEffect(() => {
    const style = { display: 'flex', alignItems: 'center', justifyContent: 'center'};
    setColumns([
      {
        id: 'check', noSort: true, isBtn: true,
        Header: <div style={style}><Check checked={checked} onClick={onClickCheckAll} /></div>,
        Cell: ({ row }) => <div style={style}><Check checked={row?.original?.checked} onClick={e => onClickCheck(e, row)} /></div>,
      },
      { Header: t('customer.t_name'), accessor: 'custName' },
      { Header: t('customer.phone1'), accessor: 'phone',
        Cell: props => <div >{props.value}</div>},
      { Header: <div style={{textAlign: 'right'}}> {t('customer.arAmt')}</div>, accessor: 'arBalance', isBtn: true, customStyle: { maxWidth: 110 },
        Cell: ({ value, row, onClickLink }) => {
          return  (<div style={{textAlign: 'right', paddingRight: 15}} className='table_link' onClick={() => onClickLink(row)}><Money value={value} fontSize={14} /></div>);
        }
      },
      { Header: t('customer.Email'), accessor: 'email',
        Cell: props => <div >{props.value}</div>},
      { Header: t('customer.address'), accessor: 'address',
        Cell: props => <div >{props.value}</div>},
      { Header: <div style={{textAlign: 'right'}}>{t('customer.code')}</div>, accessor: 'custCode',
        Cell: props => <div style={{textAlign: 'right', paddingRight: 15}}>{props?.value }</div>},
      { Header: t('customer.desc'), accessor: 'note'},
    ]);
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [i18n?.language, loaded, checked]);

  const onClickCheckAll = () => {
    setShow(!checked);
    setChecked(!checked);
    setData(old => old.map((row, index) => {
      return { ...old[index], checked: !checked };
    }));
  }

  const onClickCheck = (e, item) => {
    e?.preventDefault();
    setChecked(false);
    let count = false;
    setData(old => old.map((row, index) => {
      if(index === item?.index){
        if(!row?.checked) count = true;
        return { ...old[item?.index], checked: !row?.checked };
      } else {
        if(row?.checked) count = true;
        return row;
      }
    }));
  
    setShow(count);
  }



  const onClickLink = row => {
    setVisible(true);
    setSelected(row?.original);
  }

  const closeModal = () => {
    setVisible(false);
  }

  const maxHeight = size?.width > 780
  ? 'calc(100vh - var(--header-height) - var(--page-padding) * 3 - 7px - 51px - 10px - 37px)'
  : 'calc(100vh - var(--header-height) - var(--page-padding) * 3 - 7px - 105px - 10px - 37px)';
const tableInstance = useTable( { columns, data, autoResetPage: false, autoResetExpanded, initialState: { pageIndex: 0, pageSize: 25 },
    onClickCheckAll, checked, onClickCheck, onClickLink}, useSortBy, usePagination, useRowSelect);
  const tableProps = { tableInstance, onRowClick: onClickAdd, };
  let subProps = { visible, closeModal , selected};

  return (
    <div >
      <Transaction {...subProps} />
      <div style={{overflowX: 'scroll'}} >
        <div id='paging' style={{marginTop: 10, overflowY: 'scroll', maxHeight, minWidth : 720}}>
              <Table {...tableProps} />
        </div>
      </div>
      <PaginationTable {...tableProps} />
    </div>
  )
}