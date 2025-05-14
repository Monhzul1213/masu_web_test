import React from 'react';
import { useTranslation } from 'react-i18next';
import '../../css/control.css';

export function Header(props){
    const {tab, setTab, unreadCount} = props;
    const { t } = useTranslation();

    // console.log(unreadCount);
    const Card = props => {
        const { label } = props;

        return (
            <div className={`co_card ${label === tab ? 'active' : ''}`} onClick={() => setTab(label)}>
                <p className={`co_card_label ${label === tab ? 'active' : ''}`}>{t('control.' + label)}</p>
                {label === 'notification' && unreadCount > 0 && (
                    <span className="notification-badge">{unreadCount}</span>
                )}
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