import React, { useState, useEffect } from 'react';
import { Modal, message } from 'antd';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';

import { deleteRequest, sendRequest } from '../../../services'
import { ButtonRow, ModalTitle, Overlay, Input, Error, Confirm, Select, IconInput } from '../../all';
import { cityList, districtList } from '../../../helpers';
import { Location } from './Location';

export function Add(props){
  const { visible, selected, closeModal } = props;
  const { t } = useTranslation();
  const [name, setName] = useState({ value: '' });
  const [address, setAddress] = useState({ value: '' });
  const [phone, setPhone] = useState({ value: '' });
  const [descr, setDescr] = useState({ value: null });
  const [subDescr, setSubDescr] = useState({ value: null });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [open, setOpen] = useState(false);
  const [list, setList] = useState([]);
  const [select, setSelect] = useState(false);
  const [lat, setLat] = useState(null);
  const [lng, setLng] = useState(null);
  const { user, token }  = useSelector(state => state.login);
  const dispatch = useDispatch();

  useEffect(() => {
    if(selected){
      setName({ value: selected?.name ?? '' });
      setAddress({ value: selected?.address ?? '' });
      setPhone({ value: selected?.phone ?? '' });
      setDescr({ value: selected?.descr ? selected?.descr : null });
      setSubDescr({ value: selected?.subDescr ? selected?.subDescr : null });
      setList(districtList?.filter(item => item?.parent?.includes(selected?.descr)));
    }
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const checkValid = () => {
    let nameLength = 2, addressLength = 8, phoneLength = 8;
    let isNameValid = name?.value && name?.value?.length >= nameLength;
    let isAddressValid = !address?.value || address?.value?.length >= addressLength;
    let isPhoneValid = !phone?.value || phone?.value?.length >= phoneLength;
    if(isNameValid && isAddressValid && isPhoneValid && descr?.value && subDescr?.value){
      return true;
    } else {
      if(!name?.value) setName({ value: '', error: t('error.not_empty') });
      else if(!isNameValid) setName({ value: name?.value, error: ' ' + nameLength + t('error.longer_than') });
      if(!isAddressValid) setAddress({ value: address?.value, error: ' ' + addressLength + t('error.longer_than') });
      if(!isPhoneValid) setPhone({ value: phone?.value, error: ' ' + phoneLength + t('error.longer_than') });
      if(!descr?.value) setDescr({ value: null, error: t('error.not_empty') });
      if(!subDescr?.value) setSubDescr({ value: null, error: t('error.not_empty') });
      return false;
    }
  }

  const onClickSave = async e => {
    e?.preventDefault();
    setError(null);
    if(checkValid()){
      let districtCode = cityList?.filter(ct => ct.value === descr?.value)[0]?.districtCode;
      setLoading(true);
      let data = { name: name?.value, address: address?.value, phone: phone?.value?.trim(), descr: descr?.value,
        subDescr: subDescr?.value, districtCode, latitudes: lat, longtitudes: lng};
        console.log(data)
      if(selected) data.siteID = selected.siteId;
      else data.merchantID = user?.merchantId;
      let api = selected ? 'Site/UpdateSite' : 'Site/AddSite';
      const response = await dispatch(sendRequest(user, token, api, data));
      if(response?.error) setError(response?.error);
      else {
        closeModal(true);
        message.success(t('shop.add_success'));
      }
      setLoading(false);
    }
  }

  const onClickDelete = () => setOpen(true);

  const onDelete = async sure => {
    setError(null);
    setOpen(false);
    if(sure){
      setLoading(true);
      const response = await dispatch(deleteRequest(user, token, 'Site/DeleteSite/' + selected?.siteId));
      if(response?.error) setError(response?.error);
      else {
        closeModal(true);
        message.success(t('shop.delete_success'));
      }
      setLoading(false);
    }
  }

  const onChangeDescr = value => {
    setDescr(value);
    setSubDescr({ value: null });
    setList(districtList?.filter(item => item?.parent?.includes(value?.value)));
  }

  const changePhone = value => {
    let text = value?.value?.replace(/[^0-9]/g, '');
    setPhone({ value: text });
  }

  const onClickLocation = row => {
    setSelect(true);
  }


  const closeLocation = (hasLocation, y, x) => {
    setSelect(false);
    if(hasLocation){
      let coordinate = y + '\n' + x;
      setAddress({value: coordinate})
      setError && setError(null);
    }
  }

  const nameProps = { value: name, setValue: setName, label: t('shop.name'), placeholder: t('shop.name1'), setError, length: 40 };
  const cityProps = { value: descr, setValue: onChangeDescr, label: t('shop.city'), placeholder: t('shop.location1'), setError,
    data: cityList };
  const districtProps = { value: subDescr, setValue: setSubDescr, label: t('shop.district'), placeholder: t('shop.location1'), setError,
    data: list };
  const addrProps = { value: address, setValue: setAddress, label: t('shop.addr'), placeholder: t('shop.addr1'), setError, length: 250, onClick: onClickLocation };
  const phoneProps = { value: phone, setValue: changePhone, label: t('shop.phone'), placeholder: t('shop.phone1'), setError, length: 20,
    handleEnter: onClickSave };
  const btnProps = { onClickCancel: () => closeModal(), onClickSave, type: 'submit', show: selected ? true : false, onClickDelete };
  const confirmProps = { open, text: t('page.delete_confirm'), confirm: onDelete };
  const mapProps = { visible: select, closeModal: closeLocation, setLat, lat, lng, setLng, selected };

  return (
    <Modal title={null} footer={null} closable={false} open={visible} centered={true} width={400}>
      {open && <Confirm {...confirmProps} />}
      <Location {...mapProps} />
      <Overlay loading={loading}>
        <div className='m_back'>
          <ModalTitle icon='MdStorefront' title={t(selected ? 'shop.edit' : 'shop.new')} isMD={true} />
          <div className='m_scroll'>
            <form onSubmit={onClickSave}>
              <Input {...nameProps} />
              <Select {...cityProps} />
              <Select {...districtProps} />
              <Input {...addrProps} />
              {/* <IconInput {...addrProps} /> */}
              <Input {...phoneProps} />
            </form>
            {error && <Error error={error} id='m_error' />}
          </div>
        </div>
        <ButtonRow {...btnProps} />
      </Overlay>
    </Modal>
  )
}