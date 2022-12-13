import React, { useState, useEffect } from 'react';
import { MdChevronLeft } from 'react-icons/md';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { IconButton, Button, Dropdown } from '../../../all';

export function Menu(props){
  const { order, size } = props;
  const { t } = useTranslation();
  const [data, setData] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    let data = [
      { label: t('order.pdf'), onClick: onPressExport },
      { label: t('order.copy'), onClick: onPressCopy },
      { label: t('order.print'), onClick: onPressPrint },
      { label: t('order.cancel'), onClick: onPressCancel },
    ];
    if(size?.width < 510){
      data.unshift({ label: t('order.send'), onClick: onPressSend });
      if(order?.status === 1 || order?.status === 1) data.unshift({ label: t('order.edit'), onClick: onPressEdit });
      if(order?.status === 1) data.unshift({ label: t('order.receive'), onClick: onPressReceive });
      if(order?.status === 0) data.unshift({ label: t('order.approve'), onClick: onPressApprove });
    }
    setData(data);
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [size?.width, order?.status]);

  const onClick = () => navigate(-1);
  const onPressApprove = () => console.log(order);
  const onPressReceive = () => {};
  const onPressEdit = () => {};
  const onPressSend = () => {};
  const onPressExport = () => console.log('onPressExport');
  const onPressCopy = () => console.log('onPressCopy');
  const onPressPrint = () => console.log('onPressPrint');
  const onPressCancel = () => console.log('onPressCancel');

  const id = size?.width >= 510 ? 'ps_large' : 'ps_small';

  const backProps = { className: 'ps_back_btn', text: t('order.back'), icon: <MdChevronLeft className='ps_back_icon' />, onClick };
  const approveProps = { className: 'ps_btn', text: t('order.approve'), onClick: onPressApprove };
  const receiveProps = { className: 'ps_btn', text: t('order.receive'), onClick: onPressReceive };
  const editProps = { className: 'ps_btn', text: t('order.edit'), onClick: onPressEdit };
  const sendProps = { className: 'ps_btn', text: t('order.send'), onClick: onPressSend };
  const menu1Props = { className: 'ps_dropdown', label: t('order.more'), data };

  return (
    <div className='ps_menu_back' id={id}>
      <IconButton {...backProps} />
      {!order ? null :
      <div className='ps_menu'>
        {order?.status === 0 && <Button {...approveProps} />}
        {order?.status === 1 && <Button {...receiveProps} />}
        {(order?.status === 0 || order?.status === 1) && <Button {...editProps} />}
        <Button {...sendProps} />
        <Dropdown {...menu1Props} />
      </div>}
    </div>
  )
}