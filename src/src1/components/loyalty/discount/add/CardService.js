import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useTable, usePagination, useRowSelect, useSortBy } from 'react-table';
import { withSize } from 'react-sizeme';

import { Table, DynamicBSIcon, IconButton, CheckAll } from '../../../all/all_m';
import { ItemSelect, SelectItem } from './SelectItem';
import { Service } from '../../service/Service';
import { config, encrypt } from '../../../../../helpers';

export function Card(props){
  const { data, setData, search, setSearch, setDKits, number, checked, setChecked } = props;
  const { t, i18n } = useTranslation();
  const [columns, setColumns] = useState([]);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setColumns([
      { Header: t('coupon.consumer'), accessor: 'firstName' ,
        Cell: ({ row }) => (<SelectItem item={row?.original} />)
      },
      { Header: t('coupon.phone'), accessor: 'phone'},      
      { Header: t('coupon.email'), accessor: 'email'},      
      { Header: t('coupon.age'), accessor: 'age' },      
      { id: 'gender', Header: t('coupon.gender'), accessor: d => { return d.gender === 'M' ? 'Эрэгтэй' : d.gender === 'F' ? 'Эмэгтэй' : '' }},
      { Header: t('coupon.edit'), accessor: 'salesNo', isBtn: true, customStyle: { maxWidth: 130 },
      Cell: ({ value, row, onClickLink }) => {
        return  (<div style={{textAlign: 'right', paddingRight: 15}} className='table_link' onClick={() => onClickLink(row)}>{value}</div>);
      }
    },      
      { id: 'delete', noSort: true, Header: '', customStyle: { width: 40 },
        Cell: ({ row, onClickDelete }) =>
          ( row?.original?.status === 2 ? '' :<div className='ac_delete_back'><DynamicBSIcon name='BsTrashFill' className='ac_delete' onClick={() => onClickDelete(row)} /></div>)
      },
    ]);
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [i18n?.language]);

  const onClickLink = (row) => {
    let msg = row?.original?.merchantId + '-' + row?.original?.siteID + '-' + row?.original?.salesNo
    let code = encrypt(msg);
    let url = config?.domain + '/Bill?billno=' + encodeURIComponent(code);
    window.open(url);
  }

  const onClickDelete = row => {
    if(row?.original?.consumerId || row?.original?.consumerId === 0) setDKits(old => [...old, row?.original]);
    setData(data?.filter(item => item?.consumerId !== row?.original?.consumerId));
    setSearch({ value: null });
  }

  const onClick = (e) => {
    e?.preventDefault();
    setVisible(true)
  }

  const closeModal = () => {
    setVisible(false);
  }

  const onCheckAll = checked => {
    setChecked(checked);
    setData([]);
  }

  const newItem = consumer => {
    return { consumerId: consumer.consumerId, firstName: consumer.firstName, phone: consumer.phone, email: consumer.email, 
      age: consumer.age, gender: consumer.gender, status: consumer.status  };
  }

  const maxHeight = 'calc(100vh - var(--header-height) - var(--page-padding) * 4 - 150px - var(--pg-height))';
  const tableInstance = useTable({ columns, data, autoResetPage: false, initialState: { pageIndex: 0, pageSize: 10000 }, onClickDelete, onClickLink },
    useSortBy, usePagination, useRowSelect);
  const tableProps = { tableInstance };
  const selectProps = { search, setSearch, data, setData, newItem, number, disabled: checked ? true : false };
  const addProps = { className: 'po_add_btn', text: t('coupon.consumer_add'), icon: <DynamicBSIcon name='BsPlusLg' className='po_add_icon' />, 
                     onClick, disabled: checked ? true : false };
  const modalProps = { visible, closeModal, data , setItem: setData, setVisible, item: data};
  const checkProps = { type: 'discount', checked, onCheckAll, style: {border: 'none'} };

  return (
    <div className='cou_service_back'>
      {visible && <Service {...modalProps}/>}
        <div className='cou_title_back'>
          <p className='ac_title'>{t('coupon.consumer')}</p>
          <IconButton {...addProps}/>
        </div>
        <CheckAll {...checkProps} />
        <div id='paging' style={{overflowY: 'scroll', maxHeight}}>
          <Table {...tableProps} />
        </div>
        <ItemSelect {...selectProps} />
    </div>
  );
}

const withSizeHOC = withSize();
export const CardService = withSizeHOC(Card);