import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { CheckAll } from '../../../all';

export function CardSite(props){
  const { isTrack } = props;
  const { t } = useTranslation();
  const [checked, setChecked] = useState(true);

  const onCheckAll = checked => {
    setChecked(checked);
  }
 
  const checkProps = { type: 'inventory', checked, onCheckAll, style: {border: 'none'} };

  return (
    <div className='ac_back'>
      <p className='ac_title'>{t('inventory.sites')}</p>
      <div style={{padding: 5}} />
      <CheckAll {...checkProps} />
    </div>
  );
}