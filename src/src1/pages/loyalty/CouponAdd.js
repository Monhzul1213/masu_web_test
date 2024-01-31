import React, { useEffect, useState } from 'react';
import { message } from 'antd';
import { useTranslation } from 'react-i18next';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';

import { getList, sendRequest } from '../../../services';
import { Error1, Overlay, Prompt, Confirm, ButtonRowConfirm } from '../../../components/all';
import { Main, CardSite, CardService } from '../../components/loyalty/coupon/add';

export function CouponAdd(){
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [edited, setEdited] = useState(false);
  const [error, setError] = useState(null);
  const [saved, setSaved] = useState(false);
  const [selected, setSelected ] = useState(null);
  const [open, setOpen] = useState(false);
  const [name, setName] = useState({ value: '' });
  const [price, setPrice] = useState({ value: 0 });
  const [perc, setPerc] = useState({ value: 0 });
  const [status, setStatus] = useState({ value: 1});
  const [type, setType] = useState({ value: 0});
  const [beginDate, setBeginDate] = useState({ value: moment() });
  const [endDate, setEndDate] = useState({ value: moment() });
  const [category, setCategory] = useState({ value: null });
  const [invt, setInvt] = useState({ value: null });
  const [number, setNumber] = useState({ value: 0 });
  const [sites, setSites] = useState([]);
  const [checked, setChecked] = useState(true);
  const [kits, setKits] = useState([]);
  const [dkits, setDKits] = useState([]);
  const [item, setItem] = useState(null);
  const [searchI, setSearchI] = useState({ value: null });
  const { user, token }  = useSelector(state => state.login);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    if(saved) onClickCancel();
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [saved]);

  useEffect(() => {
    user?.msRole?.webManageItem !== 'Y' ? navigate({ pathname: '/' }) : getData();
    getSites();
    return () => setEdited(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  
  const getData = async () => {
    let couponId = searchParams?.get('couponId');
    let response = await getSites();
    if(response && (couponId || couponId === 0)) GetCoupon(couponId, response);
  }

  const GetCoupon = async (couponId, site ) => {
    setError(null);
    setLoading(true);
    let api = '?CouponId=' + couponId;
    let response = await dispatch(getList(user, token, 'Site/GetCoupon' + api,   ));
    setLoading(false);
    if(response?.error) setError(response?.error)
    else {    
      let coupon = response?.data?.coupon ;
      setSelected(coupon);
      setItem(response?.data?.coupon);
      setName({ value: coupon?.name ?? '' });
      setPrice({ value: coupon?.couponValue ?? '' })
      setPerc({ value: coupon?.couponValue ?? '' })
      setBeginDate ({ value: moment(coupon?.beginDate, 'YYYY-MM-DD') })
      setEndDate ({ value: moment(coupon?.endDate, 'YYYY-MM-DD') })
      setStatus({value: coupon?.status ?? 0})
      setCategory({value: coupon?.categoryId})
      setInvt({value: coupon?.invtId})
      setNumber({value: coupon?.qty})
      site?.forEach(item => {
        let exists = response?.data?.couponsite?.filter(si => si.siteId === item.siteId)[0];
        item.checked = exists;
      });
      setSites(site);
    }
  }
  const onClickCancel = () => navigate({ pathname: '/loyalty/coupon' });

  const getSites = async () => {
    setError(null);
    setLoading(false);
    const response = await dispatch(getList(user, token, 'Site/GetSite'));
    setLoading(false);
    if(response?.error){
      setError(response?.error);
      return false;
    } else {
      response?.data?.forEach(item => item.checked = true);
      setSites(response?.data);
      return response?.data;
    }
  }

  const validateData = () => {
    let couponConsumers = [], siteID = [];
    if( name?.value?.trim() && category?.value ){
        if(kits?.length){
          kits?.forEach(item => {
            couponConsumers.push({consumerID: item?.consumerId, couponID: selected ? selected?.couponId : -1, status: item?.status});
          });
          dkits?.forEach(it => couponConsumers?.push({...it, rowStatus: 'D'}));
        } else {
          setSearchI({ value: searchI?.value, error: t('coupon.kit_error') });
          return false;
        }
      sites?.forEach(item => {if(item?.checked) siteID.push(item?.siteId)})
      let data = selected ? { couponID: selected?.couponId, name: name?.value, type: type?.value,  couponValue: type?.value === 0 ? perc?.value : price?.value,
        beginDate: beginDate?.value?.format('yyyy.MM.DD'), endDate: endDate?.value?.format('yyyy.MM.DD'), categoryId: category?.value, invtId: invt?.value,
        status: status?.value, qty: number?.value, rowStatus: 'U', couponConsumers, siteID } : 
      { name: name?.value, type: type?.value, couponValue: type?.value === 0 ? perc?.value : price?.value,
        beginDate: beginDate?.value?.format('yyyy.MM.DD'), endDate: endDate?.value?.format('yyyy.MM.DD'),
        categoryId: category?.value, invtId: invt?.value, status: status?.value, qty: number?.value,
        rowStatus: 'I',couponConsumers, siteID
      }
      return data;
    } else {
      if(!name?.value?.trim()) setName({ value: '', error: t('error.not_empty') });
      if(!category?.value ) setCategory({ value: category?.value, error: t('error.not_empty') });
    }
  }

  const onClickSave = async () => {
    let data = validateData();
    if(data){
      onLoad();
      const response = await dispatch(sendRequest(user, token, 'Site/ModCoupen', data));
      if(response?.error) onError(response?.error, true);
      else onSuccess(t('coupon.add_success'));
    }
  }


  const onClickDelete = async () => {
    onLoad();
    let data = {couponID: selected?.couponId, name: selected?.name, type: selected?.couponType,  couponValue: selected?.couponValue,
      beginDate: selected?.beginDate, endDate: selected?.endDate, categoryId: selected?.categoryId, invtId: selected?.invtId,
      status: 0, qty: selected?.qty, rowStatus: 'D', couponConsumers : [] , siteID : [] };
    const response = await dispatch(sendRequest(user, token, 'Site/ModCoupen', data));
    if(response?.error) onError(response?.error, true);
    else onSuccess(t('coupon.delete_success'), true);
  }

  const onLoad = () => {
    setError(null);
    setLoading(true);
    setEdited(false);
  }

  const onError = (err, edited) => {
    setError(err);
    setEdited(edited);
    setLoading(false);
  }

  const onSuccess = msg => {
    if(msg){
      message.success(msg);
      setSaved(true);
    }
    setLoading(false);
  }

  const confirm = sure => {
    setOpen(false);
    setError(null);
    // if(sure) setVisible(true);
  }

  let mainProps = { setError, setEdited,name, setName, price, setPrice, number, setNumber, invt, setInvt,
    perc, setPerc, beginDate, setBeginDate, endDate, setEndDate, status, setStatus, category, setCategory, type, setType};
  let btnProps = { onClickCancel, onClickSave, onClickDelete, id: 'co_btn', show: item ? true:  false  };
  let confirmProps = { open, text: t('adjust.confirm_pay'), confirm, text1: error };
  const siteProps = { data: sites, setData: setSites, setEdited, checked, setChecked };
  const serviceProps = {data: kits, setData: setKits, setError, setEdited, setDKits, search: searchI, setSearch: setSearchI };
  
  return (
    <Overlay className='i_container' loading={loading}>
      <Prompt edited={edited} />
      <Confirm {...confirmProps} />
      {error && <Error1 error={error} />}
      <div className='i_scroll'>
          <Main {...mainProps} />
          <CardSite {...siteProps}/>
          <CardService {...serviceProps}/>
      </div>
      <ButtonRowConfirm {...btnProps} />
    </Overlay>
  );
}
