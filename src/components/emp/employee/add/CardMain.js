import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { CheckBox, Input, Select } from '../../../all';

export function CardMain(props){
  const { setError, setEdited, name, setName, mail, setMail, phone, setPhone, role, setRole, code, setCode, invite, setInvite } = props;
  const { t } = useTranslation();
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(false);

  const onFocus = async () => {

  }
  
  const nameProps = { value: name, setValue: setName, label: t('page.name'), placeholder: t('page.name'), setError, inRow: true, setEdited, length: 50 };
  const mailProps = { value: mail, setValue: setMail, label: t('employee.mail'), placeholder: t('employee.mail'), setError, setEdited, length: 20 };
  const phonProps = { value: phone, setValue: setPhone, label: t('shop.phone'), placeholder: t('shop.phone'), setError, setEdited, length: 20 };
  const roleProps = { value: role, setValue: setRole, label: t('employee.role'), placeholder: t('employee.role'), setError, setEdited,
    data: roles, s_value: 'categoryId', s_descr: 'categoryName', onFocus, loading };
  const codeProps = { value: code, setValue: setCode, label: t('employee.code'), placeholder: t('employee.code'), setError, setEdited,
    mask: '9 9 9 9', maskChar: '_' };
  const checkProps = { label: 'employee.invite', checked: invite, setChecked: setInvite };

  return (
    <div className='ac_back' id='emp_ac_back'>
      <Input {...nameProps} />
      <Input {...mailProps} />
      <Input {...phonProps} />
      <Select {...roleProps} />
      {role?.value && <Input {...codeProps} />}
      {role?.value && <CheckBox {...checkProps} />}
    </div>
  )
}