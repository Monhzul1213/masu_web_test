import React, { useEffect, useState } from 'react';
import { message } from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import moment from 'moment';

import '../../css/invt.css';
import '../../css/bonus.css';
import { getList, sendRequest } from '../../services';
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
  const [useTime, setUseTime] = useState(false);
  const [beginTime, setBeginTime] = useState({ value: '' });
  const [endTime, setEndTime] = useState({ value: '' });
  const [type, setType] = useState({ value: null, everyAmount: '', bonusPoint: '', purchaseMinAmount: '', purchaseCount: '', categoryId: null });
  const [status, setStatus] = useState({ value: 1 });
  const [bonusItems, setBonusItems] = useState([]);
  const [reward, setReward] = useState({ value: null, id: 0, rewardName: '', categoryId: null, discountType: 0, discountValue: '', earnPoint: '' });
  const [rewardItems, setRewardItems] = useState([]);
  const [page, setPage] = useState(1);
  const [saved, setSaved] = useState(false);
  const [bonus, setBonus] = useState(null);
  const [searchParams] = useSearchParams();
  const [disabled, setDisabled] = useState(false);
  const [color, setColor] = useState({ value: '006838' });
  const { user, token }  = useSelector(state => state.login);
  const dispatch = useDispatch();
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

  const getData = async () => {
    let bonusId = searchParams?.get('bonusId');
    if(bonusId){
      onLoad();
      let response = await dispatch(getList(user, token, 'Site/GetBonus?BonusID=' + bonusId));
      if(response?.error) onError(response?.error, false);
      else {
        onSuccess();
        setDisabled(true);
        let bonus = response?.data?.bonus && response?.data?.bonus[0];
        setName({ value: bonus?.name });
        setBeginDate({ value: moment(bonus?.beginDate) });
        setEndDate({ value: moment(bonus?.endDate) });
        setUseTime(bonus?.useTime === 'Y');
        setBeginTime({ value: bonus?.useTime === 'Y' ? bonus?.beginTime : '' });
        setEndTime({ value: bonus?.useTime === 'Y' ? bonus?.endTime : '' });
        setStatus({ value: bonus?.status });
        setType({ value: bonus?.bonusType, everyAmount: bonus?.everyAmount + '', bonusPoint: bonus?.bonusPoint + '', purchaseMinAmount: bonus?.purchaseMinAmount + '',
          purchaseCount: bonus?.purchaseCount + '', categoryId: bonus?.categoryId });
        setBonusItems(response?.data?.bonusitem);
        let reward = response?.data?.reward && response?.data?.reward[0];
        setReward({ value: reward?.rewardType, id: reward?.rewardId, rewardName: reward?.rewardName, categoryId: reward?.categoryId, discountType: reward?.discountType,
          discountValue: reward?.discountValue, earnPoint: reward?.earnPoint });
        setRewardItems(response?.data?.rewarditem);
        setBonus(bonus);
        setColor({ value: bonus?.color ?? '006838' });
      }
    }
  }

  const onClickCancel = () => navigate({ pathname: '/loyalty/bonus' });

  const getTime = (date, time) => {
    if(useTime){
      let string = date?.value?.format('yyyy.MM.DD') + time?.value;
      let value = moment(string, 'yyyy.MM.DD HH:mm:ss').format('yyyy-MM-DDTHH:mm:ss.SSS');
      return value;
    } else
      return date?.value?.format('yyyy-MM-DDTHH:mm:ss.SSS');
  }

  const validateData = () => {
    let timeValid = !useTime || (useTime && beginTime?.value && endTime?.value);
    let typeValid = type?.value || type?.value === 0;
    let type0Valid = (type?.value === 0 && type?.everyAmount && type?.bonusPoint) || type?.value !== 0;
    let type1Valid = (type?.value === 1 && type?.purchaseCount && type?.purchaseMinAmount && type?.bonusPoint) || type?.value !== 1;
    let type2Valid = (type?.value === 2 && bonusItems?.length) || type?.value !== 2;
    let type3Valid = (type?.value === 3 && type?.categoryId && type?.bonusPoint) || type?.value !== 3;
    let typesValid = typeValid && type0Valid && type1Valid && type2Valid && type3Valid;
    let rewardValid = reward?.value || reward?.value === 0;
    let reward0Valid = (reward?.value === 0 && reward?.rewardName && rewardItems?.length) || reward?.value !== 0;
    let reward1Valid = (reward?.value === 1 && reward?.rewardName && rewardItems?.length) || reward?.value !== 1;
    let reward2Valid = (reward?.value === 2 && reward?.rewardName && reward?.categoryId && reward?.discountValue && reward?.earnPoint) || reward?.value !== 2;
    let reward3Valid = (reward?.value === 3 && reward?.rewardName && reward?.discountValue && reward?.earnPoint) || reward?.value !== 3;
    let rewardsValid = rewardValid && reward0Valid && reward1Valid && reward2Valid && reward3Valid;
    if(name?.value?.trim() && timeValid && typesValid && rewardsValid){
      let bItems = bonusItems?.map(b => { return {...b, bonusPoint: parseFloat(b?.bonusPoint ? b?.bonusPoint : 0) }; });
      let rItems = rewardItems?.map(b => { return {...b, earnPoint: parseFloat(b?.earnPoint ? b?.earnPoint : 0), discountValue: parseFloat(b?.discountValue ? b?.discountValue : 0) }; });
      let data = {
        bonusID: bonus?.bonusId ?? 0, name: name?.value?.trim(), rowStatus: bonus ? 'U' : 'I',
        beginDate: beginDate?.value?.format('yyyy.MM.DD'), endDate: endDate?.value?.format('yyyy.MM.DD'),
        useTime: useTime ? 'Y' : 'N', beginTime: getTime(beginDate, beginTime), endTime: getTime(endDate, endTime),
        status: status?.value, bonusType: type?.value, color: color?.value,
        everyAmount: parseFloat(type?.everyAmount ? type?.everyAmount : 0),
        bonusPoint: parseFloat(type?.bonusPoint ? type?.bonusPoint : 0),
        purchaseCount: parseFloat(type?.purchaseCount ? type?.purchaseCount : 0),
        purchaseMinAmount: parseFloat(type?.purchaseMinAmount ? type?.purchaseMinAmount : 0),
        categoryId: type?.categoryId ?? 0,
        bonusItems: bItems,
        rewardReqs: [{
          rewardID: reward?.id ?? 0,
          rewardName: reward?.rewardName,
          rewardItems: rItems,
          rewardType: reward?.value,
          categoryId: reward?.categoryId ?? 0,
          earnPoint: parseFloat(reward?.earnPoint ? reward?.earnPoint : 0),
          discountType: reward?.discountType,
          discountValue: parseFloat(reward?.discountValue ? reward?.discountValue : 0),
        }]
      };
      return data;
    } else {
      if(!name?.value?.trim()) setName({ value: '', error: t('error.not_empty') });
      if(!timeValid && !beginTime?.value) setBeginTime({ value: '', error: t('error.not_empty') });
      if(!timeValid && !endTime?.value) setEndTime({ value: '', error: t('error.not_empty') });
      if(!typeValid) setError(t('bonus.type_valid'));
      else if(!rewardValid){
        setError(t('bonus.reward_valid'));
        setPage(2);
      }
      if(typeValid && (!type0Valid || !type1Valid || !type2Valid || !type3Valid)) setError1(t('bonus.type_valid1'));
      if(rewardValid && (!reward0Valid || !reward1Valid || !reward2Valid || !reward3Valid)) setError1(t('bonus.type_valid1'));
    }
  }

  const onClickSave = async () => {
    let data = validateData();
    if(data){
      onLoad();
      const response = await dispatch(sendRequest(user, token, 'Site/ModBonus', data));
      if(response?.error) onError(response?.error, true);
      else onSuccess(t('bonus.add_success'));
    }
  }

  let mainProps = { setError, setEdited, name, setName, beginDate, setBeginDate, endDate, setEndDate, useTime, setUseTime, beginTime, setBeginTime,
    endTime, setEndTime, status, setStatus, color, setColor, disabled };
  let tabProps = { page, setPage };
  let typeProps = { page, type, setType, bonusItems, setBonusItems, setError, setError1, disabled };
  let giveProps = { page, reward, setReward, rewardItems, setRewardItems, setError, setError1, disabled };
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