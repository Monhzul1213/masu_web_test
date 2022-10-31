import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useTable, usePagination, useRowSelect, useSortBy } from 'react-table';
import { useTranslation } from 'react-i18next';

import { getList } from '../../../services';
import { ButtonRowAdd, Empty, Error1, Overlay, PaginationTable, Table } from '../../all';
import { Add } from './pos1';

export function Pos(props){
  const { active, setActive } = props;
  const { t, i18n } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState([]);
  const [sites, setSites] = useState([]);
  const [visible, setVisible] = useState(false);
  const [item, setItem] = useState(null);
  const [showPos, setShowPos] = useState(true);
  const [columns, setColumns] = useState([]);
  const [site, setSite] = useState(-1);
  const { user, token }  = useSelector(state => state.login);
  const dispatch = useDispatch();

  useEffect(() => {
    if(active === 'pos') getData();
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active]);

  useEffect(() => {
    setColumns([
      { Header: t('pos.t_name'), accessor: 'descr' },
      { Header: t('pos.t_site'), accessor: 'name' },
      { Header: t('pos.t_status'), accessor: 'status' },
      { Header: t('pos.t_system'), accessor: 'systemTypeDescr.valueStr1' },
      { Header: t('pos.t_noat'), accessor: 'noat' },
    ]);
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [i18n?.language]);

  const getData = async () => {
    setSites([]);
    let pos = await getPos();
    if(!pos) setShowPos(true);
    else if(!pos?.length){
      const sites = await getSites();
      setShowPos(sites?.length ? true : false);
    }
  }

  const getSites = async () => {
    setError(null);
    setLoading(true);
    const response = await dispatch(getList(user, token, 'Site/GetSite'));
    setLoading(false);
    if(response?.error) {
      setError(response?.error);
      return false;
    } else {
      setSites(response?.data);
      return response?.data;
    }
  }

  const getPos = async () => {
    setError(null);
    setLoading(true);
    let headers = { SiteID: site };
    const response = await dispatch(getList(user, token, 'Site/GetPos', null, headers));
    setLoading(false);
    if(response?.error) {
      setError(response?.error);
      return false;
    } else {
      setData(response?.data);
      return response?.data;
    }
  }

  const onClickAdd = row => {
    setVisible(true);
    setItem(row?.original);
  }

  const onClickShop = () => setActive(['store']);

  const closeModal = toGet => {
    setVisible(false);
    setItem(null);
    if(toGet) getPos();
  }

  const tableInstance = useTable({ columns, data, autoResetPage: false, initialState: { pageIndex: 0, pageSize: 25 }},
    useSortBy, usePagination, useRowSelect);
  const tableProps = { tableInstance, onRowClick: onClickAdd };
  const emptyProps = { icon: 'MdStayCurrentPortrait', type: showPos ? 'pos' : 'pos1', onClickAdd: showPos ? onClickAdd : onClickShop };
  const addProps = { type: 'pos', onClickAdd };
  const maxHeight = 'calc(100vh - var(--header-height) - var(--page-padding) * 4 - 36px - 10px - var(--pg-height) - 5px)';
  const modalProps = { visible, closeModal, selected: item, sites, getSites };

  return (
    <div>
      {visible && <Add {...modalProps} />}
      <Overlay loading={loading}>
        {error && <Error1 error={error} />}
        {!data?.length ? <Empty {...emptyProps} /> :
          <div className='card_container'>
            <ButtonRowAdd {...addProps} />
            <div id='paging' style={{marginTop: 10, overflowY: 'scroll', maxHeight}}>
              <Table {...tableProps} />
            </div>
            <PaginationTable {...tableProps} />
          </div>
        }
      </Overlay>
    </div>
  )
}