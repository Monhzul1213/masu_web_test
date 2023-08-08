import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { withSize } from 'react-sizeme';

import { deleteRequest, getList } from '../../services';
import { Empty, Error1, Overlay, ButtonRowAddConfirm, PlainSelect, Empty1 } from '../../components/all';
import { Add, List } from '../../components/config/pos';

function Screen(props){
  const { size } = props;
  const { t } = useTranslation();
  const [loading, setLoading] = useState(null);
  const [error, setError] = useState(null);
  const [data, setData] = useState([]);
  const [filtering, setFiltering] = useState(false);
  const [showPos, setShowPos] = useState(true);
  const [visible, setVisible] = useState(false);
  const [item, setItem] = useState(null);
  const [show, setShow] = useState(false);
  const [site, setSite] = useState(-1);
  const [sites, setSites] = useState([{siteId: -1, name: t('pos.all')}]);
  const [sites1, setSites1] = useState([]);
  const [checked, setChecked] = useState(false);
  const { user, token }  = useSelector(state => state.login);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    getData();
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getData = async () => {
    let pos = await getPos(site);
    if(!pos) setShowPos(true);
    else {
      const sites = await getSites();
      setShowPos(sites?.length ? true : false);
    }
  }

  const getPos = async SiteID => {
    setError(null);
    setLoading(true);
    setShow(false);
    let headers = { SiteID };
    const response = await dispatch(getList(user, token, 'Site/GetPos', null, headers));
    setLoading(false);
    setFiltering(SiteID !== -1);
    if(response?.error) {
      setError(response?.error);
      return false;
    } else {
      setData(response?.data);
      return response?.data;
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

  const onClickAdd = row => {
    setVisible(true);
    setItem(row?.original);
  }
  
  const onClickShop = () => navigate('/config/store');

  const onClickDelete = async () => {
    let toDelete = [];
    data?.forEach(item => { if(item?.checked) toDelete?.push({ siteId: item?.siteId, terminalId: item?.terminalId }) });
    setError(null);
    setLoading(true);
    const response = await dispatch(deleteRequest(user, token, 'Site/DeletePos', toDelete));
    if(response?.error) {
      setError(response?.error);
      setLoading(false);
    }
    else getPos(site);
  };

  const onSelectSite = value => {
    setSite(value);
    getPos(value);
  }

  const closeModal = toGet => {
    setVisible(false);
    setItem(null);
    if(toGet) getPos(site);
  }

  const width = size?.width >= 720 ? 720 : size?.width;
  const id = size?.width > 380 ? 'mo_large' : 'mo_small';
  const emptyProps = { icon: 'MdStayCurrentPortrait', type: showPos ? 'pos' : 'pos1', onClickAdd: showPos ? onClickAdd : onClickShop };
  const addProps = { type: 'pos', onClickAdd, show, onClickDelete };
  const siteProps = { value: site, setValue: onSelectSite, data: sites1, s_value: 'siteId', s_descr: 'name', className: 'r_select' };
  const listProps = { data, setData, setShow, checked, setChecked, onClickAdd };
  const modalProps = { visible, closeModal, selected: item, sites, getSites };

  return (
    <div className='store_tab' style={{flex: 1}}>
      <Overlay loading={loading}>
        {error && <Error1 error={error} />}
        {visible && <Add {...modalProps} />}
        {!data?.length && !filtering ? <Empty {...emptyProps} /> :
          <div className='mo_container' style={{ width }}>
            <div className='ih_header' id={id}>
              <ButtonRowAddConfirm {...addProps} />
              <PlainSelect {...siteProps} />
            </div>
            {!data?.length ? <Empty1 {...emptyProps} /> : <List {...listProps} />}
          </div>
        }
      </Overlay>
    </div>
  );
}

const withSizeHOC = withSize();
export const Pos = withSizeHOC(Screen);