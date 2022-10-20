import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Overlay, IconButton, DynamicBSIcon } from '../../all';

export function Cashier(){
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [show, setShow] = useState(false);

  const onClickAdd = () => {};
  
  const onClickDelete = () => {};
  
  return (
    <Overlay className='c_tab_cont' loading={loading}>
      <div className='ca_row'>
        <IconButton className='ca_btn' text={t('cashier.add')} id='ca_btn_add'
          icon={<DynamicBSIcon name='BsPlusLg' className='ca_icon' />} onClick={onClickAdd} />
        {show && <IconButton className='ca_btn' text={t('page.delete')} id='ca_btn_delete'
          icon={<DynamicBSIcon name='BsTrash' className='ca_icon_del' />} onClick={onClickDelete} />}
      </div>
    </Overlay>
  );
}