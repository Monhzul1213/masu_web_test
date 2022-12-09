import React from 'react';
import { useTranslation } from 'react-i18next';

import '../../../../css/report.css';
import { Button } from '../../all/all_m';

export function Header(){
  const { t } = useTranslation();


  const exportProps = { text: t('page.export'), className: 'ih_btn_e', disabled: true };
  
  return (
    <div className='ih_btn_row_z' id=''>
      <Button {...exportProps}  />
    </div>
  );
}