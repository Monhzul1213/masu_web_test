import React, { useState } from 'react';
import moment from 'moment';

import '../../css/invt.css';
import '../../css/bonus.css';
import { Error1, Overlay, Prompt } from '../../components/all';
import { Main, Tab, TabGive, TabType } from '../../components/loyalty/bonus/add';

export function BonusAdd(){
  const [loading, setLoading] = useState(false);
  const [edited, setEdited] = useState(false);
  const [error, setError] = useState(null);
  const [name, setName] = useState({ value: '' });
  const [beginDate, setBeginDate] = useState({ value: moment() });
  const [endDate, setEndDate] = useState({ value: moment() });
  const [useTime, setUseTime] = useState(true);
  const [beginTime, setBeginTime] = useState({ value: '' });
  const [endTime, setEndTime] = useState({ value: '' });
  const [type, setType] = useState({ value: null, everyAmount: '', bonusPoint: '', purchaseMinAmount: '', purchaseCount: '', categoryId: null });
  const [status, setStatus] = useState({ value: 1 });
  const [bonusItems, setBonusItems] = useState([]);
  const [reward, setReward] = useState({ value: null });
  const [page, setPage] = useState(1);

  let mainProps = { setError, setEdited, name, setName, beginDate, setBeginDate, endDate, setEndDate, useTime, setUseTime, beginTime, setBeginTime,
    endTime, setEndTime, status, setStatus };
  let tabProps = { page, setPage };
  let typeProps = { page, type, setType, bonusItems, setBonusItems };
  let giveProps = { page, reward, setReward };

  return (
    <Overlay className='i_container' loading={loading}>
      <Prompt edited={edited} />
      {error && <Error1 error={error} />}
      <div className='i_scroll'>
        <Main {...mainProps} />
        <div className='gap' />
        <div className='ia_back'>
          <Tab {...tabProps} />
          <TabType {...typeProps} />
          <TabGive {...giveProps} />
        </div>
      </div>
      {/* <ButtonRowConfirm {...btnProps} /> */}
    </Overlay>
  );
}

