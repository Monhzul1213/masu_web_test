import React, { useState, useEffect } from 'react';
import { useTable, usePagination, useRowSelect, useSortBy } from 'react-table';
import { useTranslation } from 'react-i18next';
import moment from 'moment';
import { useNavigate, createSearchParams } from 'react-router-dom';
import { Check, PaginationTable, Table } from '../../../all/all_m';
import { Rate } from 'antd';

export function List(props){
  const { data, size ,setData, setShow, checked, setChecked } = props;
  const [columns, setColumns] = useState([]);
  const [maxHeight, setMaxHeight] = useState('300px');
  const { t, i18n } = useTranslation();
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
      {id : 'reviewType',  Header: t('noti.type'), accessor: d => { return d.reviewType === 'ALL' ? 'Бүх хэрэглэгч' : 'Сонгосон хэрэглэгч' } },
      { Header: t('invoice.begin'), accessor: 'beginDate', customStyle: { minWidth: 100 },
        Cell: ({ value }) => (<div>{moment(value).format('yyyy.MM.DD')}</div>)
      },      
      { Header: t('invoice.end'), accessor: 'endDate', customStyle: { minWidth: 100 },
        Cell: ({ value }) => (<div>{moment(value).format('yyyy.MM.DD')}</div>)
      },
      { Header: t('rating.title'), accessor: 'avgRating', customStyle: { minWidth: 50 },
      Cell: ({ value }) => ( <div>{ <Rate style={{fontSize: 18, padding: 0}} defaultValue={0} value={value} allowHalf={true} disabled/>}</div>)
      },
      { id: 'status', Header: t('order.status'),  accessor: d => { return d.status === 0 ? 'Идэвхгүй' : 'Идэвхтэй' }, customStyle: { minWidth: 70 },},
    ]);
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [i18n?.language]);

  useEffect(() => {
    if(size?.width >= 660) setMaxHeight('calc(100vh - var(--header-height) - var(--page-padding) * 3 - 7px - 51px - 10px - 107px)');
    else setMaxHeight('calc(100vh - var(--header-height) - var(--page-padding) * 3 - 7px - 110px - 10px - 107px)');
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [size?.width]);

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
    navigate({ pathname: 'rating_add', search: createSearchParams({ reviewId: row?.original?.reviewId}).toString() });
  }
  const tableInstance = useTable({ columns, data, autoResetPage: false, autoResetSortBy: false,
    initialState: { pageIndex: 0, pageSize: 25, sortBy: [{ id: 'beginDate', desc: true }] }, 
    onClickCheckAll, checked, onClickCheck }, useSortBy, usePagination, useRowSelect);
  const tableProps = { tableInstance, onRowClick,  hasTotal: true , total: data?.length };

  return (
    <div>
      <div className='table_scroll' style={{overflowX: 'scroll'}}>
        <div id='paging' style={{marginTop: 10, overflowY: 'scroll', maxHeight, minWidth: 720}}>
          <Table {...tableProps} />
        </div>
      </div>
      <PaginationTable {...tableProps} />
    </div>
  );
}