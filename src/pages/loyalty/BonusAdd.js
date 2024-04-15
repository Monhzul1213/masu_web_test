import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import moment from 'moment';

import '../../css/invt.css';
import '../../css/bonus.css';
import { ButtonRowConfirm, Error1, Overlay, Prompt } from '../../components/all';
import { Main, Tab, TabGive, TabType } from '../../components/loyalty/bonus/add';

export function BonusAdd(){
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [edited, setEdited] = useState(false);
  const [error, setError] = useState(null);
  const [error1, setError1] = useState(null);
  const [name, setName] = useState({ value: '' });
  const [beginDate, setBeginDate] = useState({ value: moment() });
  const [endDate, setEndDate] = useState({ value: moment() });
  const [useTime, setUseTime] = useState(true);
  const [beginTime, setBeginTime] = useState({ value: '' });
  const [endTime, setEndTime] = useState({ value: '' });
  const [type, setType] = useState({ value: null, everyAmount: '', bonusPoint: '', purchaseMinAmount: '', purchaseCount: '', categoryId: null });
  const [status, setStatus] = useState({ value: 1 });
  const [bonusItems, setBonusItems] = useState([]);
  const [reward, setReward] = useState({ value: null, rewardName: '', categoryId: null, discountType: 0, discountValue: '', earnPoint: '' });
  const [rewardItems, setRewardItems] = useState([]);
  const [page, setPage] = useState(1);
  const [saved, setSaved] = useState(false);
  const [bonus, setBonus] = useState(null);
  const { user, token }  = useSelector(state => state.login);
  const navigate = useNavigate();

  useEffect(() => {
    if(saved) onClickCancel();
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [saved]);

  useEffect(() => {
    user?.msRole?.webManageItem !== 'Y' ? navigate({ pathname: '/' }) : getData();
    return () => setEdited(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getData = async () => {
    // comment
  }

  const onClickCancel = () => navigate({ pathname: '/loyalty/bonus' });

  const getTime = value => {
    let hours = parseInt(value?.substr(0, 2) ? value?.substr(0, 2) : 0);
    let minutes = parseInt(value?.substr(3, 2) ? value?.substr(3, 2) : 0);
    let seconds = parseInt(value?.substr(6, 2) ? value?.substr(6, 2) : 0);
    return { ticks: 0, days: 0, milliseconds: 0, hours, minutes, seconds };
  }

  const validateData = () => {
    let timeValid = !useTime || (useTime && beginTime?.value && endTime?.value);
    let typeValid = type?.value || type?.value === 0;
    let type0Valid = (type?.value === 0 && type?.everyAmount && type?.bonusPoint) || type?.value !== 0;
    let type1Valid = (type?.value === 1 && type?.purchaseCount && type?.purchaseMinAmount && type?.bonusPoint) || type?.value !== 1;
    let type2Valid = (type?.value === 2 && bonusItems?.length) || type?.value !== 2;
    let type3Valid = (type?.value === 3 && type?.categoryId && type?.bonusPoint) || type?.value !== 3;
    if(name?.value?.trim() && timeValid && typeValid && type0Valid && type1Valid && type2Valid && type3Valid){
      let bItems = bonusItems?.map(b => { return {...b, bonusPoint: parseFloat(b?.bonusPoint ? b?.bonusPoint : 0) }; });
      let data = {
        bonusID: bonus?.bonusID ?? 0, name: name?.value?.trim(), rowStatus: bonus ? 'U' : 'I',
        beginDate: beginDate?.value?.format('yyyy.MM.DD'), endDate: endDate?.value?.format('yyyy.MM.DD'),
        useTime: useTime ? 'Y' : 'N', beginTime: getTime(beginTime?.value), endTime: getTime(endTime?.value),
        status: status?.value, bonusType: type?.value,
        everyAmount: parseFloat(type?.everyAmount ? type?.everyAmount : 0),
        bonusPoint: parseFloat(type?.bonusPoint ? type?.bonusPoint : 0),
        purchaseCount: parseFloat(type?.purchaseCount ? type?.purchaseCount : 0),
        purchaseMinAmount: parseFloat(type?.purchaseMinAmount ? type?.purchaseMinAmount : 0),
        categoryId: type?.categoryId,
        bonusItems: bItems
        // "rewardReqs": [
        //   {
        //     "rewardID": 0,
        //     "rewardName": "string",
        //     "rewardType": 0,
        //     "categoryId": 0,
        //     "earnPoint": 0,
        //     "discountType": 0,
        //     "discountValue": 0,
        //     "rewardItems": [
        //       {
        //         "invtId": 0,
        //         "earnPoint": 0
        //       }
        //     ]
        //   }
        // ]
      }
      return data;
    } else {
      if(!name?.value?.trim()) setName({ value: '', error: t('error.not_empty') });
      if(!timeValid && !beginTime?.value) setBeginTime({ value: '', error: t('error.not_empty') });
      if(!timeValid && !endTime?.value) setEndTime({ value: '', error: t('error.not_empty') });
      if(!typeValid) setError(t('bonus.type_valid'));
      if(typeValid && (!type0Valid || !type1Valid || !type2Valid || !type3Valid)) setError1(t('bonus.type_valid1'));
    }
    // let couponConsumers = [], siteID = [];
    // if( name?.value?.trim() && category?.value && number?.value ){
    //     if(consumer?.length <= number?.value){
    //       consumer?.forEach(item => {
    //         couponConsumers.push({consumerID: item?.consumerId, couponID: selected ? selected?.couponId : -1, status: item?.status});
    //       });
    //       // dconsumer?.forEach(it => couponConsumers?.push({...it, rowStatus: 'D'}));
    //     } else {
    //       setSearchI({ value: searchI?.value, error: t('coupon.number_max') });
    //       return false;
    //     }
    //   sites?.forEach(item => {if(item?.checked) siteID.push(item?.siteId)})
    //   let data = selected ? { couponID: selected?.couponId, name: name?.value, type: type?.value,  couponValue: type?.value === 0 ? perc?.value : price?.value,
    //     beginDate: beginDate?.value?.format('yyyy.MM.DD'), endDate: endDate?.value?.format('yyyy.MM.DD'), categoryId: category?.value, invtId: invt?.value === null ? -1 : invt?.value ,
    //     status: status?.value, qty: number?.value, rowStatus: 'U', couponConsumers, siteID, color: color?.value } : 
    //   { name: name?.value, type: type?.value, couponValue: type?.value === 0 ? perc?.value : price?.value,
    //     beginDate: beginDate?.value?.format('yyyy.MM.DD'), endDate: endDate?.value?.format('yyyy.MM.DD'),
    //     categoryId: category?.value, invtId: invt?.value === null ? -1 : invt?.value, status: status?.value, qty: number?.value,
    //     rowStatus: 'I',couponConsumers, siteID, color: color?.value
    //   }
    //   return data;
    // } else {
    //   if(!category?.value ) setCategory({ value: category?.value, error: t('error.not_empty') });
    //   if(!number?.value) setNumber({ value: '', error: t('error.not_empty') });
    // }
  }

  const onClickSave = async () => {
    // comment
    let data = validateData();
    if(data){
      console.log(data);
    //   if(data?.siteID?.length === 0) setError1(t('shop.title') + t('error.not_empty'))
    //   else {
    //     onLoad();
    //     const response = await dispatch(sendRequest(user, token, 'Site/ModCoupen', data));
    //     if(response?.error) onError(response?.error, true);
    //     else onSuccess(t('coupon.add_success'));
    //   }
    }
  }

  let mainProps = { setError, setEdited, name, setName, beginDate, setBeginDate, endDate, setEndDate, useTime, setUseTime, beginTime, setBeginTime,
    endTime, setEndTime, status, setStatus };
  let tabProps = { page, setPage };
  let typeProps = { page, type, setType, bonusItems, setBonusItems, setError, setError1 };
  let giveProps = { page, reward, setReward, rewardItems, setRewardItems, setError, setError1 };
  let btnProps = { onClickCancel, onClickSave }

  return (
    <Overlay className='i_container' loading={loading}>
      <Prompt edited={edited} />
      {error && <Error1 error={error} />}
      <div className='i_scroll'>
        <Main {...mainProps} />
        <div className='bt_gap' />
        {error1 && <Error1 error={error1} />}
        <div className='ia_back'>
          <Tab {...tabProps} />
          <TabType {...typeProps} />
          <TabGive {...giveProps} />
        </div>
      </div>
      <ButtonRowConfirm {...btnProps} />
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
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();

  

  
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


  
  // onClickDelete, show: item ? true:  false  };
  const siteProps = { data: sites, setData: setSites, setEdited, checked, setChecked, error: error1 };
  const serviceProps = {data: consumer, setData: setConsumer, setError, setEdited, setDKits : setDConsumer, search: searchI, setSearch: setSearchI, number, dconsumer };
  
  return (
    
  );
}

*/