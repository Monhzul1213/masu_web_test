import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, useSearchParams  } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { message } from 'antd';
import {  getList, sendRequest } from '../../services';
import '../../css/discount.css';
import { ButtonRowConfirm, Error1, Overlay , Prompt } from '../../components/all/all_m';
import { Add , } from '../../components/suppliers';
import {  validateEmail } from '../../helpers';

export function SupplierAdd(){
    const [name, setName] = useState({ value: '' });
    const [vendCode, setVendCode] = useState({ value: '' });
    const [address, setAddress] = useState({ value: '' });
    const [phone, setPhone] = useState({ value: '' });
    const [email, setEmail] = useState({ value: '' });
    const [contact, setContact] = useState({ value: '' });
    const [web, setWeb] = useState({ value: '' });
    const [address1, setAddress1] = useState({ value: '' });
    const [note, setNote] = useState({ value: '' });
  const [error, setError] = useState(null);
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  const [edited, setEdited] = useState(false);
  const { user, token }  = useSelector(state => state.login);
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [selected, setSelected ] = useState(null);
  const [searchParams] = useSearchParams();

  useEffect(() => {
    user?.msRole?.webManageEmployy !== 'Y' ? navigate({ pathname: '/' }) : getData();
    
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if(saved) onClickCancel();
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [saved]);

  
  const getData = async () => {
    let vendId = searchParams?.get('vendId');
    if(vendId || vendId === 0) {GetVend(vendId)} ;
  }

  const GetVend = async (vendId ) => {
    setError(null);
    setLoading(true);
    let api = '?vendId=' + vendId;
    let response = await dispatch(getList(user, token, 'Merchant/vendor/getvendor'+ api,   ));
    setLoading(false);
    if(response?.error) setError(response?.error)
    else {
      let vend = response && response?.data && response?.data[0];
      // console.log(vend)
      setSelected(vend)
      setItem(response?.data);
      setAddress({ value: vend?.address1 ?? '' });
      setAddress1({ value: vend?.address2 ?? ''});
      setContact({ value: vend?.contact ?? '' });
      setEmail({ value: vend?.email ?? ''  });
      setNote({ value: vend?.note ?? ''  });
      setPhone({ value: vend?.phone ?? ''  });
      setWeb({ value: vend?.webSite ?? ''  });
      setName({ value: vend?.vendName ?? ''  });
      setVendCode({ value: vend?.vendCode ?? ''  });
      response?.data?.forEach(item => item.rowStatus = 'U');
    
    }
  }

  const onLoad = () => {
    setError(null);
    setLoading(true);
    setEdited(false);

  }

  const onError = err => {
    setError(err);
    setLoading(false);
    setEdited(true);

  }

  const onSuccess = msg => {
    message.success(msg);
    setSaved(true);
    setLoading(false);
  }

  const onClickCancel = () =>  navigate('/management/suppliers');
 
  const checkValid = () => {
    let phoneLength = 8 ;
    let isPhoneValid = !phone?.value?.trim() || phone?.value?.length >= phoneLength;
    let isEmailValid = validateEmail(email?.value?.trim());
    if( isEmailValid  && name?.value?.trim() && isPhoneValid
   ){
      return true;
    } else {
      if(!email?.value?.trim()) setEmail({ value: '', error: t('error.not_empty') });
      else if(!isEmailValid) setEmail({ value: email?.value?.trim(), error: t('error.be_right') });
      if(!name?.value?.trim()) setName({ value: '', error: t('error.not_empty') });
      if(!vendCode?.value?.trim()) setVendCode({ value: '', error: t('error.not_empty') });
      if(!phone?.value?.trim()) setPhone({ value: '', error: t('error.not_empty') });
      if(!isPhoneValid) setPhone({ value: phone?.value, error: ' ' + phoneLength + t('error.longer_than') });
    }
  }
  const onClickSave = async e => {
    e?.preventDefault();
    if(checkValid()){
        onLoad();
      setLoading(true);
      let data =
     [ {
        vendId: selected ? selected?.vendId : -1,
        vendName: name?.value?.trim(),
        contact: contact?.value?.trim(),
        email: email?.value?.trim(),
        phone: phone?.value?.trim(),
        webSite: web?.value?.trim(),
        address1: address?.value?.trim(),
        address2: address1?.value?.trim(),
        city: "",
        region: "",
        vendCode: vendCode?.value?.trim(),
        postalCode: "",
        country: "",
        note: note?.value?.trim(),
        rowStatus: selected ? "U" : "I"
      }]
      const response = await dispatch(sendRequest(user, token, 'Merchant/vendor',  data));
      console.log(response)
      if(response?.error) onError(response?.error);
      else onSuccess(t('supplier.add_success'));
    } 
  }

  const onClickDelete = async () => {
    onLoad();
    let data = [{...selected, rowStatus: 'D',}];
    const response = await dispatch(sendRequest(user, token, 'Merchant/vendor', data));
    if(response?.error) onError(response?.error, true);
    else onSuccess(t('employee.delete_success'), true);
    console.log(data)
  }
  const mainProps = { setError, name, setName, contact, setContact, phone, setPhone, email, setEmail,
     setEdited, address, setAddress, address1, setAddress1, web, setWeb, note, setNote, setVendCode, vendCode };
  const btnProps = { onClickCancel, onClickSave, onClickDelete, type: 'submit', show: item ? true:  false , id: 'btn_supp' };

  return (
    <Overlay className='i_container' loading={loading}>
      <Prompt edited={edited} />
      {error && <Error1 error={error} />}
      <div className='i_scroll'>
          <Add {...mainProps}/>
         
      </div>
      <ButtonRowConfirm {...btnProps} />
    </Overlay>
  )
}