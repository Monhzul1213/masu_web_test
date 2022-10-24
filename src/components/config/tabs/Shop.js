import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { DynamicBSIcon, IconButton, Table } from '../../all';

export function Shop(){
  const { t } = useTranslation();
  const [visible, setVisible] = useState(false);
  
  const onClickAdd = () => setVisible(true);

  return (
    <div className='c_tab_cont'>
      <div className='ca_row'>
        <IconButton className='ca_btn' text={t('shop.add')} id='ca_btn_add'
          icon={<DynamicBSIcon name='BsPlusLg' className='ca_icon' />} onClick={onClickAdd} />
      </div>
      <div className='ca_tab_back'>
        <Table />
      </div>
    </div>
  );
}