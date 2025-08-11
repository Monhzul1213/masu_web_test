import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { withSize } from 'react-sizeme';
import { useSelector, useDispatch } from 'react-redux';

import { Input , UploadImage, CheckBox } from '../../all/all_m';
import { Check } from './Check';
import { getOTC } from '../../../../services';

 function Card(props){
  const {setEdited, setError, name, setName, phone, setPhone, email, setEmail,
     address, setAddress, address1, setAddress1, web, setWeb, note, setNote, image,
     setImage,size,  setImage64, setImageType, isOTC, setIsOTC, customer, setCustomer, rep, setRep
    } = props;
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { user, token }  = useSelector(state => state.login);
  const [loading, setLoading] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const changePhone = value => {
    let text = value?.value?.replace(/[^0-9]/g, '');
    if(isNaN(text)) setPhone({ value: value?.value, error: 'must_number'});
    else setPhone({ value: (text) });
  } 

  const handleCust = async ( e) => {
    e?.preventDefault();
    if(customer?.value){
      setLoading(true)
      let api = 'GetCustName?CustID=' + customer?.value ;
      const response = await dispatch(getOTC(user, token, api));
      if(response?.error) setCustomer({error1: response?.error})
      else setCustomer({value: customer?.value, name: response?.data ? response?.data : '' })
      setLoading(false)
    }
  }

  const handleRep = async ( e) => {
    e?.preventDefault();
    if(customer?.value){
    setLoaded(true)
    let api = 'GetSrName?SalesRepID=' + rep?.value ;
    const response = await dispatch(getOTC(user, token, api));
    if(response?.error) setRep({error1: response?.error})
    else setRep({value: rep?.value, name: response?.data ? response?.data : '' })
    setLoaded(false)
    }
  }

  const id = size?.width > 480 ? 'im_large' : 'im_small';

  const nameProps = { value: name, setValue: setName, label: t('page.name'), placeholder: t('supplier.name'), setError, setEdited, id: 'l_partner'};
  const phoneProps = { value: phone, setValue: changePhone, label: t('page.phone'), placeholder: t('supplier.phone'), setError ,setEdited };
  const mailProps = { value: email, setValue: setEmail, label: t('page.email'), placeholder: t('supplier.email'), setError, length: 100,setEdited};
  const webProps = { value: web, setValue: setWeb, label: t('supplier.web'), placeholder: t('supplier.web'), setError, length: 100,setEdited};
  const address1Props = { value: address1, setValue: setAddress1, label: t('supplier.address2'), placeholder: t('supplier.address2'), setError, length: 100, setEdited};
  const descrProps = { value: note, setValue: setNote, label: t('supplier.desc'), placeholder: t('supplier.desc'), setError , length: 255, setEdited};
  const addressProps = { value: address, setValue: setAddress,label: t('supplier.address1'), placeholder: t('supplier.address1'), setError, length: 192, setEdited };
  const imageProps = { image, setImage, setImage64, setImageType, setEdited, setError, className: 'im_image_z' };
  const otcProps = { label: t('supplier.is_otc'), checked: isOTC, setChecked: setIsOTC };

  return (
    <div className='ac_back_cz' id={id}>
      <form>
            <UploadImage {...imageProps} />
            <div className = "im_unit_row_z">
              <Input {...nameProps}  />
              <div className='im_gap' />
              <CheckBox {...otcProps} />
            </div>
            <Check label='cust' value={customer} setValue={setCustomer} disabled={!isOTC} handleCheck ={handleCust} loading = {loading}/>
            <Check label='rep' value={rep} setValue={setRep} disabled={!isOTC} handleCheck ={handleRep} loading = {loaded}/>
            <Input {...mailProps} />
            <Input {...phoneProps} />
            <Input {...webProps} />
            <Input {...addressProps} />
            <Input {...address1Props} />
            <Input {...descrProps} />
        </form>
    </div>
    
  )
}
const withSizeHOC = withSize();
export const Add = withSizeHOC(Card);