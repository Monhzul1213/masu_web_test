import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useTable, usePagination, useRowSelect, useSortBy } from 'react-table';
import { useNavigate, createSearchParams } from 'react-router-dom';

import { Check, PaginationTable, Table } from '../../all/all_m';

export function List(props){
  const { data, setData, loaded, setShow, autoResetExpanded, checked, setChecked, size} = props;
  const { t, i18n } = useTranslation();
  const [columns, setColumns] = useState([]);
  const navigate = useNavigate();
  const [maxHeight, setMaxHeight] = useState('300px');

  useEffect(() => {
    if(size?.width >= 920) setMaxHeight('calc(100vh - var(--header-height) - var(--page-padding) * 6 - 37px - 90px)');
    else if(size?.width < 920 && size?.width >= 720)
      setMaxHeight('calc(100vh - var(--header-height) - var(--page-padding) * 6 - 90px)');
    else if(size?.width < 720)
      setMaxHeight('calc(100vh - var(--header-height) - var(--page-padding) * 4 - 38px - 137px)');
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [size?.width]);


  useEffect(() => {
    const style = { display: 'flex', alignItems: 'center', justifyContent: 'center'};
    setColumns([
      {
        id: 'check', noSort: true, isBtn: true,
        Header: <div style={style}><Check checked={checked} onClick={onClickCheckAll} /></div>,
        Cell: ({ row }) => <div style={style}><Check checked={row?.original?.checked} onClick={e => onClickCheck(e, row)} /></div>,
      },
      { Header: t('supplier.name'), accessor: 'vendName' },
      { Header: t('supplier.contact'), accessor: 'contact',
        Cell: props => <div >{props.value}</div>},
      { Header: t('page.phone'), accessor: 'phone' , 
        Cell: props => <div style={{fontSize: 13.5, paddingRight: 15}}>{props.value}</div>},
      { Header: t('page.email'), accessor: 'email',
        Cell: props => <div style={{fontSize: 13.5, paddingRight: 15}}>{props.value}</div> },
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

  const onRowClick = row => {
    navigate({ pathname: 'supp_add', search: createSearchParams({ vendId: row?.original?.vendId }).toString() });
  }

  const tableInstance = useTable( { columns, data, autoResetPage: false, autoResetExpanded, initialState: { pageIndex: 0, pageSize: 25 },
    onClickCheckAll, checked, onClickCheck}, useSortBy, usePagination, useRowSelect);
  const tableProps = { tableInstance, onRowClick ,  hasTotal: true , total: data?.length  };

  return (
    <div >
      <div className='table_scroll' style={{overflowX: 'scroll'}} >
        <div id='paging' style={{marginTop: 10, overflowY: 'scroll', maxHeight, minWidth: 720}}>
              <Table {...tableProps} />
        </div>
      </div>
      <PaginationTable {...tableProps} />
    </div>
  )
}