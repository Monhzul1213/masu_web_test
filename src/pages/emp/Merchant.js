import React, { useEffect, useState } from 'react';
import { message } from 'antd';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import '../../css/invt.css';
import { apiLogin, getConstants, getService, sendRequest } from '../../services';
import { currencyList, validateEmail } from '../../helpers';
import { ButtonRowConfirm, Error1, Input, InputPassword, Overlay, Select } from '../../components/all';
import { RadioSelect, Prompt1 } from '../../components/emp/merchant';
import { Select1 } from '../../components/emp/merchant/Select1';

export function Merchant ( props){
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [edited, setEdited] = useState(false);
  const [error, setError] = useState(null);
  const [name, setName] = useState({ value: '' });
  const [mail, setMail] = useState({ value: '' });
  const [sales, setSales] = useState([]);
  const [allData, setAllData] = useState([]);
  const [vendor, setVendor] = useState([]);
  const [password, setPassword] = useState({ value: '' });
  const [currency, setCurrency] = useState({ value: '₮' });
  const [market, setMarket] = useState({ value: '' });
  const [markets, setMarkets] = useState([]);
  const [activity, setActivity] = useState({ value: null});
  const [addItem, setAddItem] = useState({ value: '' });
  const [addItem1, setAddItem1] = useState({ value: '' });
  const [partner, setPartner] = useState({ value: '', error: null });
  const { user, token, isOwner } = useSelector(state => state.login);
  const merchant = user?.msMerchant;
  const navigate = useNavigate();
  const dispatch = useDispatch();


  useEffect(() => {
    onFocusSales()
    onFocusVendor()
    onFocusMarket();
    !isOwner ? navigate({ pathname: '/' }) : setData();
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const setData = async () => {
    setError(null);
    setName({ value: merchant?.descr });
    setMail({ value: merchant?.email });
    setActivity({ value: merchant?.merchantSubType})
    setAddItem({ value: merchant?.addSubDescr})
    setMarket({ value: merchant?.adsType})
    setAddItem1({ value: merchant?.addAdsDescr})
    setCurrency({ value: merchant?.currency ? merchant?.currency : '₮' });
    if(merchant?.partnerCode) handlePartner(null, merchant?.partnerCode);
  }

  const onClickCancel = () => {
    setData();
  }

  const validateData = () => {
    let item = (activity?.value === 199 || activity?.value === 205) ? addItem?.value : !addItem?.value;
    let item1 = (market?.value === 200 ) ? addItem1?.value : !addItem1?.value
    let passwordLength = 8, businessLength = 6;
    let isEmailValid = validateEmail(mail?.value);
    let isPasswordValid = !password?.value || (password?.value?.length >= passwordLength);
    let isBusinessValid = name?.value?.length >= businessLength;
    let isPartnerValid = (partner?.value && partner?.name) || (!partner?.value && !partner?.name) ? true : false;
    if(isBusinessValid && isEmailValid && isPasswordValid && isPartnerValid && activity?.value && market?.value  && item && item1 ){
      let data = { email: mail?.value, password: password?.value, descr: name?.value, currency: currency?.value, partnerCode: partner?.value ?? '',
                  merchantSubType : activity?.value, addSubDescr: addItem?.value, adsType: market?.value, addAdsDescr: addItem1?.value };
      return data;
    } else {
      if(!name?.value) setName({ value: '', error: t('error.not_empty') });
      else if(!isBusinessValid) setName({ value: name?.value, error: ' ' + businessLength + t('error.longer_than') });
      if(!mail?.value) setMail({ value: '', error: t('error.not_empty') });
      else if(!isEmailValid) setMail({ value: mail?.value, error: t('error.be_right') });
      if(!isPasswordValid) setPassword({ value: password?.value, error: ' ' + passwordLength + t('error.longer_than') });
      if(!isPartnerValid) setPartner({...partner, error: t('error.be_right') })
      if(!activity?.value) setActivity({ value: null, error: t('profile.select') });
      if(!addItem?.value) setAddItem({ value: '', error: t('error.not_empty') });
      if(!market?.value) setMarket({ value: null, error: t('profile.select') });
      if(!addItem1?.value) setAddItem1({ value: '', error: t('error.not_empty') });
      return false;
    }
  }

  const onClickSave = async () => {
    let data = validateData();
    if(data){
      setError(null);
      setLoading(true);
      const response = await dispatch(sendRequest(user, token, 'Merchant/Modify', data));
      setLoading(false);
      if(response?.error) setError(response?.error);
      else {
        setEdited(false);
        const pass = password?.value ? password?.value : user?.password;
        const response1 = await dispatch(apiLogin(mail?.value, pass));
        if(response1?.error) setError(response1?.error);
        else message.success(t('login.success'));
      }
    }
  }

  const handlePartner = async (e, value) => {
    e?.preventDefault();
    // setLoading1(true);
    let api = 'Merchant/GetPartner?partnercode=' + (value ?? partner?.value);
    let response = await dispatch(getService(api, 'GET'));
    if(response?.error) setError(response?.error);
    else {
      let name = response?.data?.retdata?.partner?.partnerName ?? '';
      if(value) setPartner({ value, name });
      else setPartner({...partner, name, error: null });
    }
    // setLoading1(false);
  }

  const onFocusSales = async () => {
    if(!sales?.length || sales?.length === 1){
      setError && setError(null);
      setLoading('status');
      const response = await dispatch(getConstants(user, token, 'msMerchant_SubType'));
      if(response?.error) setError && setError(response?.error);
      else {
        let num = [];
        response?.data?.forEach(item => {
          let string = item?.valueNum?.toString();
          let n1 = string.startsWith(1)
          if ( n1 === true ){
            num.push({...item}) } 
        })
        setAllData(response?.data)
        setSales(num?.sort((a, b) => a.valueNum - b.valueNum));
      }
      setLoading(null);
    }
  }

  const onFocusVendor = async () => {
    if(!vendor?.length || vendor?.length === 1){
      setError && setError(null);
      setLoading('status');
      const response = await dispatch(getConstants(user, token, 'msMerchant_SubType'));
      if(response?.error) setError && setError(response?.error);
      else {
        let num = [] ;
        response?.data?.forEach(item => {
          let string = item?.valueNum?.toString();
          let n2 = string.startsWith(2)
          if ( n2 === true ){ num.push(item) } 
      })
      setVendor(num?.sort((a, b) => a.valueNum - b.valueNum));
      }
      setLoading(null);
    }
  }

  const onFocusMarket = async () => {
    if(!markets?.length || markets?.length === 1){
      setError && setError(null);
      setLoading('status');
      const response = await dispatch(getConstants(user, token, 'msMerchant_AdsType'));
      if(response?.error) setError && setError(response?.error);
      else {
      setMarkets(response?.data?.sort((a, b) => a.valueNum - b.valueNum));
      }
      setLoading(null);
    }
  }

  let nameProps = { value: name, setValue: setName, label: t('login.business'), placeholder: t('login.business'),
    setError, inRow: true, setEdited, length: 50 };
  let mailProps = { value: mail, setValue: setMail, label: t('employee.mail'), placeholder: t('employee.mail'),
    setError, setEdited, disabled: true };
  let passProps = { value: password, setValue: setPassword, label: t('employee.password'),
    placeholder: t('employee.password'), setError, setEdited, length: 20, disabled: true };
  let currencyProps = { value: currency, setValue: setCurrency, label: t('login.currency'),
    placeholder: t('login.currency'), setError, setEdited, data: currencyList };
  let btnProps = { onClickCancel, onClickSave, id: 'emp_ac_btns' };
  let partnerProps = { label: t('login.partner'), placeholder: t('login.partner'), value: partner, setValue: setPartner, setError,
    handleEnter: handlePartner, inRow: true, noBlur: true, disabled: true };
  let partnerNameProps = { label: t('login.partner_name'), placeholder: t('login.partner_name'), value: { value: partner?.name ?? '' }, disabled: true };
  let subProps = { value: activity, setValue: setActivity, label: t('profile.activity'), placeholder: t('profile.activity1'), allData, merchant,
  setError, setEdited, data: sales, onFocusSales, onFocusVendor, data1: vendor, addItem, setAddItem };
  let marketProps = { value: market, setValue: setMarket, label: t('profile.question'), s_value: 'valueNum', s_descr: 'valueStr1',
    placeholder: t('profile.question'), setError, setEdited, data: markets, onFocus: onFocusMarket, className: 'select_back_z', addItem: addItem1, setAddItem: setAddItem1 };

    return (
    <Overlay className='i_container' loading={loading}>
      <Prompt1 value={!activity?.value || !market?.value} edited={edited} /> 
      {error && <Error1 error={error} />}
      <div className='i_scroll'>
        <form>
          <div className='ea_back'>
            <Input {...nameProps} />
            <Input {...mailProps} />
            <InputPassword {...passProps} />
            <RadioSelect {...subProps}/>
            <Select1 {...marketProps} />
            <Select {...currencyProps} />
            <div id='im_input_row_large' style={{ flexFlow: 'row', alignItems: 'flex-end' }}>
              <Input {...partnerProps} />
              {/* <div className='im_gap' />
              <Button {...partnerBtnProps} /> */}
            </div>
            <Input {...partnerNameProps} />
          </div>
        </form>
      </div>
      <ButtonRowConfirm {...btnProps} />
    </Overlay>
  );
}