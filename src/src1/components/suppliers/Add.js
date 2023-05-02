import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Input , UploadImage } from '../all/all_m';
import { withSize } from 'react-sizeme';
// import { Check } from './Check';

 function Card(props){
  const {setEdited, setError, name, setName, phone, setPhone, email, setEmail,
     address, setAddress, address1, setAddress1, web, setWeb, note, setNote, image,
     setImage,size,  setImage64, setImageType, //checked, setChecked, customer, setCustomer, contact, setContact
    } = props;
  const { t } = useTranslation();

  useEffect(() => {
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const changePhone = value => {
    let text = value?.value?.replace(/[^0-9]/g, '');
    if(isNaN(text)) setPhone({ value: value?.value, error: 'must_number'});
    else setPhone({ value: (text) });
  } 

  const id = size?.width > 480 ? 'im_large' : 'im_small';

  const nameProps = { value: name, setValue: setName, label: t('page.name'), placeholder: t('supplier.name'), setError,length1:2, setEdited, id: 'l_partner'};
  const phoneProps = { value: phone, setValue: changePhone, label: t('page.phone'), placeholder: t('supplier.phone'), setError ,setEdited };
  const mailProps = { value: email, setValue: setEmail, label: t('page.email'), placeholder: t('supplier.email'), setError, length: 100,setEdited};
  const webProps = { value: web, setValue: setWeb, label: t('supplier.web'), placeholder: t('supplier.web'), setError, length: 100,setEdited};
  const address1Props = { value: address1, setValue: setAddress1, label: t('supplier.address2'), placeholder: t('supplier.address2'), setError, length: 100, length1: 6, setEdited};
  const descrProps = { value: note, setValue: setNote, label: t('supplier.desc'), placeholder: t('supplier.desc'), setError , length: 255, length1:10,setEdited};
  const addressProps = {  value: address, setValue: setAddress,label: t('supplier.address1'), placeholder: t('supplier.address1'), setError, length: 192, length1: 6,setEdited };
  const imageProps = { image, setImage, setImage64, setImageType, setEdited, setError, className: 'im_image_z' };
  // const serviceProps = { label: t('supplier.check'), checked, setChecked };
  // const checkProps = { checked, customer, setCustomer, contact, setContact }

  return (
    <div className='ac_back_cz' id={id}>
      <form>
            <UploadImage {...imageProps} />
            {/* <div className = "im_unit_row_z"> */}
              <Input {...nameProps}  />
              {/* <div className='im_gap' /> */}
              {/* <CheckBox {...serviceProps} /> */}
            {/* </div> */}
            {/* <Check {...checkProps}/> */}
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