import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useTable, usePagination, useRowSelect, useSortBy } from 'react-table';
import { formatNumber } from '../../helpers';
import { Check, PaginationTable, DynamicFAIcon  } from '../all/all_m';
import { Table  } from '../all/all_m';


export function List(props){
  const { onClickAdd, data, setData, loaded, setShow} = props;
  const { t, i18n } = useTranslation();
  const [columns, setColumns] = useState([]);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    setShow(false);
    setChecked(false);
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loaded])

  useEffect(() => {
    const customStyle = { width: 30 };
    const style = { display: 'flex', alignItems: 'center', justifyContent: 'center'};
    setColumns([
      { id: 'expander', noSort: true, isBtn: true, customStyle, Header: '',
        Cell: ({ row }) => !row?.original?.msInventoryVariants?.length ? '' :
          (<div style={style}>
            <DynamicFAIcon {...row.getToggleRowExpandedProps()} name={row.isExpanded ? 'FaChevronUp': 'FaChevronDown'} className='t_expand' />
          </div>)
      },
      {
        id: 'check', noSort: true, isBtn: true,
        Header: <div style={style}><Check checked={checked} onClick={onClickCheckAll} /></div>,
        Cell: ({ row }) => <div style={style}><Check checked={row?.original?.checked} onClick={e => onClickCheck(e, row)} /></div>,
      },
      { Header: t('customer.t_name'), accessor: 'custName' },
      { Header: t('customer.addr'), accessor: 'phone',
        Cell: props => <div >{props.value}</div>},
      { Header: t('customer.first_visit'), accessor: 'createdDate' },
      { Header: t('customer.last_visit'), accessor: 'lastUpdate' },
      { Header: <div style={{textAlign: 'right'}}>{t('customer.visit_total')}</div>, accessor: 'total', 
        Cell: props => <div style={{textAlign: 'right', paddingRight: 15}}>{formatNumber(props.value)}</div>},
      { Header: <div style={{textAlign: 'right'}}>{t('customer.total_spent')}</div>, accessor: 'total_spent', 
        Cell: props => <div style={{textAlign: 'right', paddingRight: 15}}>₮{formatNumber(props.value)}</div>},
      { Header: <div style={{textAlign: 'right'} }>{t('customer.total_balance')}</div> , accessor: 'total_balance'  ,
      Cell: props => <div style={{textAlign: 'right', paddingRight: 15}}>{formatNumber(props.value)}</div>},
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

 

  const maxHeight = 'calc(100vh - var(--header-height) - var(--page-padding) * 4 - 36px - 10px - var(--pg-height) - 5px)';
  const tableInstance = useTable( { columns, data, autoResetPage: false, initialState: { pageIndex: 0, pageSize: 25 },
    onClickCheckAll, checked, onClickCheck}, useSortBy, usePagination, useRowSelect);
  const tableProps = { tableInstance, onRowClick: onClickAdd, };

  return (
    <div >
      <div style={{overflowX: 'scroll'}} />
        <div id='paging' style={{marginTop: 10, overflowY: 'scroll', maxHeight}}>
              <Table {...tableProps} />
        </div>
      <PaginationTable {...tableProps} />
    </div>
  )
}