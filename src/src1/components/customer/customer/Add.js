import React, { useState, useEffect } from 'react';
import { Modal, message } from 'antd';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';

import { cityList, validateEmail } from '../../../../helpers';
import { sendRequest, getList } from '../../../../services';
import { ButtonRow, ModalTitle, Overlay, Error, Confirm } from '../../all/all_m';
import { IconInput, Input, Select, IconButton, DynamicBSIcon } from '../../../../components/all';
import { Location } from '../../../../components/config/store/Location';
import { AddType } from './AddType';

export function Add(props){
  const { visible, selected, closeModal, onSearch, filter, branch, allBranch, setEdited} = props;
  const { t } = useTranslation();
  const [custName, setCustName] = useState({ value: '' });
  const [address, setAddress] = useState({ value: '' });
  const [phone, setPhone] = useState({ value: '' });
  const [email, setEmail] = useState({ value: '' });
  const [custCode, setCustCode] = useState({ value: '' });
  const [note, setNote] = useState({ value: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [descr, setDescr] = useState({ value: null });
  const [subDescr, setSubDescr] = useState({ value: null });
  const [subBranch, setSubBranch] = useState([]);
  const [location, setLocation] = useState(null);
  const [select, setSelect] = useState(false);
  const [lat, setLat] = useState(null);
  const [lng, setLng] = useState(null);
  const [descr1, setDescr1] = useState({ value: null });
  const [descr2, setDescr2] = useState({ value: null });
  const [city, setCity] = useState(null);
  const [open, setOpen] = useState(false);
  const [type, setType] = useState({ value: -1 });
  const [types, setTypes] = useState([{customerTypeID: -1, typeName: t('customer.no_type')}]);
  const [typeVisible, setTypeVisible] = useState(false);
  const { user, token }  = useSelector(state => state.login);
  const dispatch = useDispatch();

  useEffect(() => {
    getTypes();
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if(selected){
      setCustName({ value: selected?.custName ?? '' });
      setPhone({ value: selected?.phone ?? '' });
      setEmail({ value: selected?.email ?? '' });
      setAddress({ value: selected?.address ?? '' });
      setNote({ value: selected?.note ?? '' });
      setCustCode({ value: selected?.custCode ?? '' });
      setDescr({value: selected?.branchCode ?? ''});
      setSubDescr({value: selected?.subBranchCode ?? ''});
      setType({value: selected?.customerTypeId ?? -1})
      setLocation({ value : selected?.latitudes ? selected?.latitudes + '\n' + selected?.longitudes : ''})
      setSubBranch(allBranch?.filter(item => item?.branchCode?.includes(selected?.branchCode)));
      setLat( selected?.latitudes ? selected?.latitudes : 47.91452468522501 );
      setLng(selected?.longitudes ? selected?.longitudes : 106.91007001230763 );
    }
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allBranch]);

  const checkValid = () => {
    let nameLength = 2, noteLength = 10, addressLength = 8
    let isPhoneValid = phone?.value?.trim();
    let isEmailValid = validateEmail(email?.value?.trim());
    let isNameValid = custName?.value?.length >= nameLength;
    let isNoteValid = note?.value?.length >= noteLength;
    let isAddressValid = address?.value?.length >= addressLength;
    if(isNameValid && isPhoneValid){
      return true;
    } else {
      if(!custName?.value?.trim()) setCustName({ value: '', error: t('error.not_empty') });
      if(!phone?.value?.trim()) setPhone({ value: '', error: t('error.not_empty') });
      if(!isNameValid) setCustName({ value: custName?.value, error: ' ' + nameLength + t('error.longer_than') });
      if(!isNoteValid) setNote({ value: note?.value, error: ' ' + noteLength + t('error.longer_than') });
      if(!isAddressValid) setAddress({ value: address?.value, error: ' ' + addressLength + t('error.longer_than') });
      if(!isEmailValid) setEmail({ value: email?.value?.trim(), error: t('error.be_right') });

    }
  }

  const onClickSave = async e => {
    e?.preventDefault();
    setError(null);
    if(checkValid()){
      setLoading(true);
      let data =
          [{
            custID: selected ? selected?.custId : -1,
            merchantID : user?.merchantId,
            custCode: custCode?.value?.trim(),
            custName: custName?.value?.trim(),
            email: email?.value?.trim(),
            phone: phone?.value?.trim(),
            address: address?.value?.trim(),
            city: "",
            region: "",
            postalCode: "",
            country: "",
            note: note?.value?.trim(),
            rowStatus : selected ? "U" : "I",
            branchCode: descr?.value,
            subBranchCode: subDescr?.value,
            latitudes: lat,
            longitudes: lng,
            customerTypeID: type?.value
          }]
      const response = await dispatch(sendRequest(user, token, 'Site/Customer',  data));
      setLoading(false);
      if(response?.error) setError(response?.error);
      else {
        closeModal(true);
        message.success(t('customer.add_success'));
        onSearch(filter)
      }
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
        [{
            custID: selected?.custId,
            merchantID: user?.merchantId,
            custCode: selected?.custCode,
            custName: selected?.custName,
            email: selected?.email,
            phone: selected?.phone,
            address: selected?.address,
            city: "",
            region: "",
            postalCode: "",
            country: "",
            note: selected?.note,
            rowStatus : "D"
        }];
      const response = await dispatch(sendRequest(user, token, 'Site/Customer', data));
      if(response?.error) setError(response?.error);
      else {
        closeModal(true);
        message.success(t('customer.delete_success'));
      }
      setLoading(false);
    }
  }

  const onChangeDescr = value => {
    setDescr(value);
    setSubBranch(allBranch?.filter(item => item?.branchCode?.includes(value?.value)));
    cityList?.forEach(item => {
      if(item?.districtCode?.includes(value?.value)){
        setDescr1({value: item?.lan})
        setDescr2({value: item?.lng})
        setCity(item?.city)
    }});
  }

  const onClickLocation = row => {
    if(!descr?.value) {
      setDescr({ value: null, error: t('profile.select') });
      setSelect(false);
    } else setSelect(true);
  }

  const closeLocation = (hasLocation, y, x) => {
    setSelect(false);
    if(hasLocation){
      let coordinate = y + '\n' + x;
      setLocation({value: coordinate})
      setLat(y)
      setLng(x)
      setError && setError(null);
    }
  }

  const getTypes = async (toGet, id) => {
    if(!types?.length || types?.length === 1 || toGet){
      setError(null);
      const response = await dispatch(getList(user, token, 'Site/GetCustomerType'));
      if(response?.error) setError(response?.error);
      else {
        let data = [...[{customerTypeID: -1, typeName: t('customer.no_type')}], ...response?.data?.msCustomerType];
        setTypes(data);
        if(id) setType({ value: id });
      }
    }
  }

  const onClickCategory = e => {
    e?.preventDefault();
    setTypeVisible(true);
  }

  const closeCategory = (saved, id) => {
    setTypeVisible(false);
    getTypes(saved, id);
  }

  const maxheight= 'calc(90vh - 105px )';
  const nameProps = { value: custName, setValue: setCustName, label: t('page.name'), placeholder: t('customer.name'), setError, length: 64  };
  const phoneProps = { value: phone, setValue: changePhone, label: t('page.phone'), placeholder: t('customer.phone'), setError, length: 8 };
  const mailProps = { value: email, setValue: setEmail, label: t('page.email'), placeholder: t('customer.email'), setError, length: 100};
  const codeProps = { value: custCode, setValue: setCustCode, label: t('page.code'), placeholder: t('customer.code'), setError,  };
  const descrProps = { value: note, setValue: setNote, label: t('customer.desc'), placeholder: t('customer.desc'), setError , length: 255};
  const addressProps = {  value: address, setValue: setAddress,label: t('customer.address'), placeholder: t('customer.address1'), setError, length: 192 };
  const btnProps = { onClickCancel: () => closeModal(), onClickSave, type: 'submit', show: selected ? true : false, onClickDelete };
  const confirmProps = { open, text: t('page.delete_confirm'), confirm: onDelete };
  const cityProps = { value: descr, setValue: onChangeDescr, label: t('shop.city'), placeholder: t('shop.location1'), setError,
  data: branch, s_value : 'branchCode', s_descr :'branchName', };
  const districtProps = { value: subDescr, setValue: setSubDescr, label: t('shop.district'), placeholder: t('shop.location1'), setError,
    data: subBranch, s_value : 'subBranchCode', s_descr :'subBranchName' };
  const locProps = { value: location, setValue: setLocation, label: t('tax.location'), placeholder: t('tax.location'), setError, length: 250, 
    onClick: onClickLocation, disabled: true, className: 'store_descr' };
  const mapProps = { visible: select, closeModal: closeLocation, setLat, lat, lng, setLng, descr1, descr2, city };
  const categoryProps = { value: type, setValue: setType, label: t('discount.type'), setError, setEdited, inRow: false,
  data: types, s_value: 'customerTypeID', s_descr: 'typeName', onFocus: getTypes };

  return (
    <Modal title={null} footer={null} closable={false} open={visible} centered={true} width={400}>
      {open && <Confirm {...confirmProps} />}
      {select && <Location {...mapProps} />}
      {typeVisible && <AddType visible={typeVisible} closeModal={closeCategory} />}
      <Overlay loading={loading}>
        <div className='m_back'>
          <ModalTitle icon='MdSupervisorAccount' title={t(selected ? 'customer.edit' : 'customer.new')} isMD={true} />
          <div style={{ overflowY: 'scroll', maxHeight: maxheight }}>
            <form onSubmit={onClickSave}>
              <Input {...nameProps}  />
              <div id='im_unit_row_large'>
                <div style={{flex: 1}}><Select {...categoryProps} /></div>
                <IconButton className='im_add_btn' onClick={onClickCategory} icon={<DynamicBSIcon name='BsPlusLg' className='im_add_btn_icon' />} />
              </div>
              <Input {...phoneProps} />
              <Input {...mailProps} />
              <Select {...cityProps} />
              <Select {...districtProps} />
              <IconInput {...locProps} />
              <Input {...addressProps} />
              <Input {...codeProps} />
              <Input {...descrProps} />
              <div className='gap'/>
            </form>
          </div>
          {error && <Error error={error} id = 'm_error' />}
        </div>
        <ButtonRow {...btnProps} />
      </Overlay>
    </Modal>
  )
}