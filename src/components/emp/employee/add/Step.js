import React from 'react';
import { useTranslation } from 'react-i18next';

import { Button } from '../../../all/Button';

export function Step(props){
  const { current, steps, onNext } = props;
  const { t } = useTranslation();

  return (
    <div className='step_back'>
      {/* {current > 0 && (<Button className='step_prev' text={t('page.cancel')} onClick={onBack} />)} */}
      <div style={{flex: 1}} />
      {current < steps?.length - 1 && (<Button className='step_next' text={t('page.next')} onClick={onNext} />)}
      {/* {current === steps?.length - 1 && (<Button className='step_invoice' text={t('system.invoice')} onClick={onPressExport} />)}
      {current === steps?.length - 1 &&
        (<Button className='step_next' text={t('employee.paid')} onClick={onDone} />)} */}
    </div>
  );
}