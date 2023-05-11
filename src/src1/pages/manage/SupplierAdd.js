import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, useSearchParams  } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { message } from 'antd';
import {  getList, sendRequest } from '../../../services';
import '../../css/discount.css';
import { ButtonRowConfirm, Error1, Overlay , Prompt } from '../../components/all/all_m';
import { Add  } from '../../components/suppliers';
import { urlToFile } from '../../../helpers';
import mime from 'mime';
import '../../../css/invt.css';
import { validateEmail } from '../../../helpers';

export function SupplierAdd(){
    const [name, setName] = useState({ value: '' });
    const [address, setAddress] = useState({ value: '' });
    const [phone, setPhone] = useState({ value: '' });
    const [email, setEmail] = useState({ value: '' });
    const [web, setWeb] = useState({ value: '' });
    const [address1, setAddress1] = useState({ value: '' });
    const [note, setNote] = useState({ value: '' });
    const [image, setImage] = useState(null);
    const [image64, setImage64] = useState('');
    const [imageType, setImageType] = useState('');
    const [isOTC, setIsOTC] = useState(false);
    const [customer, setCustomer] = useState({ value: '' });
    const [rep, setRep] = useState({ value: '' });
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
  const getImage = async inventory => {
    if(inventory?.fileraw?.fileData){
      let type = inventory?.fileraw?.fileType?.replace('.', '');
      setImageType(type ?? '');
      let mimeType = mime.getType(type);
      let dataPrefix = `data:` + mimeType + `;base64,`;
      let attach64 = `${dataPrefix}${inventory?.fileraw?.fileData}`;
      let attachFile = await urlToFile(attach64, mimeType);
      setImage64(attach64);
      setImage(attachFile);
    }
  }

  const GetVend = async (vendId ) => {
    setError(null);
    setLoading(true);
    let api = '?vendId=' + vendId;
    let response = await dispatch(getList(user, token, 'Merchant/vendor/getvendor'+ api,   ));
    setLoading(false);
    let vend = response && response?.data && response?.data[0];
    if(response?.error) setError(response?.error)
    else if(vend){
      setSelected(vend)
      setItem(response?.data);
      setAddress({ value: vend?.address1 ?? '' });
      setAddress1({ value: vend?.address2 ?? ''});
      setEmail({ value: vend?.email ?? ''  });
      setNote({ value: vend?.note ?? ''  });
      setPhone({ value: vend?.phone ?? ''  });
      setWeb({ value: vend?.webSite ?? ''  });
      setName({ value: vend?.vendName ?? ''  });
      setCustomer({ value: vend?.vendorCustId ?? '' , name : vend?.vendorCustName ?? ''})
      setRep({ value: vend?.vendSalesRepId ?? '', name : vend?.vendSalesRepName ?? ''})
      setIsOTC( vend?.useOtcorder === 'Y')
      getImage(vend);
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
    let phoneLength = 8;
    let isPhoneValid = !phone?.value?.trim() || phone?.value?.length >= phoneLength;
    let isEmailValid = !email?.value?.trim() || validateEmail(email?.value?.trim());
    let isCustValid = isOTC ? customer?.value?.trim() : true;
    let isRepValid = isOTC ? rep?.value?.trim() : true;
    if(isEmailValid && name?.value?.trim() && isPhoneValid && isCustValid && isRepValid){
      return true;
    } else {
      if(!name?.value?.trim()) setName({ value: '', error: t('error.not_empty') });
      if(!isEmailValid) setEmail({ value: email?.value?.trim(), error: t('error.be_right') });
      if(!isPhoneValid) setPhone({ value: phone?.value, error: ' ' + phoneLength + t('error.longer_than') });
      if(!isCustValid && !customer?.value?.trim()) setCustomer({...customer, error: t('error.not_empty') });
      if(!isRepValid && !rep?.value?.trim()) setRep({...rep, error: t('error.not_empty') });
      return false;
    }
  }

  const onClickSave = async e => {
    console.log(isOTC)
    e?.preventDefault();
    if(checkValid()){
      onLoad();
      setLoading(true);
      let data = [ {
        vendId: selected ? selected?.vendId : -1,
        vendName: name?.value?.trim(),
        email: email?.value?.trim(),
        contact : '',
        vendCode : selected ? selected?.vendId : -1,
        phone: phone?.value?.trim(),
        webSite: web?.value?.trim(),
        address1: address?.value?.trim(), address2: address1?.value?.trim(),
        image: { FileData: image64 ?? '', FileType: imageType ?? '' },
        city: "", region: "", postalCode: "", country: "",
        note: note?.value?.trim(),
        rowStatus: selected ? "U" : "I",
        useOtcorder: isOTC ? 'Y' : 'N',
        vendorCustId: isOTC ? customer?.value : "",
        vendorCustName: customer?.name ? customer?.name : "",
        vendSalesRepId: isOTC ? rep?.value : "",
        vendSalesRepName: rep?.name ? rep?.name : "",
      }]
      const response = await dispatch(sendRequest(user, token, 'Merchant/vendor', data));
      if(response?.error) onError(response?.error);
      else onSuccess(t('supplier.add_success'));  
    } 
  }

  const onClickDelete = async () => {
    onLoad();
    let data = [ {
      vendId: selected ? selected?.vendId : -1,
      vendName: name?.value?.trim(),
      email: email?.value?.trim(),
      contact : '',
      vendCode : selected ? selected?.vendId : -1,
      phone: phone?.value?.trim(),
      webSite: web?.value?.trim(),
      address1: address?.value?.trim(), address2: address1?.value?.trim(),
      city: "", region: "", postalCode: "", country: "",
      note: note?.value?.trim(),
      rowStatus: "D",
      useOtcorder: isOTC ? 'Y' : 'N',
      vendorCustId: customer?.value,
      vendorCustName: "string",
      vendSalesRepId: rep?.value,
      vendSalesRepName: "string",
      image: { },
    }];
    const response = await dispatch(sendRequest(user, token, 'Merchant/vendor', data));
    if(response?.error) onError(response?.error, true);
    else onSuccess(t('employee.delete_success'), true);
  }
  
  const mainProps = { setError, name, setName, phone, setPhone, email, setEmail, setEdited, address, setAddress, address1, setAddress1, 
    web, setWeb, note, setNote, image, setImage, setImage64, image64, setImageType, isOTC, setIsOTC, customer, setCustomer, rep, setRep };
  const btnProps = { onClickCancel, onClickSave, onClickDelete, type: 'submit', show: item ? true:  false , id: 'btn_supp_z' };

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