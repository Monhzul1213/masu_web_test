import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useTable, usePagination, useRowSelect, useSortBy } from 'react-table';
import { withSize } from 'react-sizeme';
import { PaginationTable, Table, DynamicBSIcon } from '../../../all/all_m';
import { ItemSelect, SelectItem } from './SelectItem';

export function Card(props){
  const { data, setData, search, setSearch,size, setDKits } = props;
  const { t, i18n } = useTranslation();
  const [columns, setColumns] = useState([]);

  useEffect(() => {
    setColumns([
      {
        Header: t('noti.customer'), accessor: 'descr',
        Cell: ({ row }) => (<SelectItem item={row?.original} />)
      },
      { Header: <div >{t('noti.email')}</div>, accessor: 'email', width: 80 },
      { id: 'delete', noSort: true, Header: '', customStyle: { width: 40 },
        Cell: ({ row, onClickDelete }) =>
          (<div className='ac_delete_back'><DynamicBSIcon name='BsTrashFill' className='ac_delete' onClick={() => onClickDelete(row)} /></div>)
      },
    ]);
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [i18n?.language]);

  const onClickDelete = row => {
    if(row?.original?.notifcationId || row?.original?.notifcationId === 0) setDKits(old => [...old, row?.original]);
    setData(data?.filter(item => item?.merchantId !== row?.original?.merchantId));
    setSearch({ value: null });
  }



  const newItem = cust => {
    return { email: cust.email, descr: cust.descr, merchantId: cust?.merchantId , createdDate: cust?.createdDate, 
      isShow : cust?.status, address: cust?.address};
  }

  const classPage = size?.width > 510 ? 'ii_page_row_large' : 'ii_page_row_small';

  const maxHeight = 'calc(100vh - var(--header-height) - var(--page-padding) * 4 - 150px - var(--pg-height))';
  const tableInstance = useTable({ columns, data, autoResetPage: false, initialState: { pageIndex: 0, pageSize: 25 }, onClickDelete },
    useSortBy, usePagination, useRowSelect);
  const tableProps = { tableInstance };
  const selectProps = { search, setSearch, data, setData, newItem };

  return (
    <div className='ia_back_z'>
      <p className='ac_title'>{t('noti.selected_cus')}</p> 
      {<>
        <div id='paging' style={{overflowY: 'scroll', maxHeight}}>
          <Table {...tableProps} />
        </div>
        <ItemSelect {...selectProps} />
        <div className={classPage}>
          <PaginationTable {...tableProps} />
        </div>
      </>}
    </div>
  );
}

const withSizeHOC = withSize();
export const CardInvt = withSizeHOC(Card);