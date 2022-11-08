import React, { useState, useEffect } from 'react';
import { message } from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import '../../css/invt.css';
import { getList, sendRequest } from '../../services';
import { ButtonRowAdd, Confirm, Empty, Empty1, Error1, Overlay, PlainSelect } from '../../components/all';
import { List } from '../../components/invt/modifier';

export function Modifier(){
  const { t } = useTranslation();
  const [loading, setLoading] = useState(null);
  const [error, setError] = useState(null);
  const [site, setSite] = useState(-1);
  const [sites, setSites] = useState([{siteId: -1, name: t('pos.all')}]);
  const [data, setData] = useState([]);
  const [show, setShow] = useState(false);
  const [filtering, setFiltering] = useState(false);
  const [open, setOpen] = useState(false);
  const [checked, setChecked] = useState(false);
  const { user, token }  = useSelector(state => state.login);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    getData(-1);
    return () => {};
  }, []);

  const onSelectSite = value => {
    setSite(value);
    getData(value);
  }

  const getData = async siteid => {
    setError(null);
    setLoading('loading');
    setFiltering(siteid !== -1 ? true : false);
    let api = siteid === -1 ? 'Inventory/GetModifer' : 'Inventory/GetModifer/SiteID';
    let headers = siteid === -1 ? null : { siteid };
    let response = await dispatch(getList(user, token, api, null, headers));
    if(response?.error) setError(response?.error);
    else {
      response?.data?.forEach(item => {
        let options = item?.modiferItems?.map(mod => mod.optionName);
        item.modifer.options = options?.join(', ');
      });
      setData(response?.data);
      setShow(false);
      setChecked(false);
    }
    setLoading(false);
  }

  const onFocusSite = async () => {
    if(!sites?.length || sites?.length === 1){
      setError(null);
      setLoading('sites');
      const response = await dispatch(getList(user, token, 'Site/GetSite'));
      setLoading(false);
      if(response?.error) setError(response?.error);
      else {
        let sites1 = [...[{siteId: -1, name: t('pos.all')}], ...response?.data];
        setSites(sites1);
      }
    }
  }

  const onClickAdd = () => navigate('modi_add');

  const onClickDelete = () => setOpen(true);

  const confirm = async sure => {
    setOpen(false);
    if(sure){
      let toDelete = [];
      data?.forEach(item => {
        if(item.checked){
          item.modifer.rowStatus = 'D';
          item.modiferItems.forEach(sit => sit.rowStatus = 'U');
          item.modiferSites.forEach(sit => sit.rowStatus = 'U');
          toDelete.push(item);
        }
      });
      setLoading('loading');
      setError(null);
      let response = await dispatch(sendRequest(user, token, 'Inventory/Modifer', toDelete));
      if(response?.error) setError(response?.error);
      else message.success(t('modifier.delete_success'));
      setLoading(false);
      getData(site);
    }
  };

  const siteProps = { value: site, setValue: onSelectSite, data: sites, s_value: 'siteId', s_descr: 'name', className: 'r_select',
    onFocus: onFocusSite, loading: loading === 'sites' };
  const listProps = { data, setData, setShow, checked, setChecked };
  const emptyProps = { icon: 'MdOutlineFactCheck', type: 'modifier', onClickAdd };
  const addProps = { type: 'modifier', onClickAdd, show, onClickDelete };
  const confirmProps = { open, text: t('page.delete_confirm'), confirm };

  return (
    <div className='s_container_mo'>
      {open && <Confirm {...confirmProps} />}
      <Overlay loading={loading === 'loading'}>
        {error && <Error1 error={error} />}
        {!data?.length && !filtering ? <Empty {...emptyProps} /> :
          <div className='card_container'>
            <div className='i_list_header'>
              <ButtonRowAdd {...addProps} />
              <PlainSelect {...siteProps} />
            </div>
            {!data?.length ? <Empty1 {...emptyProps} /> :<List {...listProps} />}
          </div>
        }
      </Overlay>
    </div>
  )
}