import React from 'react';
import { useTranslation } from 'react-i18next';

import { SwitchLabel } from './SwitchLabel';

export function CardInvt(props){
  const { isKit, setIsKit, isTrack, setIsTrack } = props;
  const { t } = useTranslation();

  const isPackProps = { value: isKit, setValue: setIsKit, label: t('inventory.is_pack') };
  const isTrackProps = { value: isTrack, setValue: setIsTrack, label: t('inventory.is_track') };
 
  return (
    <div className='ac_back'>
      <p className='ac_title'>{t('inventory.title')}</p>
      <SwitchLabel {...isPackProps} />
      {!isKit && false && <SwitchLabel {...isTrackProps} />}

    </div>
  );
}