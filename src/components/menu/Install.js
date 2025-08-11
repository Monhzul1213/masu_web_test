import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';

import { image23, image24, image25 } from '../../assets';
import { getList } from '../../services';
import { Button } from '../all';
import { useNavigate } from 'react-router-dom';


export function MenuPayment(props){
  const { collapsed } = props;
  const [subscriptionType, setSubscriptionType] = useState(false);
  const { user, token } = useSelector(state => state.login);
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const navigate = useNavigate();

  useEffect(() => {
    getConfig();
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getConfig = async () => {
    const response = await dispatch(getList(user, token, 'Merchant/GetConfig'));
    setSubscriptionType(response?.data?.subscriptionType)
  };

  const onClick = () => navigate({pathname: 'config/type'});

  const btnProps = { text: t('control.extend'), className: 'menu_sub_btn', onClick, id: subscriptionType === 'FREE' ? '' : 'menu_sub_btn1'};

  return (
    <div className='menu_sub_back'>
      <div className='menu_sub_row'>
          <img src={subscriptionType === 'PREMIUM' ? image23 : subscriptionType === 'STANDARD' ? image24 : image25} alt={subscriptionType}/>
          {!collapsed && <p className='menu_sub_text'>{subscriptionType === 'PREMIUM' ? 'Premium' : subscriptionType === 'STANDARD' ? 'Standard' : ''}</p>}
      </div>
      {!collapsed && <p className='menu_sub_text1' style={subscriptionType === 'FREE' ? {} : {margin: '20px 0'}}>
        {subscriptionType === 'FREE' ? t('control.extend1') : (t('control.time') + 5 + t('control.end'))}
      </p>}
      {!collapsed && <Button {...btnProps}/>}
    </div>
  )
}