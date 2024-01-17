import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useTable, usePagination, useRowSelect, useSortBy } from 'react-table';
import { withSize } from 'react-sizeme';
import { DynamicBSIcon, TableText } from '../../../all/all_m';
import { ItemSelect, SelectItem } from './SelectItem';
import { Rating } from 'react-simple-star-rating'

export function Card(props){
  const { data, setData, search, setSearch, setDKits, type } = props;
  const { t, i18n } = useTranslation();
  const [columns, setColumns] = useState([]);

  useEffect(() => {
    setColumns([
      {
        Header: t('noti.customer'), accessor: 'descr',
        Cell: ({ row }) => (<SelectItem item={row?.original} />)
      },
      { Header: <div >{t('noti.email')}</div>, accessor: 'email', width: 80 },
      { Header: <div >{t('rating.reviewType')}</div>, accessor: 'reviewType', width: 70 },
      { id: 'isShow', Header: <div >{t('rating.isShow')}</div>, accessor: d => {return d.isShow !== "Y" ? <DynamicBSIcon className='check_icon1' name='BsCheckSquare' /> : <DynamicBSIcon className='check_icon' name='BsCheckSquareFill' /> }, width: 70 },
      { Header: <div >{t('rating.title')}</div>, accessor: 'rating', width: 70,
        Cell: ({ value }) => ( <div>{ <Rating size={20} initialValue={value} readonly/>}</div>)
      },
      // { Header: <div >{t('rating.ratingText')}</div>, accessor: 'ratingText', width: 70 },
      data?.length === 0 ? { id: 'delete', noSort: true, Header: '', customStyle: { width: 40 },
        Cell: ({ row, onClickDelete }) =>
          (<div className='ac_delete_back'><DynamicBSIcon name='BsTrashFill' className='ac_delete' onClick={() => onClickDelete(row)} /></div>)
      } : { id: 'delete', noSort: true, Header: '', accessor: ''},
    ]);
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [i18n?.language]);

  const onClickDelete = row => {
    if(row?.original?.reviewId || row?.original?.reviewId === 0) setDKits(old => [...old, row?.original]);
    setData(data?.filter(item => item?.merchantId !== row?.original?.merchantId));
    setSearch({ value: null });
  }



  const newItem = cust => {
    return { email: cust.email, descr: cust.descr, merchantId: cust?.merchantId , createdDate: cust?.createdDate, 
      isShow : cust?.status, address: cust?.address};
  }

  const maxHeight = 'calc(100vh - var(--header-height) - var(--page-padding) * 4 - 150px - var(--pg-height))';
  const tableInstance = useTable({ columns, data, autoResetPage: false, 
    initialState: { pageIndex: 0, pageSize: 10000, sortBy: [{ id: 'showDate', desc: true }] }, onClickDelete },
    useSortBy, usePagination, useRowSelect);
  const tableProps = { tableInstance, detailName: 'ratingText', colSpan: 5 };
  const selectProps = { search, setSearch, data, setData, newItem, type };

  return (
    <div className='ia_back_z1'>
      <p className='ac_title'>{t('noti.selected_cus')}</p> 
      <div >
        <div id='paging' className='table_scroll' style={{overflowY: 'scroll', maxHeight}}>
          <TableText {...tableProps} />
        </div>
        <ItemSelect {...selectProps} />
      </div>
    </div>
  );
}

const withSizeHOC = withSize();
export const CardInvt = withSizeHOC(Card);