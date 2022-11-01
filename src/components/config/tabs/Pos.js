import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useTable, usePagination, useRowSelect, useSortBy } from 'react-table';
import { useTranslation } from 'react-i18next';

import { deleteRequest, getList } from '../../../services';
import { ButtonRowAdd, Check, Confirm, Empty, Error1, Overlay, PaginationTable, PlainSelect, Table } from '../../all';
import { Add } from './pos1';

export function Pos(props){
  const { active, setActive } = props;
  const { t, i18n } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState([]);
  const [sites, setSites] = useState([]);
  const [sites1, setSites1] = useState([]);
  const [visible, setVisible] = useState(false);
  const [item, setItem] = useState(null);
  const [showPos, setShowPos] = useState(true);
  const [columns, setColumns] = useState([]);
  const [site, setSite] = useState(-1);
  const [checked, setChecked] = useState(false);
  const [show, setShow] = useState(false);
  const [open, setOpen] = useState(false);
  const [loaded, setLoaded] = useState(0);
  const { user, token }  = useSelector(state => state.login);
  const dispatch = useDispatch();

  useEffect(() => {
    if(active === 'pos') getData();
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active]);


  useEffect(() => {
    const style = { display: 'flex', alignItems: 'center' };
    setColumns([
      {
        id: 'check', noSort: true, isBtn: true,
        Header: <div style={style}><Check checked={checked} onClick={onClickCheckAll} /></div>,
        Cell: ({ row }) => <div style={style}><Check checked={row?.original?.checked} onClick={e => onClickCheck(e, row)} /></div>,
      },
      { Header: t('pos.t_name'), accessor: 'descr' },
      { Header: t('pos.t_site'), accessor: 'name' },
      { Header: t('pos.t_status'), accessor: 'statusDescr.valueStr1' },
      { Header: t('pos.t_system'), accessor: 'systemTypeDescr.valueStr1' },
      { Header: t('pos.t_noat'), accessor: 'noat' },
    ]);
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [i18n?.language, loaded, checked]);

  const getData = async () => {
    let pos = await getPos(site);
    if(!pos) setShowPos(true);
    else {
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
      let sites1 = [...[{siteId: -1, name: t('pos.all')}], ...response?.data];
      setSites1(sites1);
      return response?.data;
    }
  }

  const getPos = async SiteID => {
    setError(null);
    setLoading(true);
    let headers = { SiteID };
    const response = await dispatch(getList(user, token, 'Site/GetPos', null, headers));
    setLoading(false);
    if(response?.error) {
      setError(response?.error);
      return false;
    } else {
      setData(response?.data);
      setLoaded(loaded + 1);
      setChecked(false);
      setShow(false);
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
    if(toGet) getPos(site);
  }

  const onSelectSite = value => {
    setSite(value);
    getPos(value);
  }

  const onClickCheckAll = () => {
    setShow(!checked);
    setChecked(!checked);
    data?.map(item => item.checked = !checked);
  }

  const onClickCheck = (e, row) => {
    e?.preventDefault();
    if(row && row?.original){
      setChecked(false);
      let list = data?.map(item => {
        if(item.terminalId === row?.original?.terminalId)
          item.checked = !item.checked;
        return item;
      });
      setData(list);
      let count = list?.filter(item => item.checked)?.length;
      setShow(count ? true : false);
    }
  }

  const onClickDelete = () => setOpen(true);

  const onDelete = async toDelete => {
    setError(null);
    setLoading(true);
    const response = await dispatch(deleteRequest(user, token, 'Site/DeletePos', toDelete));
    if(response?.error) {
      setError(response?.error);
      setLoading(false);
    }
    else getPos(site);
  }

  const confirm = sure => {
    setOpen(false);
    if(sure){
      let toDelete = [];
      data?.forEach(item => {
        if(item?.checked) toDelete?.push({ siteId: item?.siteId, terminalId: item?.terminalId })
      });
      onDelete(toDelete);
    }
  };


  const tableInstance = useTable({ columns, data, autoResetPage: false, initialState: { pageIndex: 0, pageSize: 25 }},
    useSortBy, usePagination, useRowSelect);
  const tableProps = { tableInstance, onRowClick: onClickAdd };
  const emptyProps = { icon: 'MdStayCurrentPortrait', type: showPos ? 'pos' : 'pos1', onClickAdd: showPos ? onClickAdd : onClickShop };
  const addProps = { type: 'pos', onClickAdd, show, onClickDelete };
  const maxHeight = 'calc(100vh - var(--header-height) - var(--page-padding) * 4 - 36px - 10px - var(--pg-height) - 5px)';
  const modalProps = { visible, closeModal, selected: item, sites, getSites };
  const siteProps = { value: site, setValue: onSelectSite, data: sites1, s_value: 'siteId', s_descr: 'name', className: 'r_select' };
  const confirmProps = { open, text: t('page.delete_confirm'), confirm };

  return (
    <div>
      {visible && <Add {...modalProps} />}
      {open && <Confirm {...confirmProps} />}
      <Overlay loading={loading}>
        {error && <Error1 error={error} />}
        <div className='pos_select'><PlainSelect {...siteProps} /></div>
        {!data?.length ? <Empty {...emptyProps} /> :
          <div className='card_container'>
            <div className='pos_row'>
              <ButtonRowAdd {...addProps} />
            </div>
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