import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';

import { deleteRequest, getList } from '../../../services';
import { Empty, Error1, Overlay, PlainSelect } from '../../all';
import { Add, List } from './pos1';

export function Pos(props){
  const { active, setActive } = props;
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState([]);
  const [sites, setSites] = useState([]);
  const [sites1, setSites1] = useState([]);
  const [visible, setVisible] = useState(false);
  const [item, setItem] = useState(null);
  const [showPos, setShowPos] = useState(true);
  const [site, setSite] = useState(-1);
  const [loaded, setLoaded] = useState(0);
  const { user, token }  = useSelector(state => state.login);
  const dispatch = useDispatch();

  useEffect(() => {
    if(active === 'pos') getData();
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active]);

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
  
  const emptyProps = { icon: 'MdStayCurrentPortrait', type: showPos ? 'pos' : 'pos1', onClickAdd: showPos ? onClickAdd : onClickShop };
  const modalProps = { visible, closeModal, selected: item, sites, getSites };
  const siteProps = { value: site, setValue: onSelectSite, data: sites1, s_value: 'siteId', s_descr: 'name', className: 'r_select' };
  const listProps = { onClickAdd, loaded, data, setData, onDelete };

  return (
    <div>
      {visible && <Add {...modalProps} />}
      <Overlay loading={loading}>
        {error && <Error1 error={error} />}
        <div style={{position: 'relative'}}>
          <div className='pos_select'><PlainSelect {...siteProps} /></div>
          {data?.length ? <List {...listProps} /> : <Empty {...emptyProps} />}
        </div>
      </Overlay>
    </div>
  )
}