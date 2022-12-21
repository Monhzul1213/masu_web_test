import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { withSize } from 'react-sizeme';

import { getList } from '../../services';
import { Error1, Overlay, Prompt } from '../../components/all';
import { Main, List } from '../../components/config/tax/add';
import { CardEmpty } from '../../components/invt/inventory/add';

function Screen(props){
  const { size } = props;
  const [loading, setLoading] = useState(false);
  const [edited, setEdited] = useState(false);
  const [error, setError] = useState(null);
  const [regNo, setRegNo] = useState({ value: '' });
  const [name, setName] = useState({ value: '' });
  const [notes, setNotes] = useState({ value: '' });
  const [checked, setChecked] = useState(true);
  const [sites, setSites] = useState([]);
  const { user, token }  = useSelector(state => state.login);
  const dispatch = useDispatch();

  useEffect(() => {
    getData();
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getData = async () => {
    // let modifireID = searchParams?.get('modifireID');
    let response = await getSites();
    // if(response && (modifireID || modifireID === 0)) await getModifier(modifireID, response);
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
      // response?.data?.forEach(item => {
      //   item.checked = true;
      //   item.rowStatus = 'I';
      // });
      setSites(response?.data);
      return response?.data;
    }
  }

  const width = size?.width >= 690 ? 690 : size?.width;
  const mainProps = { setError, setEdited, setLoading, regNo, setRegNo, name, setName, checked, setChecked, notes, setNotes };
  const siteProps = { data: sites, setData: setSites, setEdited };
  const siteEmptyProps = { title: 'inventory.sites', icon: 'MdStorefront', route: '/config/store', btn: 'shop.add', id: 'add_back' };

  return (
    <div className='add_tab' style={{flex: 1}}>
      <Overlay loading={loading}>
        <Prompt edited={edited} />
        {error && <Error1 error={error} />}
        <div className='i_scroll'>
          <form style={{ width }}>
            <Main {...mainProps} />
            <div className='gap' />
            {sites?.length ? <List {...siteProps} /> : <CardEmpty {...siteEmptyProps} />}
          </form>
        </div>
        {/*
          
        <ButtonRow1 {...btnProps} /> */}
      </Overlay>
    </div>
  );
}

/**
 * import React, { useState, useEffect } from 'react';
import { message } from 'antd';
import { useTranslation } from 'react-i18next';
import { useNavigate, useSearchParams } from 'react-router-dom';

import '../../css/invt.css';
import { getList, sendRequest } from '../../services';
import { ButtonRow1, Confirm, Error1, Overlay, Prompt } from '../../components/all';
import { CardOption, CardSite } from '../../components/invt/modifier/add';
import { CardEmpty } from '../../components/invt/inventory/add';

export function ModifierAdd(){
  const { t } = useTranslation();
  const [name, setName] = useState({ value: '' });
  const [items, setItems] = useState([]);
  const [dItems, setDItems] = useState([]);
  const [disabled, setDisabled] = useState(false);
  const [open, setOpen] = useState(false);
  const [item, setItem] = useState(null);
  const [search, setSearch] = useState({ value: '' });
  const [checked, setChecked] = useState(true);
  const [saved, setSaved] = useState(false);
  const [searchParams] = useSearchParams();
  
  const navigate = useNavigate();

  
  useEffect(() => {
    if(saved) onClickCancel();
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [saved]);

 

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
      });
      setSites(siteRes);
      setChecked(response?.data?.modifer?.useAllSite === 'Y');
    }
  }

  

  const onClickCancel = () => navigate('/inventory/invt_modi');

  const onLoad = () => {
    setError(null);
    setLoading(true);
    setEdited(false);
  }

  const onError = err => {
    setError(err);
    setEdited(true);
    setLoading(false);
  }

  const onSuccess = msg => {
    message.success(msg);
    setSaved(true);
    setLoading(false);
  }

  const onClickSave = async () => {
    let nameLength = 2;
    let isNameValid = name?.value?.length >= nameLength;
    if(isNameValid && items?.length && !disabled){
      onLoad();
      let modifer = { modifireID: item?.modifer?.modifireID ?? -1, modiferName: name?.value,
        rowStatus: item ? 'U' : 'I', UseAllSite: checked ? 'Y' : 'N', useAllSite: checked ? 'Y' : 'N' };
      let modiferItems = [], modiferSites = [];
      items?.forEach(it => modiferItems?.push({...it, price: parseFloat(it?.price ? it?.price : 0)}));
      dItems?.forEach(it => modiferItems?.push({...it, price: parseFloat(it?.price ? it?.price : 0), rowStatus: 'D'}));
      sites?.forEach(si => {
        if(si?.checked) modiferSites?.push({ siteId: si?.siteId, useModifier: 'Y', rowStatus: si?.rowStatus ?? 'I' });
        else if(si?.rowStatus === 'U') modiferSites?.push({ siteId: si?.siteId, useModifier: 'N', rowStatus: 'D' });
      });
      let data = [{ modifer, modiferItems, modiferSites }];
      let response = await dispatch(sendRequest(user, token, 'Inventory/Modifer', data));
      if(response?.error) onError(response?.error);
      else onSuccess(t('modifier.add_success'));
    } else {
      if(!name?.value) setName({ value: '', error: t('error.not_empty') });
      else if(!isNameValid) setName({ value: name.value, error: ' ' + nameLength + t('error.longer_than') })
      if(!items?.length) setSearch({ value: search?.value, error: t('modifier.option_error1')});
      else if(disabled) setSearch({ value: search?.value, error: t('modifier.option_error2')});
    }
  }

  const onClickDelete = () => setOpen(true);

  const confirm = async sure => {
    setOpen(false);
    if(sure){
      onLoad();
      item.modifer.rowStatus = 'D';
      item.modiferSites.forEach(sit => sit.rowStatus = 'U');
      let response = await dispatch(sendRequest(user, token, 'Inventory/Modifer', [item]));
      if(response?.error) onError(response?.error);
      else onSuccess(t('modifier.delete_success'));
    }
  }
  
  const optionProps = { name, setName, setError, data: items, setData: setItems, setDItems, setEdited, disabled, setDisabled, search, setSearch };
  const btnProps = { onClickCancel, onClickSave, onClickDelete, type: 'submit', show: item ? true : false, id: 'mo_ac_btns' };
  const confirmProps = { open, text: t('page.delete_confirm'), confirm };

  return (
    <Overlay className='i_container' loading={loading}>
      <Prompt edited={edited} />
      {open && <Confirm {...confirmProps} />}
      {error && <Error1 error={error} />}
      <div className='i_scroll'>
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
 */

const withSizeHOC = withSize();
export const TaxAdd = withSizeHOC(Screen);