import React, { useState, useEffect } from 'react';
import { message } from 'antd';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, useSearchParams } from 'react-router-dom';

import '../../css/invt.css';
import { getList, sendRequest } from '../../services';
import { ButtonRow1, Confirm, Error1, Overlay } from '../../components/all';
import { CardOption, CardSite } from '../../components/invt/modifier/add';
import { CardEmpty } from '../../components/invt/inventory/add';

export function ModifierAdd(){
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [name, setName] = useState({ value: '' });
  const [items, setItems] = useState([]);
  const [dItems, setDItems] = useState([]);
  const [disabled, setDisabled] = useState(false);
  const [sites, setSites] = useState([]);
  const [edited, setEdited] = useState(false);
  const [open, setOpen] = useState(false);
  const [item, setItem] = useState(null);
  const [search, setSearch] = useState({ value: '' });
  const [checked, setChecked] = useState(true);
  const [searchParams] = useSearchParams();
  const { user, token }  = useSelector(state => state.login);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    getData();
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getData = async () => {
    let modifireID = searchParams?.get('modifireID');
    let response = await getSites();
    if(response && (modifireID || modifireID === 0)) await getModifier(modifireID, response);
  }

  const getModifier = async (modifireid, siteRes) => {
    setError(null);
    setLoading(true);
    let response = await dispatch(getList(user, token, 'Inventory/GetModifer/ModifireID', null, { modifireid }));
    setLoading(false);
    if(response?.error) setError(response?.error);
    else {
      setItem(response?.data);
      setName({ value: response?.data?.modifer?.modiferName ?? '' });
      response?.data?.modiferItems?.forEach(item => item.rowStatus = 'U');
      setItems(response?.data?.modiferItems);
      siteRes?.forEach(item => {
        let exists = response?.data?.modiferSites?.filter(si => si.siteId === item.siteId)[0];
        item.checked = exists?.useModifier === 'Y';
        if(exists) item.rowStatus = 'U';
        else setChecked(false);
      });
      setSites(siteRes);
    }
  }

  const getSites = async () => {
    setError(null);
    setLoading(false);
    const response = await dispatch(getList(user, token, 'Site/GetSite'));
    setLoading(false);
    if(response?.error){
      setError(response?.error);
      return false;
    } else {
      response?.data?.forEach(item => {
        item.checked = true;
        item.rowStatus = 'I';
      });
      setSites(response?.data);
      return response?.data;
    }
  }

  const onClickCancel = () => {
    if(edited) setOpen(true);
    else navigate('/inventory/invt_modi');
  }

  const onClickSave = async () => {
    if(name?.value && items?.length && !disabled){
      setLoading(true);
      setError(null);
      let modifer = { modifireID: item?.modifer?.modifireID ?? -1, modiferName: name?.value, rowStatus: item ? 'U' : 'I' };
      let modiferItems = [], modiferSites = [];
      items?.forEach(it => modiferItems?.push({...it, price: parseFloat(it?.price ? it?.price : 0)}));
      dItems?.forEach(it => modiferItems?.push({...it, price: parseFloat(it?.price ? it?.price : 0), rowStatus: 'D'}));
      sites?.forEach(si => {
        if(si?.checked) modiferSites?.push({ siteId: si?.siteId, useModifier: 'Y', rowStatus: si?.rowStatus ?? 'I' });
        else if(si?.rowStatus === 'U') modiferSites?.push({ siteId: si?.siteId, useModifier: 'N', rowStatus: 'D' });
      });
      let data = [{ modifer, modiferItems, modiferSites }];
      let response = await dispatch(sendRequest(user, token, 'Inventory/Modifer', data));
      if(response?.error) setError(response?.error);
      else {
        message.success(t('modifier.add_success'));
        navigate('/inventory/invt_modi');
      }
      setLoading(false);
    } else {
      if(!name?.value) setName({ value: '', error: t('error.not_empty') });
      if(!items?.length) setSearch({ value: search?.value, error: t('modifier.option_error1')});
      else if(disabled) setSearch({ value: search?.value, error: t('modifier.option_error2')});
    }
  }

  const onClickDelete = () => setOpen(true);

  const confirm = async sure => {
    setOpen(false);
    if(sure){
      setLoading(true);
      setError(null);
      item.modifer.rowStatus = 'D';
      item.modiferSites.forEach(sit => sit.rowStatus = 'U');
      let response = await dispatch(sendRequest(user, token, 'Inventory/Modifer', [item]));
      if(response?.error) setError(response?.error);
      else {
        message.success(t('modifier.delete_success'));
        navigate('/inventory/invt_modi');
      }
      setLoading(false);
    }
  }
  
  const optionProps = { name, setName, setError, data: items, setData: setItems, setDItems, setEdited, disabled, setDisabled, search, setSearch };
  const siteProps = { data: sites, setData: setSites, setEdited, checked, setChecked };
  const siteEmptyProps = { title: 'inventory.sites', icon: 'MdStorefront', route: '/config?tab=store', btn: 'shop.add', id: 'mo_ac_back' };
  const btnProps = { onClickCancel, onClickSave, onClickDelete, type: 'submit', show: item ? true : false, id: 'mo_ac_btns' };
  const confirmProps = { open, text: t('page.back_confirm'), confirm };

  return (
    <Overlay className='i_container' loading={loading}>
      {open && <Confirm {...confirmProps} />}
      <div className='i_scroll'>
        {error && <Error1 error={error} />}
        <form>
          <CardOption {...optionProps} />
          <div className='gap' />
          {sites?.length ? <CardSite {...siteProps} /> : <CardEmpty {...siteEmptyProps} />}
        </form>
      </div>
      <ButtonRow1 {...btnProps} />
    </Overlay>
  )
}