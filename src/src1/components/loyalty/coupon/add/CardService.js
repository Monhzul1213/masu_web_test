import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useTable, usePagination, useRowSelect, useSortBy } from 'react-table';
import { withSize } from 'react-sizeme';

import { PaginationTable, Table, DynamicBSIcon, IconButton } from '../../../all/all_m';
import { ItemSelect, SelectItem } from './SelectItem';
import { Service } from '../../service/Service';

export function Card(props){
  const { data, setData, search, setSearch, setDKits } = props;
  const { t, i18n } = useTranslation();
  const [columns, setColumns] = useState([]);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setColumns([
      {
        Header: t('coupon.consumer'), accessor: 'firstName',
        Cell: ({ row }) => (<SelectItem item={row?.original} />)
      },
      {
        Header: t('coupon.phone'), accessor: 'phone',
      },      {
        Header: t('coupon.email'), accessor: 'email',
      },      {
        Header: t('coupon.age'), accessor: 'age',
      },      {
        Header: t('coupon.gender'), accessor: 'gender',
      },
      { id: 'delete', noSort: true, Header: '', customStyle: { width: 40 },
        Cell: ({ row, onClickDelete }) =>
          (<div className='ac_delete_back'><DynamicBSIcon name='BsTrashFill' className='ac_delete' onClick={() => onClickDelete(row)} /></div>)
      },
    ]);
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [i18n?.language]);

  const onClickDelete = row => {
    if(row?.original?.consumerId || row?.original?.consumerId === 0) setDKits(old => [...old, row?.original]);
    setData(data?.filter(item => item?.consumerId !== row?.original?.consumerId));
    setSearch({ value: null });
  }

  const onClick = () => {
    setVisible(true)
  }

  const closeModal = () => {
    setVisible(false)
  }

  const newItem = consumer => {
    return { consumerId: consumer.consumerId, firstName: consumer.firstName, phone: consumer.phone, email: consumer.email, 
      age: consumer.age, gender: consumer.gender, status: consumer.status  };
  }

  const maxHeight = 'calc(100vh - var(--header-height) - var(--page-padding) * 4 - 150px - var(--pg-height))';
  const tableInstance = useTable({ columns, data, autoResetPage: false, initialState: { pageIndex: 0, pageSize: 25 }, onClickDelete },
    useSortBy, usePagination, useRowSelect);
  const tableProps = { tableInstance };
  const selectProps = { search, setSearch, data, setData, newItem };
  const addProps = { className: 'po_add_btn', text: t('coupon.consumer_add'), icon: <DynamicBSIcon name='BsPlusLg' className='po_add_icon' />, onClick };
  const modalProps = { visible, closeModal, data , setItem: setData, setVisible};

  return (
    <div className='cou_site_back'>
      {visible && <Service {...modalProps}/>}
        <div className='cou_title_back'>
          <p className='ac_title'>{t('coupon.consumer')}</p>
          <IconButton {...addProps}/>
        </div>
        <div id='paging' style={{overflowY: 'scroll', maxHeight}}>
          <Table {...tableProps} />
        </div>
        <ItemSelect {...selectProps} />
        <PaginationTable {...tableProps} />
    </div>
  );
}

const withSizeHOC = withSize();
export const CardService = withSizeHOC(Card);