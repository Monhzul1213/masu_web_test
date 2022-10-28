import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useTable, usePagination, useRowSelect, useSortBy } from 'react-table';
import { useSelector, useDispatch } from 'react-redux';

import { Empty, ButtonRowAdd, Table, Overlay } from '../../all';
import { Add } from './store';
import { getList } from '../../../services';

export function Shop(props){
  const { active } = props;
  const { t, i18n } = useTranslation();
  const [visible, setVisible] = useState(false);
  const [data, setData] = useState([]);
  const [columns, setColumns] = useState([]);
  const [item, setItem] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const { user, token }  = useSelector(state => state.login);
  const dispatch = useDispatch();

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [i18n?.language]);

  useEffect(() => {
    if(active === 'store') getData();
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active]);

  const getData = async () => {
    setError(null);
    setLoading(true);
    const response = await dispatch(getList(user, token, 'Site/GetSite'));
    console.log(response);
    if(response?.error) setError(response?.error);
    else setData(response?.data);
    setLoading(false);
  }

  const onClickAdd = row => {
    setVisible(true);
    setItem(row?.original);
  }

  const closeModal = toGet => {
    setVisible(false);
    setItem(null);
    if(toGet) getData();
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
      <Overlay loading={loading}>
        {!data?.length ? <Empty {...emptyProps} /> :
          <div className='card_container'>
            <ButtonRowAdd {...addProps} />
            <div style={{marginTop: 10, overflowY: 'scroll', maxHeight}}>
              <Table {...tableProps} />
            </div>
          </div>
        }
      </Overlay>
    </div>
  );
}