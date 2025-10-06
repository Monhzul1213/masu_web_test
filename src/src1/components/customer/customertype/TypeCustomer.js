import React, { useState, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useTable, usePagination, useRowSelect, useSortBy, useBlockLayout, useResizeColumns } from 'react-table';

import { DynamicBSIcon, Money, TableResize } from '../../../../components/all';
import { CustSelect } from './SelectItem';


export function TypeCustomer(props){
  const { data, size, setData, setEdited, search, setSearch, setDItems} = props;
  const { t, i18n } = useTranslation();
  const [columns, setColumns] = useState([]);

  useEffect(() => {
    setColumns([
      {
        id: 'delete', noSort: true, Header: '', width: 40, minWidth: 40, maxWidth: 40,
        Cell: ({ row, onClickDelete }) => <div className='ac_delete_back'><DynamicBSIcon name='BsDashCircleFill' className='v2_ac_delete' onClick={() => onClickDelete(row)} /></div>
      },
      { Header: t('customer.t_name'), accessor: 'custName', exLabel: t('customer.t_name'),  width: 200, minWidth: 100, },
      { Header: <div style={{textAlign: 'right'}}> {t('customer.receivable_limit')}</div>, accessor: 'arBalanceMaxLimit', isBtn: true, width: 120, minWidth: 40, exLabel: t('customer.receivable_limit'),
        Cell: ({ value }) => {
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
      { Header: t('customer.phone1'), accessor: 'phone', exLabel: t('customer.phone1'),  width: 100, minWidth: 40,
        Cell: props => <div >{props.value}</div>},
      { Header: t('shop.city'), accessor: 'branchName', exLabel: t('shop.city'), width: 140, minWidth: 40,},
      { Header: t('shop.district'), accessor: 'subBranchName', exLabel: t('shop.district'), width: 150, minWidth: 40,},
      { Header: t('customer.code'), accessor: 'custCode', exLabel: t('customer.code'), width: 120, minWidth: 40,}
    ]);
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [i18n?.language]);

  const newItem = (items) => {
    return {
      custName: items?.custName, custId: items?.custId, arBalance: items?.arBalance, arBalanceMaxLimit: items?.arBalanceMaxLimit,
      address: items?.address, branchCode: items?.branchCode, city: items?.city, country: items?.country, custCode: items?.custCode,
      customerTypeId: items?.customerTypeId, email: items?.email, rowStatus: 'I', phone: items?.phone, status: items?.status, 
      subBranchCode: items?.subBranchCode, typeName: items?.typeName
    };
  }

  const onClickDelete = row => {
    if(row?.original?.custId !== 0) setDItems(old => [...old, row?.original]);
    setData(old => old?.filter(item => item?.custId !== row?.original?.custId));
    setSearch({ value: null });
  }

  const maxHeight = size?.width > 380
  ? 'calc(100vh - var(--header-height) - var(--page-padding) * 3 - 7px - 51px - 10px - 37px)'
  : 'calc(100vh - var(--header-height) - var(--page-padding) * 3 - 7px - 210px - 10px - 37px)';
  const defaultColumn = useMemo(() => ({ minWidth: 30, width: 150, maxWidth: 400 }), []);
  const tableInstance = useTable( { columns, data, defaultColumn, autoResetPage: false,  initialState: { pageIndex: 0, pageSize: 1000000}, onClickDelete}, useSortBy, usePagination, useRowSelect, useBlockLayout, useResizeColumns);
  const tableProps = { tableInstance };
  const selectProps = { search, setSearch, data, setData, newItem , setEdited};

  return (
    <div >
      <div style={{overflow: 'scroll'}} >
        <div className='table_scroll' id='paging' style={{marginTop: 10, overflowY: 'scroll', maxHeight, minWidth : 700}}>
          <TableResize {...tableProps} />
        </div>
      </div>
      <CustSelect {...selectProps}/>
    </div>
  )
}