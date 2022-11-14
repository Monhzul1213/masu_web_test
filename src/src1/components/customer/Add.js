import React, { useState, useEffect } from 'react';
import { Modal, message } from 'antd';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';
import {  validateEmail } from '../../helpers';
import { sendRequest } from '../../services';
import { ButtonRow, ModalTitle, Overlay, Error, Confirm ,} from '../all/all_m';
import { Input } from '../all/all_m';
export function Add(props){
  const { visible, selected, closeModal, item } = props;
  const { t } = useTranslation();
  const [custName, setCustName] = useState({ value: '' });
  const [address, setAddress] = useState({ value: '' });
  const [phone, setPhone] = useState({ value: '' });
  const [email, setEmail] = useState({ value: '' });
  const [custCode, setCustCode] = useState({ value: '' });
  const [note, setNote] = useState({ value: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [open, setOpen] = useState(false);
  const { user, token }  = useSelector(state => state.login);
  const dispatch = useDispatch();

  useEffect(() => {
    if(selected){
      setCustName({ value: selected?.custName ?? '' });
      setPhone({ value: selected?.phone ?? '' });
      setEmail({ value: selected?.email ?? '' });
      setAddress({ value: selected?.address ?? '' });
      setNote({ value: selected?.note ?? '' });
      setCustCode({ value: selected?.custCode ?? '' });

    }
    console.log(item)
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const checkValid = () => {
 
    let isEmailValid = validateEmail(email?.value?.trim());
    if( isEmailValid  && custName?.value?.trim()){
      return true;
    } else {
      if(!email?.value?.trim()) setEmail({ value: '', error: t('error.not_empty') });
      else if(!isEmailValid) setEmail({ value: email?.value?.trim(), error: t('error.be_right') });
      if(!custName?.value?.trim()) setCustName({ value: '', error: t('error.not_empty') });
      if(!phone?.value?.trim()) setPhone({ value: '', error: t('error.not_empty') });
      if(!custCode?.value?.trim()) setCustCode({ value: '', error: t('error.not_empty') });
      
    }
  }
  const onClickSave = async e => {
    e?.preventDefault();
    setError(null);
    if(checkValid()){
      setLoading(true);
      let data =
          [{
            "custID": selected ? selected?.custId : -1,
            "merchantID" : user?.merchantId,
            "custCode": custCode?.value?.trim(),
            "custName": custName?.value?.trim(),
            "email": email?.value?.trim(),
            "phone": phone?.value?.trim(),
            "address": address?.value?.trim(),
            "city": "",
            "region": "",
            "postalCode": "",
            "country": "",
            "note": note?.value?.trim(),
            "rowStatus" : selected ? "U" : "I",
          }]
      console.log(data )
      const response = await dispatch(sendRequest(user, token, 'Site/Customer',  data));
      console.log(response);
      if(response?.error) setError(response?.error);
      else {
        closeModal(true);
        message.success(t('customer.add_success'));
      }
      setLoading(false);
    } 
  }
 
  const changePhone = value => {
    let text = value?.value?.replace(/[^0-9]/g, '');
    if(isNaN(text)) setPhone({ value: value?.value, error: 'must_number'});
    else setPhone({ value: (text) });
  } 
  const onClickDelete = () => setOpen(true);

  const onDelete = async sure => {
    setError(null);
    setOpen(false);
    if(sure){
      setLoading(true);
      let data = 
        [
          {
            "custID": selected?.custId,
            "merchantID": user?.merchantId,
            "custCode": selected?.custCode,
            "custName": selected?.custName,
            "email": selected?.email,
            "phone": selected?.phone,
            "address": selected?.address,
            "city": "",
            "region": "",
            "postalCode": "",
            "country": "",
            "note": selected?.note,
            "rowStatus" : "D"
          }
        ];
      const response = await dispatch(sendRequest(user, token, 'Site/Customer', data));
      console.log(response, '------');
      if(response?.error) setError(response?.error);
      else {
        closeModal(true);
        message.success(t('customer.delete_success'));
      }
      setLoading(false);
    }
  }
  const maxheight1= 'calc(90vh - 405px)';
  const maxheight= 'calc(90vh - 105px )';
  const nameProps = { value: custName, setValue: setCustName, label: t('page.name'), placeholder: t('customer.name'), setError, length: 64 };
  const phoneProps = { value: phone, setValue: changePhone, label: t('page.phone'), placeholder: t('customer.phone'), setError, };
  const mailProps = { value: email, setValue: setEmail, label: t('page.email'), placeholder: t('customer.email'), setError, length: 100};
  const codeProps = { value: custCode, setValue: setCustCode, label: t('page.code'), placeholder: t('customer.code'), setError,  };
  const descrProps = { value: note, setValue: setNote, label: t('customer.desc'), placeholder: t('customer.desc'), setError , length: 255};
  const addressProps = {  value: address, setValue: setAddress,label: t('customer.address'), placeholder: t('customer.address1'), setError, length: 192 };
  const btnProps = { onClickCancel: () => closeModal(), onClickSave, type: 'submit', show: selected ? true : false, onClickDelete };
  const confirmProps = { open, text: t('page.delete_confirm'), confirm: onDelete };

  return (
    <Modal title={null} footer={null} closable={false} open={visible} centered={true} width={400}>
      {open && <Confirm {...confirmProps} />}
      <Overlay loading={loading}>
        <div className='m_back'>
          <ModalTitle icon='MdSupervisorAccount' title={t(selected ? 'customer.edit' : 'customer.new')} isMD={true} />
          <div style={{ overflowY: 'scroll', maxHeight: selected ? maxheight1 : maxheight }}>
            <form onSubmit={onClickSave}>
              <Input {...nameProps}  />
              <Input {...phoneProps} />
              <Input {...mailProps} />
              <Input {...addressProps} />
              <Input {...codeProps} />
              {<Input {...descrProps} />}
            </form>
            {error && <Error error={error} id = 'm_error' />}
            
          </div>
          {selected && <div className='selected_div'>
                <div className='line'/>
                  <div className='line1'>
                    <div className='a_item_text'>
                      <p className='a_item_title'>{item.createdDate}</p>
                      <p className='a_item_sub_title'>{t('customer.first_visit')}</p>
                    </div>
                    <div className='a_item_text'>
                      <p className='a_item_title'>{item.lastUpdate}</p>
                      <p className='a_item_sub_title'>{t('customer.last_visit')}</p>
                    </div>
                  </div>
                  <div className='line1'>
                    <div className='a_item_text'>
                      <p className='a_item_title'>{'0'}</p>
                      <p className='a_item_sub_title'>{t('customer.visit_total')}</p>
                    </div>
                    <div className='a_item_text'>
                      <p className='a_item_title'>{'₮0'}</p>
                      <p className='a_item_sub_title'>{t('customer.total_spent')}</p>
                    </div>
                  </div>
                  <div className='line1'>
                    <div className='a_item_text'>
                        <p className='a_item_title'>{'0'}</p>
                        <p className='a_item_sub_title'>{t('customer.total_balance')}</p>
                    </div>
                  </div>
                 
            </div>}
        </div>
        <ButtonRow {...btnProps} />
      </Overlay>
    </Modal>
  )
}