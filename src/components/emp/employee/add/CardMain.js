import React from 'react';
import { useTranslation } from 'react-i18next';

import { Input } from '../../../all';

export function CardMain(props){
  const { setError, setEdited, name, setName } = props;
  const { t } = useTranslation();
  
  const nameProps = { value: name, setValue: setName, label: t('page.name'), placeholder: t('page.name'), setError, inRow: true, setEdited, length: 50 };
  
  return (
    <div className='ac_back' id='emp_ac_back'>
      <Input {...nameProps} />
    </div>
  )
}