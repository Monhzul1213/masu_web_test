import React, { useState } from 'react';
import { Modal } from 'antd';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';

import { validateEmail } from '../../../helpers';
import { sendRequest } from '../../../services';
import { ButtonRow, CheckBox, Error, ModalTitle, Overlay } from '../../all';
import { Input, UploadImage } from '../../../src1/components/all/all_m';
import { Check } from './Check';

export function Add(props){
  const { visible, closeModal } = props;
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [image, setImage] = useState(null);
  const [image64, setImage64] = useState('');
  const [imageType, setImageType] = useState('');
  const [name, setName] = useState({ value: '' });
  const [address, setAddress] = useState({ value: '' });
  const [phone, setPhone] = useState({ value: '' });
  const [email, setEmail] = useState({ value: '' });
  const [web, setWeb] = useState({ value: '' });
  const [address1, setAddress1] = useState({ value: '' });
  const [note, setNote] = useState({ value: '' });
  const [isOTC, setIsOTC] = useState(false);
  const [cust, setCust] = useState({ value: '' });
  const [rep, setRep] = useState({ value: '' });
  const { user, token } = useSelector(state => state.login);
  const dispatch = useDispatch();

  const onClickSave = async e => {
    e?.preventDefault();
    if(checkValid()){
      setLoading(true);
      let data = [ {
        vendId: -1,
        vendName: name?.value?.trim(),
        contact: '',//contact?.value?.trim(),
        email: email?.value?.trim(),
        phone: phone?.value?.trim(),
        webSite: web?.value?.trim(),
        address1: address?.value?.trim(),
        address2: address1?.value?.trim(),
        vendCode: '',// vendCode?.value?.trim(),
        note: note?.value?.trim(),
        rowStatus: "I",
        image: { FileData: image64 ?? '', FileType: imageType ?? '' },
        city: "", region: "", postalCode: "", country: "",
        useOtcorder: isOTC ? 'Y' : 'N',
        vendorCustId: isOTC ? cust?.value : "",
        vendorCustName: "",
        vendSalesRepId: isOTC ? rep?.value : "",
        vendSalesRepName: "",
      }]
      const response = await dispatch(sendRequest(user, token, 'Merchant/vendor', data));
      setLoading(false);
      if(response?.error) setError(response?.error);
      else {
        let id = response?.data && response?.data[0] && response?.data[0]?.vendId;
        closeModal(true, id);
      }
    } 
  }

  const checkValid = () => {
    let phoneLength = 8;
    let isPhoneValid = !phone?.value?.trim() || phone?.value?.length >= phoneLength;
    let isEmailValid = !email?.value?.trim() || validateEmail(email?.value?.trim());
    let isCustValid = isOTC ? (cust?.value?.trim() && cust?.name?.trim()) : true;
    let isRepValid = isOTC ? (rep?.value?.trim() && rep?.name?.trim()) : true;
    if(isEmailValid && name?.value?.trim() && isPhoneValid && isCustValid && isRepValid){
      return true;
    } else {
      if(!name?.value?.trim()) setName({ value: '', error: t('error.not_empty') });
      if(!isEmailValid) setEmail({ value: email?.value?.trim(), error: t('error.be_right') });
      if(!isPhoneValid) setPhone({ value: phone?.value, error: ' ' + phoneLength + t('error.longer_than') });
      if(!isCustValid && !cust?.value?.trim()) setCust({...cust, error: t('error.not_empty') });
      else if(!isCustValid && !cust?.name?.trim()) setCust({...cust, error1: t('error.not_empty') });
      if(!isRepValid && !rep?.value?.trim()) setRep({...rep, error: t('error.not_empty') });
      else if(!isRepValid && !rep?.name?.trim()) setRep({...rep, error1: t('error.not_empty') });
      return false;
    }
  }

  const changePhone = value => {
    let text = value?.value?.replace(/[^0-9]/g, '');
    if(isNaN(text)) setPhone({ value: value?.value, error: 'must_number'});
    else setPhone({ value: text });
  } 

  const imageProps = { image, setImage, setImage64, setImageType, setError, className: 'im_add_image' };
  const nameProps = { value: name, setValue: setName, label: t('page.name'), placeholder: t('supplier.name'), setError, length1: 2 };
  const mailProps = { value: email, setValue: setEmail, label: t('page.email'), placeholder: t('supplier.email'), setError, length: 100 };
  const phoneProps = { value: phone, setValue: changePhone, label: t('page.phone'), placeholder: t('supplier.phone'), setError };
  const webProps = { value: web, setValue: setWeb, label: t('supplier.web'), placeholder: t('supplier.web'), setError, length: 100 };
  const addressProps = {  value: address, setValue: setAddress, label: t('supplier.address1'), placeholder: t('supplier.address1'), setError,
    length: 192, length1: 6 };
  const address1Props = { value: address1, setValue: setAddress1, label: t('supplier.address2'), placeholder: t('supplier.address2'), setError,
    length: 100, length1: 6 };
  const descrProps = { value: note, setValue: setNote, label: t('supplier.desc'), placeholder: t('supplier.desc'), setError, length: 255, length1: 10 };
  const btnProps = { onClickCancel: () => closeModal(), onClickSave, type: 'submit', show: false };
  const otcProps = { label: t('supplier.is_otc'), checked: isOTC, setChecked: setIsOTC };

  return (
    <Modal title={null} footer={null} closable={false} open={visible} centered={true} width={420}>
      <Overlay loading={loading}>
        <div className='m_back'>
          <ModalTitle icon='TbCar' title={t('supplier.add')} />
          <div className='m_scroll' id='im_small'>
            <UploadImage {...imageProps} />
            <Input {...nameProps}  />
            <CheckBox {...otcProps} />
            
            <Check label='cust' value={cust} setValue={setCust} disabled={!isOTC} api='GetCustName?CustID=' />
            <Check label='rep' value={rep} setValue={setRep} disabled={!isOTC} api='GetSrName?SalesRepID=' />

            <Input {...mailProps} />
            <Input {...phoneProps} />
            <Input {...webProps} />
            <Input {...addressProps} />
            <Input {...address1Props} />
            <Input {...descrProps} />
            <div style={{height: 2}} />
          </div>
          {error && <Error error={error} id='m_error' />}
        </div>
        <ButtonRow {...btnProps} />
      </Overlay>
    </Modal>
  );
}