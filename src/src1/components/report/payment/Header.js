import React from 'react';
import { useTranslation } from 'react-i18next';

import '../../../../css/report.css';
import { Button } from '../../../components/all/all_m';

export function Header(){
  const { t } = useTranslation();


  const exportProps = { text: t('page.export'), className: 'rp_list_select', disabled: true };
  
  return (
    <div className='ih_btn_row_z' >
      <Button {...exportProps}  />
    </div>
  );
}