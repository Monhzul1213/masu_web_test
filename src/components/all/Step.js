import React from 'react';
import { useTranslation } from 'react-i18next';

import { Button } from './Button';

export function Step(props){
  const { current, steps, setCurrent, onDone } = props;
  const { t } = useTranslation();

  const next = () => setCurrent(current + 1);
  const prev = () => setCurrent(current - 1);

  return (
    <div className='step_back'>
      {current > 0 && (<Button className='step_prev' text={t('page.prev')} onClick={prev} />)}
      <div style={{flex: 1}} />
      {current < steps?.length - 1 && (<Button className='step_next' text={t('page.next')} onClick={next} />)}
      {current === steps?.length - 1 && (<Button className='step_next' text={t('page.done')} onClick={onDone} />)}
    </div>
  );
}