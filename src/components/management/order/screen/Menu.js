import React from 'react';
import { MdChevronLeft } from 'react-icons/md';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { IconButton, Button, Dropdown } from '../../../all';

export function Menu(props){
  const { order } = props;
  const { t } = useTranslation();
  const navigate = useNavigate();

  const onClick = () => navigate(-1);
  const onPressApprove = () => console.log(order);
  const onPressReceive = () => {};
  const onPressEdit = () => {};
  const onPressSend = () => {};

  const backProps = { className: 'ps_back_btn', text: t('order.back'), icon: <MdChevronLeft className='ps_back_icon' />, onClick };
  const approveProps = { className: 'ps_btn', text: t('order.approve'), onClick: onPressApprove };
  const receiveProps = { className: 'ps_btn', text: t('order.receive'), onClick: onPressReceive };
  const editProps = { className: 'ps_btn', text: t('order.edit'), onClick: onPressEdit };
  const sendProps = { className: 'ps_btn', text: t('order.send'), onClick: onPressSend };
  const menu1Props = { className: 'ps_btn', label: t('order.more'), data: t('order.menu1') };

  return (
    <div className='ps_menu_back'>
      <IconButton {...backProps} />
      <div style={{flex: 1}} />
      <Button {...approveProps} />
      <Button {...receiveProps} />
      <Button {...editProps} />
      <Button {...sendProps} />
      <Dropdown {...menu1Props} />
    </div>
  )
}