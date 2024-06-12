import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useTable, usePagination, useRowSelect, useSortBy } from 'react-table';
import { withSize } from 'react-sizeme';

import { PaginationTable, Table, DynamicBSIcon, IconButton, Money } from '../../../../../src1/components/all/all_m';
import { ItemSelect, SelectItem } from './SelectItem';
import { Service } from '../../service/Service';


export function Card(props){
  const { data, setData, search, setSearch, setDKits, number } = props;
  const { t, i18n } = useTranslation();
  const [columns, setColumns] = useState([]);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setColumns([
      { Header: t('voucher.consumer'), accessor: 'consumerName',
        Cell: ({ row }) => (<SelectItem item={row?.original} />)
      },
      { Header: t('voucher.phone'), accessor: 'phone'},      
      { Header: t('voucher.email'), accessor: 'email'},      
      { Header: t('voucher.age'), accessor: 'age'},     
      { id: 'gender', Header: t('voucher.gender'), accessor: d => { return d.gender === 'M' ? 'Эрэгтэй' : d.gender === 'F' ? 'Эмэгтэй' : '' }},
      {
        Header: (
          <div style={{ textAlign: "right" }}>{t("voucher.consumerVoucherAmt")}</div>
        ),
        accessor: "voucherAmount",
        customStyle: { width: 80 },
        Cell: (props) => (
          <div style={{ textAlign: "right", paddingRight: 15 }}>
            <Money value={props?.value} fontSize={15} />
          </div>
        ),
      },

      {
        Header: (
          <div style={{ textAlign: "right" }}>{t("voucher.AppliedVoucherAmt")}</div>
        ),
        accessor: "salesAmount",
        customStyle: { width: 80 },
        Cell: (props) => (
          <div style={{ textAlign: "right", paddingRight: 15 }}>
            <Money value={props?.value} fontSize={15} />
          </div>
        ),
      },
      { id: 'delete', noSort: true, Header: '', customStyle: { width: 40 },
      Cell: ({ row, onClickDelete }) =>
        (row?.original?.salesAmount > 0 ? '' :<div className='ac_delete_back'><DynamicBSIcon name='BsTrashFill' className='ac_delete' onClick={() => onClickDelete(row)} /></div>)
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
  const selectProps = { search, setSearch, data, setData, newItem, number };
  const addProps = { className: 'po_add_btn', text: t('voucher.consumer_add'), icon: <DynamicBSIcon name='BsPlusLg' className='po_add_icon' />, onClick };
  const modalProps = { visible, closeModal, data , setItem: setData, setVisible, item: data};

  return (
    <div className='vou_service_back'>
      {visible && <Service {...modalProps}/>}
        <div className='cou_title_back'>
          <p className='ac_title'>{t('voucher.consumer')}</p>
          <IconButton {...addProps}/>
        </div>
        <div className='table_scroll' id='paging' style={{overflowY: 'scroll', maxHeight, overflowX: 'scroll'}}>
          <Table {...tableProps} />
        </div>
        <ItemSelect {...selectProps} />
        <PaginationTable {...tableProps} />
    </div>
  );
}

const withSizeHOC = withSize();
export const CardService = withSizeHOC(Card);