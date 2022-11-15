import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';

import { getList } from '../../../../services';
import { Input, Select, InputPassword } from '../../../all';

export function CardMain(props){
  const { setError, setEdited, name, setName, mail, setMail, password, setPassword, phone, setPhone, role, setRole, code, setCode } = props;
  const { t } = useTranslation();
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(false);
  const { user, token }  = useSelector(state => state.login);
  const dispatch = useDispatch();

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
  
  const nameProps = { value: name, setValue: setName, label: t('page.name'), placeholder: t('page.name'), setError, inRow: true, setEdited, length: 50 };
  const mailProps = { value: mail, setValue: setMail, label: t('employee.mail'), placeholder: t('employee.mail'), setError, setEdited, length: 20 };
  const passProps = { value: password, setValue: setPassword, label: t('employee.password'), placeholder: t('employee.password'),
    setError, setEdited, length: 20 };
  const phonProps = { value: phone, setValue: setPhone, label: t('shop.phone'), placeholder: t('shop.phone'), setError, setEdited, length: 20 };
  const roleProps = { value: role, setValue: setRole, label: t('employee.role'), placeholder: t('employee.role'), setError, setEdited,
    data: roles, s_value: 'roleId', s_descr: 'roleName', onFocus, loading };
  const codeProps = { value: code, setValue: setCode, label: t('employee.code'), placeholder: t('employee.code'), setError, setEdited,
    mask: '9 9 9 9', maskChar: '_' };

  return (
    <div className='ac_back' id='emp_ac_back'>
      <Input {...nameProps} />
      <Input {...mailProps} />
      <InputPassword {...passProps} />
      <Input {...phonProps} />
      <Select {...roleProps} />
      {role?.value && <Input {...codeProps} />}
    </div>
  )
}