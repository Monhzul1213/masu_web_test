import React from 'react';
import { useTranslation } from 'react-i18next';

import { DynamicAIIcon, IconButton, Button, Dropdown } from '../../../all';

export function Menu(props){
  const { order } = props;
  const { t } = useTranslation();

  const onClick = () => console.log('onClick back');
  const onPressApprove = () => {};
  const onPressReceive = () => {};
  const onPressSend = () => {};

  const backProps = { className: 'ps_back_btn', text: t('order.back'), icon: <DynamicAIIcon name='AiOutlineLeft' className='ps_back_icon' />, onClick };
  const approveProps = { className: 'ps_btn', text: t('order.approve'), onClick: onPressApprove };
  const receiveProps = { className: 'ps_btn', text: t('order.approve'), onClick: onPressReceive };
  const sendProps = { className: 'ps_btn', text: t('order.send'), onClick: onPressSend };
  const menu1Props = { className: 'ps_dropdown', label: t('order.more'), data: t('order.menu1') };

  return (
    <div className='ps_menu_back'>
      <IconButton {...backProps} />
      <div style={{flex: 1}} />
      <Button {...approveProps} />
      <Button {...receiveProps} />
      <Button {...sendProps} />
      <Dropdown {...menu1Props} />
    </div>
  )
}