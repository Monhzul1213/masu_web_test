import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { message } from 'antd';
import {  getList, sendRequest } from '../../services';
import '../../css/discount.css';
import { ButtonRow1, Confirm, Error1, Overlay , Prompt } from '../../components/all/all_m';
import { Add , Site, CardEmpty} from '../../components/invt/discount';

export function DiscountAdd(){
  const [name, setName] = useState({ value: '' });
  const [price, setPrice] = useState({ value: '' });
  const [perc, setPerc] = useState({ value: '' });
  const [isEach, setIsEach] = useState({ value: 'Y' });
  const [sites, setSites] = useState([]);
  const [invt, setInvt] = useState(null);
  const [edited, setEdited] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [saved, setSaved] = useState(false);
  const [checked, setChecked] = useState(true);
  const { user, token }  = useSelector(state => state.login);
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    getSites();
    setInvt(null); //if edit inventory
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if(saved) onClickCancel();
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [saved]);

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

  const onClickCancel = () => {
    if(edited) setOpen(true);
    else navigate('/inventory/invt_discount');
  }

  const confirm = sure => {
    setOpen(false);
    if(sure) navigate('/inventory/invt_discount');
  }

  const onClickSave = async () => {
    let nameLength= 2;
    let isNameValid = name?.value?.trim() && name?.value?.length >= nameLength;
    if(isNameValid ){
      onLoad();
     let data = 
      {
        "siteId": 0,
        "discountId": 0,
        "discountType": isEach?.value,
        "percent": perc?.value,
        "amount": price?.value,
        "createdDate": "",
        "lastUpdate": ""
      }
      console.log()
      let api = 'Site/AddDiscount';
      const response = await dispatch(sendRequest(user, token, api, data));
      console.log(response)
      if(response?.error) onError(response?.error);
      else onSuccess(t('inventory.add_success'));
    } 
    else {
      if(!name?.value) setName({ value: '', error: t('error.not_empty') });
      else if(!isNameValid) setName({ value: name?.value, error: ' ' + nameLength + t('error.longer_than') })
    }
  }

  const onClickDelete = async () => {

  }

  const confirmProps = { open, text: t('page.back_confirm'), confirm };
  const mainProps = { setError, name, setName, isEach, setIsEach, price, setPrice, perc, setPerc, checked, setChecked , setEdited,  };
  const siteProps = {  data: sites, setData: setSites, setEdited, checked, setChecked  };
  const btnProps = { onClickCancel, onClickSave, onClickDelete, type: 'submit', show: invt ? true : false };
  const siteEmptyProps = { title: 'inventory.sites', icon: 'MdStorefront', route: '/config?tab=store', btn: 'shop.add', id: 'mo_ac_back' };

  return (
    <Overlay className='i_container' loading={loading}>
      {open && <Confirm {...confirmProps} />}
      <Prompt edited={edited} />
      {error && <Error1 error={error} />}
      <div className='i_scroll'>
        <form className='form2'>
          <Add {...mainProps}/>
          <div className='gap' />
          {sites?.length ? <Site {...siteProps} />  : <CardEmpty  {...siteEmptyProps}/>}
        </form>
      </div>
      <ButtonRow1 {...btnProps} />
    </Overlay>
  )
}