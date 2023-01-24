import React, { useEffect, useState } from 'react';
import { message } from 'antd';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import '../../css/invt.css';
import { apiLogin, sendRequest } from '../../services';
import { currencyList, validateEmail } from '../../helpers';
import { ButtonRowConfirm, Error1, Input, InputPassword, Overlay, Prompt, Select } from '../../components/all';

export function Merchant(){
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [edited, setEdited] = useState(false);
  const [error, setError] = useState(null);
  const [name, setName] = useState({ value: '' });
  const [mail, setMail] = useState({ value: '' });
  const [password, setPassword] = useState({ value: '' });
  const [currency, setCurrency] = useState({ value: '₮' });
  const { user, token, isOwner } = useSelector(state => state.login);
  const merchant = user?.msMerchant;
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    !isOwner ? navigate({ pathname: '/' }) : setData();
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const setData = () => {
    setName({ value: merchant?.descr });
    setMail({ value: merchant?.email });
    setCurrency({ value: merchant?.currency ? merchant?.currency : '₮' });
  }

  const onClickCancel = () => {
    setData();
  }

  const validateData = () => {
    let passwordLength = 8, businessLength = 6;
    let isEmailValid = validateEmail(mail?.value);
    let isPasswordValid = !password?.value || (password?.value?.length >= passwordLength);
    let isBusinessValid = name?.value?.length >= businessLength;
    if(isBusinessValid && isEmailValid && isPasswordValid){
      let data = { email: mail?.value, password: password?.value, descr: name?.value, currency: currency?.value };
      return data;
    } else {
      if(!name?.value) setName({ value: '', error: t('error.not_empty') });
      else if(!isBusinessValid) setName({ value: name?.value, error: ' ' + businessLength + t('error.longer_than') });
      if(!mail?.value) setMail({ value: '', error: t('error.not_empty') });
      else if(!isEmailValid) setMail({ value: mail?.value, error: t('error.be_right') });
      if(!isPasswordValid) setPassword({ value: password?.value, error: ' ' + passwordLength + t('error.longer_than') });
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
  
  let nameProps = { value: name, setValue: setName, label: t('login.business'), placeholder: t('login.business'),
    setError, inRow: true, setEdited, length: 50 };
  let mailProps = { value: mail, setValue: setMail, label: t('employee.mail'), placeholder: t('employee.mail'),
    setError, setEdited, disabled: true };
  let passProps = { value: password, setValue: setPassword, label: t('employee.password'),
    placeholder: t('employee.password'), setError, setEdited, length: 20, disabled: true };
  let currencyProps = { value: currency, setValue: setCurrency, label: t('login.currency'),
    placeholder: t('login.currency'), setError, setEdited, data: currencyList };
  let btnProps = { onClickCancel, onClickSave, id: 'emp_ac_btns' };
  
  return (
    <Overlay className='i_container' loading={loading}>
      <Prompt edited={edited} />
      {error && <Error1 error={error} />}
      <div className='i_scroll'>
        <form>
          <div className='ea_back'>
            <Input {...nameProps} />
            <Input {...mailProps} />
            <InputPassword {...passProps} />
            <Select {...currencyProps} />
          </div>
        </form>
      </div>
      <ButtonRowConfirm {...btnProps} />
    </Overlay>
  );
}