import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useTable, usePagination, useRowSelect, useSortBy } from 'react-table';
import { useNavigate, createSearchParams } from 'react-router-dom';

import { Check, Confirm, PaginationTable , Table, Money } from '../../../../components/all/all_m';


export function List(props){
  const { data, setData, setShow, checked, setChecked } = props;
  const { t, i18n } = useTranslation();
  const [open, setOpen] = useState(false);
  const [columns, setColumns] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const customStyle = { width: 40 }
    const style = { display: 'flex', alignItems: 'center', justifyContent: 'center'};
    setColumns([
      {
        id: 'check', noSort: true, isBtn: true, customStyle,
        Header: ({ onClickCheckAll, checked }) => <div style={style}><Check checked={checked} onClick={onClickCheckAll} /></div>,
        Cell: ({ row, onClickCheck }) => <div style={style}><Check checked={row?.original?.checked} onClick={e => onClickCheck(e, row)} /></div>,
      },
      {Header: <div>{t('page.name')}</div>, accessor: 'discountName'},
      { Header: <div style={{textAlign: 'right',}}>{t('discount.amount')}</div> , accessor: 'discountValue', customStyle: { width: 100 }, width: 80,
      Cell: props => props?.row?.original?.discountType === 1 ? <div style={{textAlign: 'right', paddingRight: 15}}><Money value={props?.value} fontSize={14} /></div> 
      : <div style={{textAlign: 'right', paddingRight: 15}}>{props.value}%</div>
    },
      { id: 'isRestrictedAccess', Header: t('discount.isRestrictedAccess'), customStyle: { width: 120 }, accessor: d => { return d.isRestrictedAccess=== 'Y' ? 'Тийм' : 'Үгүй' }},
      
    ]);
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [i18n?.language]);

  const confirm = sure => {
    setOpen(false);
    
  };
  const onClickCheckAll = e => {
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
  
  const onRowClick = row => {
    navigate({ pathname: 'disc_add', search: createSearchParams({ discountId: row?.original?.discountId }).toString() });
  }
  const confirmProps = { open, text: t('page.delete_confirm'), confirm };
  const tableInstance = useTable({ columns, data, autoResetPage: false, initialState: { pageIndex: 0, pageSize: 25 },
    onClickCheckAll, checked, onClickCheck }, useSortBy, usePagination, useRowSelect);
  const tableProps = { tableInstance, onRowClick};
  
  return (
    <div>
      {open && <Confirm {...confirmProps} />}
      <div style={{height: 20}} />
        <div className='table_scroll' id='paging'>
          <Table {...tableProps}/>
        </div>
      <PaginationTable {...tableProps} />
    </div>
  )
}