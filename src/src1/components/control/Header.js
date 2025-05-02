import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import '../../css/control.css';

export function Header(props){
    const {tab, setTab} = props;
    const { t } = useTranslation();

    const Card = props => {
        const { label } = props;

        return (
            <div className={`co_card ${label === tab ? 'active' : ''}`} onClick={() => setTab(label)}>
                <p className={`co_card_label ${label === tab ? 'active' : ''}`}>{t('control.' + label)}</p>
            </div>
        )
    };

  return (
    <div className='co_card_back'>
        <Card label='review' />
        <Card label='setting' />
        <Card label='notification' />
        <Card label='lastUpdate'/>
    </div>
  );
}