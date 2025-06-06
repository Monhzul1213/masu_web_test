import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';

import { getList } from '../../../../services';
import { Input, Select, InputPassword, UploadImage } from '../../../all';

export function CardMain(props){
  const { setError, setEdited, name, setName, mail, setMail, password, setPassword, phone, setPhone, 
          role, setRole, code, setCode, selected, isOwner, image, setImage, setImage64, setImageType } = props;
  const { t } = useTranslation();
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(false);
  const { user, token }  = useSelector(state => state.login);
  const dispatch = useDispatch();

  useEffect(() => {
    onFocus();
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onFocus = async () => {
    if(!roles?.length){
      setError(null);
      setLoading(true);
      const response = await dispatch(getList(user, token, 'Employee/Role/-1'));
      if(response?.error) setError(response?.error);
      else setRoles(response?.data);
      setLoading(false);
    }
  }

  const changePhone = value => {
    let text = value?.value?.replace(/[^0-9]/g, '');
    setPhone({ value: text });
  }

  const nameProps = { value: name, setValue: setName, label: t('page.name'), placeholder: t('page.name'), setError, inRow: true, setEdited, length: 50 };
  const mailProps = { value: mail, setValue: setMail, label: t('employee.mail'), placeholder: t('employee.mail'), setError, setEdited, disabled: isOwner };
  const passProps = { value: password, setValue: setPassword, label: t('employee.password'), placeholder: t('employee.password'),
    setError, setEdited, length: 20, disabled: selected ? true : false };
  const phonProps = { value: phone, setValue: changePhone, label: t('shop.phone'), placeholder: t('shop.phone'), setError, setEdited, length: 20 };
  const roleProps = { value: role, setValue: setRole, label: t('employee.role'), placeholder: t('employee.role'), setError, setEdited,
    data: roles, s_value: 'roleId', s_descr: 'roleName', onFocus, loading, disabled: isOwner };
  const codeProps = { value: code, setValue: setCode, label: t('employee.code'), placeholder: t('employee.code'), setError, setEdited,
    mask: '9 9 9 9', maskChar: '_' };
  const imageProps = { image, setImage, setImage64, setImageType, setError, className: 'em_image' };

  return (
    <div className='ea_back'>
      <div className='ei_back'>
        <div >
          <Input {...nameProps} />
          <Input {...mailProps} />
        </div>
        <UploadImage {...imageProps}/>
      </div>
      <InputPassword {...passProps} />
      <Input {...phonProps} />
      <Select {...roleProps} />
      {role?.value ? <Input {...codeProps} /> : null}
    </div>
  )
}