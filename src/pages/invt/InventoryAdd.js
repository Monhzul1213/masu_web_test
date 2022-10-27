import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

import '../../css/invt.css';
import { Input, Select } from '../../components/all';

export function InventoryAdd(){
  const { t } = useTranslation();
  const [name, setName] = useState({ value: '' });
  const [category, setCategory] = useState({ value: null });
  const [error, setError] = useState(null);

  const nameProps = { value: name, setValue: setName, label: t('page.name'), placeholder: t('inventory.name'), setError,
    style1: { flex: 1 }, style2: { margin: '0 0 0 0' } };
  // const categoryProps = { value: category, setValue: setCategory, label, placeholder, data, setError, s_value, s_descr, mode }

  return (
    <div className='s_container'>
      <div className='ac_back'>
        <div className='ac_row'>
          <Input {...nameProps} />
          <div className='gap' />
          {/* <Select {...categoryProps} /> */}
        </div>
      </div>
    </div>
  )
}