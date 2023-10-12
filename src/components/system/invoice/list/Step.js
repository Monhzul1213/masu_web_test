import React from 'react';
import { useTranslation } from 'react-i18next';

import { Button } from '../../../all/Button';

export function Step(props){
  const { print, onPressSent, onBack, onPressPrint } = props;
  const { t } = useTranslation();

  return (
    <div className='step_back'>
      <Button className='step_prev' text={t('page.cancel')} onClick={onBack} />
      <div style={{flex: 1}} />
      { print ? <Button className='step_next' text={t('system.tax_print')} onClick={onPressPrint} /> 
              : <Button className='step_next' text={t('system.tax_sent')} onClick={onPressSent} /> }
    </div>
  );
}