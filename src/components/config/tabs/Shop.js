import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useTable, usePagination, useRowSelect, useSortBy } from 'react-table';

import { Empty, ButtonRowAdd, Table } from '../../all';
import { Add } from './store';

export function Shop(){
  const { t, i18n } = useTranslation();
  const [visible, setVisible] = useState(false);
  const [data, setData] = useState([]);
  const [columns, setColumns] = useState([]);
  const [item, setItem] = useState(null);

  useEffect(() => {
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setColumns([
      { Header: t('shop.t_name'), accessor: 'label' },
      { Header: t('shop.t_addr'), accessor: 'address' },
      {
        Header: <div style={{textAlign: 'right'}}>{t('shop.t_pqty')}</div>, accessor: 'qty',
        Cell: props => <div style={{textAlign: 'right', paddingRight: 15}}>{props.value}</div>
      },
    ]);
    return () => {};
  }, [i18n?.language]);

  const onClickAdd = row => {
    setVisible(true);
    setItem(row?.original);
  }

  const closeModal = toGet => {
    setVisible(false);
    setItem(null);
    //if(toGet) getdata
  }

  const maxHeight = 'calc(100vh - var(--header-height) - var(--page-padding) * 4 - 36px - 10px)';
  const tableInstance = useTable( { columns, data, initialState: { pageIndex: 0, pageSize: 25 }}, useSortBy, usePagination, useRowSelect);
  const tableProps = { tableInstance, onRowClick: onClickAdd };
  const emptyProps = { icon: 'MdStorefront', type: 'shop', noDescr: true, onClickAdd };
  const modalProps = { visible, closeModal, selected: item };
  const addProps = { type: 'shop', onClickAdd };

  return (
    <div>
      {visible && <Add {...modalProps} />}
      {!data?.length ? <Empty {...emptyProps} /> :
        <div className='card_container'>
          <ButtonRowAdd {...addProps} />
          <div style={{marginTop: 10, overflowY: 'scroll', maxHeight}}>
            <Table {...tableProps} />
          </div>
        </div>
      }
    </div>
  );
}