import React, { useState, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useTable, usePagination, useRowSelect, useSortBy, useBlockLayout, useResizeColumns } from 'react-table';

import { Check, Money, Empty1, TableRowResize} from '../../../../components/all';
import { Transaction } from './Transaction';
import { Header } from './Header';


export function List(props){
  const { onClickAdd, data,  setData, loaded, setShow, checked, setChecked, size, excelName, onClickDelete, show, setError, onSearch} = props;
  const { t, i18n } = useTranslation();
  const [columns, setColumns] = useState([]);
  const [visible, setVisible] = useState(false);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    const style = { display: 'flex', alignItems: 'center', justifyContent: 'center'};
    setColumns([
      {
        id: 'check', noSort: true, isBtn: true, width: 40, minWidth: 40,
        Header: <div style={style}><Check checked={checked} onClick={onClickCheckAll} /></div>,
        Cell: ({ row }) => <div style={style}><Check checked={row?.original?.checked} onClick={e => onClickCheck(e, row)} /></div>,
      },
      { Header: t('discount.type'), accessor: 'typeName', exLabel: t('discount.type'), Footer: <div style={{textAlign: 'left'}}>{t('report.total') + data?.length}</div>,  width: 100, minWidth: 40},
      { Header: t('customer.t_name'), accessor: 'custName', exLabel: t('customer.t_name'),  width: 250, minWidth: 100, },
      { Header: <div style={{textAlign: 'right'}}>{t('customer.code')}</div>, accessor: 'custCode', exLabel: t('customer.code'),
        Cell: props => <div style={{textAlign: 'right', paddingRight: 15}}>{props?.value }</div>, width: 120, minWidth: 40,},
      { Header: t('customer.phone1'), accessor: 'phone', exLabel: t('customer.phone1'),  width: 100, minWidth: 40,
        Cell: props => <div >{props.value}</div>},
      { Header: <div style={{textAlign: 'right'}}> {t('customer.receivable_limit')}</div>, accessor: 'arBalanceMaxLimit', isBtn: true, width: 120, minWidth: 40, exLabel: t('customer.receivable_limit'),
        Cell: ({ value, row, onClickLink }) => {
          return  (<div style={{textAlign: 'right', paddingRight: 15}}><Money value={value} /></div>);
        },
        Footer: info => {
          const total = React.useMemo(() =>
            info.rows.reduce((sum, row) => row.values.arBalanceMaxLimit + sum, 0),
            [info.rows]  )
          return <><div style={{textAlign: 'right', paddingRight: 10}}>{<Money value={total} />} </div></>
        }
      },
      { Header: <div style={{textAlign: 'right'}}> {t('customer.receivable')}</div>, accessor: 'arBalance', isBtn: true, width: 120, minWidth: 40, exLabel: t('customer.receivable'),
        Cell: ({ value, row, onClickLink }) => {
          return  (<div style={{textAlign: 'right', paddingRight: 15}} className='table_link' onClick={() => onClickLink(row)}><Money value={value} /></div>);
        },
        Footer: info => {
          const total = React.useMemo(() =>
            info.rows.reduce((sum, row) => row.values.arBalance + sum, 0),
            [info.rows]  )
          return <><div style={{textAlign: 'right', paddingRight: 10}}>{<Money value={total} />} </div></>
        }
      },
      { Header: t('shop.city'), accessor: 'branchName', exLabel: t('shop.city'), width: 140, minWidth: 40,},
      { Header: t('shop.district'), accessor: 'subBranchName', exLabel: t('shop.district'), width: 150, minWidth: 40,},
      { Header: t('customer.address'), accessor: 'address', exLabel: t('customer.address'), width: 120, minWidth: 40,
        Cell: props => <div >{props.value}</div>},
      { Header: t('employee.mail'), accessor: 'email', exLabel: t('employee.mail'), width: 150, minWidth: 40,
        Cell: props => <div >{props.value}</div>},
      { Header: t('order.note'), accessor: 'note', exLabel: t('order.note'), width: 120, minWidth: 40,},
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
  const defaultColumn = useMemo(() => ({ minWidth: 30, width: 150, maxWidth: 400 }), []);
  const maxHeight = size?.width > 780
  ? 'calc(100vh - var(--header-height) - var(--page-padding) * 3 - 7px - 51px - 10px - 37px)'
  : 'calc(100vh - var(--header-height) - var(--page-padding) * 3 - 7px - 105px - 10px - 37px)';
const tableInstance = useTable( { columns, data, defaultColumn, autoResetPage: false, initialState: { pageIndex: 0, pageSize: 250000 },
    onClickCheckAll, checked, onClickCheck, onClickLink}, useSortBy, usePagination, useRowSelect, useBlockLayout, useResizeColumns);
  const tableProps = { tableInstance, onRowClick: onClickAdd, hasFooter: true };
  let subProps = { visible, closeModal , selected};
  const filterProps = { columns, data, setData, excelName, size, onClickAdd, onClickDelete, show, setError, onSearch };
  const emptyProps = { icon: 'MdSupervisorAccount', type: 'customer', noDescr: true , isMd : true};

  return (
    <div >
      <Header {...filterProps} />
      {visible && <Transaction {...subProps} />}
      {!data?.length ? <Empty1 {...emptyProps} /> : 
      <div style={{overflowX: 'scroll'}}>
        <div className='table_scroll' id='paging' style={{marginTop: 10, overflow: 'scroll', maxHeight, minWidth: 520}}>
            <TableRowResize {...tableProps} />
        </div>
      </div>}
    </div>
  )
}