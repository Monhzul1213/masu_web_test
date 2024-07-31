import React, { useState, useEffect } from 'react';
import { Checkbox } from 'antd';
import { Link, useNavigate, createSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';

import '../../css/login.css';
import '../../css/config.css';
import { header_image, login1, login2, login3, login4 } from '../../assets';
import { validateEmail, validateNumber } from '../../helpers';
import { apiLogin, apiRegister, getService, setIsLoggedIn, setLogin, getConstants } from '../../services';
import { Button, Error, FloatingInput1, FloatingPassword1, DynamicAIIcon, DynamicMDIcon } from '../../components/all';
import { Copyright, Partner } from '../../components/login';
import { Confirm } from '../../components/login/Confirm';
import { RadioSelect } from '../../components/login/Select';
import BackgroundSlider from 'react-background-slider';

export function SignUp(){
  const { t } = useTranslation();
  const [email, setEmail] = useState({ value: '', error: null });
  const [password, setPassword] = useState({ value: '', error: null });
  const [business, setBusiness] = useState({ value: '', error: null });
  const [address, setAddress] = useState({ value: '', error: null });
  const [partner, setPartner] = useState({ value: '', error: null });
  const [error, setError] = useState(null);
  const [checked, setChecked] = useState(false);
  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = useState(false);
  const [expire, setExpire] = useState(null);
  const [activity, setActivity] = useState({ value: null});
  const [addItem, setAddItem] = useState({ value: '' });
  const [allData, setAllData] = useState([]);
  const [sales, setSales] = useState([]);
  const [vendor, setVendor] = useState([]);
  const { user, token } = useSelector(state => state.login);
  const merchant = user?.msMerchant;
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    onFocusSales()
    onFocusVendor()
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const checkValid = () => {
    let item = (activity?.value === 199 || activity?.value === 205) ? addItem?.value : !addItem?.value
    let passwordLength = 8, businessLength = 6;
    let isValid = email?.value && password?.value && business?.value && address?.value?.trim();
    let isEmailValid = validateEmail(email?.value);
    let isPasswordValid = password?.value?.length >= passwordLength;
    let isBusinessValid = business?.value?.length >= businessLength;
    let isAddressValid = validateNumber(address?.value?.trim());
    let isPartnerValid = (partner?.value && partner?.name) || (!partner?.value && !partner?.name) ? true : false;
    if(isValid && isEmailValid && isPasswordValid && isBusinessValid && isAddressValid && isPartnerValid && activity?.value && item){
      return true;
    } else {
      if(!email?.value) setEmail({ value: '', error: t('error.not_empty') });
      else if(!isEmailValid) setEmail({ value: email?.value, error: t('error.be_right') });
      if(!password?.value) setPassword({ value: '', error: t('error.not_empty') });
      else if(!isPasswordValid) setPassword({ value: password?.value, error: ' ' + passwordLength + t('error.longer_than') });
      if(!business?.value) setBusiness({ value: '', error: t('error.not_empty') });
      else if(!isBusinessValid) setBusiness({ value: business?.value, error: ' ' + businessLength + t('error.longer_than') });
      if(!address?.value?.trim()) setAddress({ value: '', error: t('error.not_empty') });
      else if(!isAddressValid) setAddress({ value: address?.value?.trim(), error: t('error.be_right') });
      if(!isPartnerValid) setPartner({...partner, error: t('login.partner') + ' ' + t('error.be_right') })
      if(!activity?.value) setActivity({ value: null, error: t('profile.select') });
      if(!addItem?.value) setAddItem({ value: '', error: t('error.not_empty') });
      return false;
    }
  }

  // const sendEmail = async to => {
  //   const link = config?.domain + '/confirm?mail=' + to;
  //   const templateParams = { to, link };
  //   return emailjs.send('service_k7osau8','template_3dlaawl', templateParams, 'q2YX3XN0cT2C8g_Ni')
  //     .then((response) => {
  //       return Promise.resolve(true);
  //     }, (err) => {
  //       return Promise.resolve(true);
  //     }
  //   );
  // }

  const sendSMS = async () => {
    const diff = expire - new Date();
    if(expire && diff > 0){
      setVisible(true);
    } else {
      setLoading(true);
      let api = 'Merchant/SentSMS?mobile=' + address?.value?.trim() + '&email=' + email?.value?.trim();
      let response = await dispatch(getService(api));
      setLoading(false);
      if(response?.error) setError(response?.error);
      else {
        const time = new Date();
        time.setSeconds(time.getSeconds() + 300);
        setExpire(time);
        setVisible(true);
      }
    }
  }

  const login = async () => {
    setLoading(true);
    let data = { mail: email?.value, password: password?.value, descr: business?.value, address: address?.value?.trim(), partnerCode: partner?.value ?? '' ,
                 merchantType: 0, merchantSubType : activity?.value, addSubDescr: addItem?.value};
    const response = await dispatch(apiRegister(data));
    if(response?.error) setError(response?.error);
    else {
      // await sendEmail(data?.mail);
      const response2 = await dispatch(apiLogin(data?.mail, data?.password));
      if(response2?.error) setError(response2?.error);
      else {
        dispatch(setLogin({ toRemember: true }));
        dispatch(setIsLoggedIn(true));
        window.sessionStorage.setItem('CREDENTIALS_TOKEN', Date.now());
        navigate({ pathname: '/config', search: createSearchParams({ mode: 'is_first' }).toString() });
      }
    }
    setLoading(false);
  }

  const handleSubmit = async e => {
    e?.preventDefault();
    setError(null);
    if(checkValid()){
      sendSMS();
    }
  }

  const closeModal = sure => {
    setVisible(false);
    if(sure) login();
  }

  const changePhone = value => {
    let text = value?.value?.replace(/[^0-9]/g, '');
    setAddress({ value: text });
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
          if ( n1 === true || string === '199' ){num.push({...item}) } 
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
          if ( n2 === true ){ 
            if(string !== '199'){ num.push(item) } 
          }
        })
        setVendor(num?.sort((a, b) => a.valueNum - b.valueNum));
      }
      setLoading(null);
    }
  }

  const emailProps = { text: t('login.email'), value: email, setValue: setEmail, setError, Icon: () => <DynamicAIIcon className='f_input_icon' name='AiOutlineUser'/> };
  const passProps = { text: t('login.password'), value: password, setValue: setPassword, setError };
  const businessProps = { text: t('login.business'), value: business, setValue: setBusiness, setError, Icon: () => <DynamicMDIcon className='f_input_icon' name='MdOutlineBusinessCenter'/> };
  const addressProps = { text: t('login.phone'), value: address, setValue: changePhone, setError, Icon: () => <DynamicAIIcon className='f_input_icon' name='AiOutlinePhone'/> };//handleEnter: checked && handleSubmit
  const checkProps = { className: 'login_check', checked, onChange: e => setChecked(e?.target?.checked) };
  const btnProps = { loading, type: 'submit', className: 'login_btn', text: t('login.signup'), disabled: !checked };
  const confirmProps = { visible, closeModal, number: address?.value, expire, email: email?.value };
  const partProps = { partner, setPartner };
  const subProps = { value: activity, setValue: setActivity, label: t('profile.activity'), allData, merchant,
  setError, data: sales, onFocusSales, onFocusVendor, data1: vendor, addItem, setAddItem, };

  return (
    <div className='login_container'>
      {visible && <Confirm {...confirmProps} />}
      <BackgroundSlider className='login_container' images= {[login1, login2, login3, login4]} duration={100} transition={2}/>
      <div className='login_back'>
        <img className='login_logo' src={header_image} alt='MASU LOGO' />
        <p className='login_text'>{t('login.signup_text')}</p>
        <form onSubmit={handleSubmit} autoComplete='off' style={{width: 400}}>
          <FloatingInput1 {...emailProps} />
          <FloatingPassword1 {...passProps} />
          <FloatingInput1 {...businessProps} />
          <RadioSelect {...subProps}/>  
          <FloatingInput1 {...addressProps} />
          <Partner {...partProps} />
          <div className='co_gap' />
          <div className='co_gap' />
          <div className='l_check_row'>
            <Checkbox {...checkProps} />
            <p className='l_term'>
              {t('login.sign_accept1')}
              <a className='l_term_link' target='_blank' rel="noreferrer" href='https://masu.mn/terms-conditions/'>{t('login.sign_accept2')}</a>
              {t('login.sign_accept3')}
              <a className='l_term_link' target='_blank' rel="noreferrer" href='https://masu.mn/privacy-policy/'>{t('login.sign_accept4')}</a>
              {t('login.sign_accept5')}
            </p>
          </div>
          {error && <Error error={error} />}
          <Button {...btnProps} />
        </form>
        <div className='l_center_row'>
          <p className='l_link_text'>{t('login.go_login')}</p>
          <Link className='login_link1' to='/'>{t('login.login')}</Link>
        </div>
      </div>
      <Copyright />
    </div>
  )
}