/*
comment
import React, { useEffect, useState } from 'react';
import { message } from 'antd';
import { useTranslation } from 'react-i18next';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';

import { getList, sendRequest } from '../../../services';
import { Error1, Overlay, Prompt, ButtonRowConfirm } from '../../../components/all';
import { Main, CardSite, CardService } from '../../components/loyalty/coupon/add';

export function CouponAdd(){
  const { t } = useTranslation();
  const [error1, setError1] = useState(null);
  const [saved, setSaved] = useState(false);
  const [selected, setSelected ] = useState(null);
  const [price, setPrice] = useState({ value: 0 });
  const [perc, setPerc] = useState({ value: 0 });
  const [status, setStatus] = useState({ value: 1});
  const [type, setType] = useState({ value: 0});
  const [color, setColor] = useState({ value: '006838'});
  
  const [category, setCategory] = useState({ value: null });
  const [invt, setInvt] = useState({ value: null });
  const [number, setNumber] = useState({ value: '' });
  const [sites, setSites] = useState([]);
  const [checked, setChecked] = useState(true);
  const [consumer, setConsumer] = useState([]);
  const [dconsumer, setDConsumer] = useState([]);
  // const [item, setItem] = useState(null);
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
    let response = await dispatch(getList(user, token, 'Site/GetCoupon' + api));
    setLoading(false);
    if(response?.error) setError(response?.error)
    else {    
      let coupon = response?.data?.coupon && response?.data?.coupon[0] ;
      setSelected(coupon);
      setType({value: coupon?.couponType ?? '' })
      setName({ value: coupon?.name ?? '' });
      setPrice({ value: coupon?.couponValue ?? '' })
      setPerc({ value: coupon?.couponValue ?? '' })
      setBeginDate ({ value: moment(coupon?.beginDate, 'YYYY-MM-DD') })
      setEndDate ({ value: moment(coupon?.endDate, 'YYYY-MM-DD') })
      setStatus({value: coupon?.status ?? 0})
      setCategory({value: coupon?.categoryId})
      setInvt({value: coupon?.invtId === -1 ? null : coupon?.invtId})
      setNumber({value: coupon?.qty})
      setColor({value: coupon?.color ?? '006838'})
      site?.forEach(item => {
        let exists = response?.data?.couponsite?.filter(si => si.siteId === item.siteId)[0];
        item.checked = exists;
      });
      setSites(site);
      response?.data?.couponconsumer?.forEach(item => {
        item.firstName = item?.consumerName
        item.age = item?.consumerAge
      })
      setConsumer(response?.data?.couponconsumer)
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
      response?.data?.forEach(item => item.checked = true);
      setSites(response?.data);
      return response?.data;
    }
  }

  const validateData = () => {
    let couponConsumers = [], siteID = [];
    if( name?.value?.trim() && category?.value && number?.value ){
        if(consumer?.length <= number?.value){
          consumer?.forEach(item => {
            couponConsumers.push({consumerID: item?.consumerId, couponID: selected ? selected?.couponId : -1, status: item?.status});
          });
          // dconsumer?.forEach(it => couponConsumers?.push({...it, rowStatus: 'D'}));
        } else {
          setSearchI({ value: searchI?.value, error: t('coupon.number_max') });
          return false;
        }
      sites?.forEach(item => {if(item?.checked) siteID.push(item?.siteId)})
      let data = selected ? { couponID: selected?.couponId, name: name?.value, type: type?.value,  couponValue: type?.value === 0 ? perc?.value : price?.value,
        beginDate: beginDate?.value?.format('yyyy.MM.DD'), endDate: endDate?.value?.format('yyyy.MM.DD'), categoryId: category?.value, invtId: invt?.value === null ? -1 : invt?.value ,
        status: status?.value, qty: number?.value, rowStatus: 'U', couponConsumers, siteID, color: color?.value } : 
      { name: name?.value, type: type?.value, couponValue: type?.value === 0 ? perc?.value : price?.value,
        beginDate: beginDate?.value?.format('yyyy.MM.DD'), endDate: endDate?.value?.format('yyyy.MM.DD'),
        categoryId: category?.value, invtId: invt?.value === null ? -1 : invt?.value, status: status?.value, qty: number?.value,
        rowStatus: 'I',couponConsumers, siteID, color: color?.value
      }
      return data;
    } else {
      if(!name?.value?.trim()) setName({ value: '', error: t('error.not_empty') });
      if(!category?.value ) setCategory({ value: category?.value, error: t('error.not_empty') });
      if(!number?.value) setNumber({ value: '', error: t('error.not_empty') });
    }
  }

  const onClickSave = async () => {
    let data = validateData();
    if(data){
      if(data?.siteID?.length === 0) setError1(t('shop.title') + t('error.not_empty'))
      else {
        onLoad();
        const response = await dispatch(sendRequest(user, token, 'Site/ModCoupen', data));
        if(response?.error) onError(response?.error, true);
        else onSuccess(t('coupon.add_success'));
      }
    }
  }


  // const onClickDelete = async () => {
  //   onLoad();
  //   let data = {couponID: selected?.couponId, name: selected?.name, type: selected?.couponType,  couponValue: selected?.couponValue,
  //     beginDate: selected?.beginDate, endDate: selected?.endDate, categoryId: selected?.categoryId, invtId: selected?.invtId,
  //     status: 0, qty: selected?.qty, rowStatus: 'D', couponConsumers : [] , siteID : [] };
  //   const response = await dispatch(sendRequest(user, token, 'Site/ModCoupen', data));
  //   if(response?.error) onError(response?.error, true);
  //   else onSuccess(t('coupon.delete_success'), true);
  // }

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

  const onClickCancel = () => navigate({ pathname: '/loyalty/coupon' });

  
  let btnProps = { onClickCancel, onClickSave, id: 'co_btn', }
  // onClickDelete, show: item ? true:  false  };
  const siteProps = { data: sites, setData: setSites, setEdited, checked, setChecked, error: error1 };
  const serviceProps = {data: consumer, setData: setConsumer, setError, setEdited, setDKits : setDConsumer, search: searchI, setSearch: setSearchI, number, dconsumer };
  
  return (
    
  );
}

*/