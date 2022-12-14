import React, { useState, useEffect } from 'react';
import { MdChevronLeft } from 'react-icons/md';
import { useTranslation } from 'react-i18next';
import { useNavigate, createSearchParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';

import { sendRequest } from '../../../../services';
import { IconButton, Button, ButtonConfirm, Dropdown } from '../../../all';

export function Menu(props){
  const { order, items, adds, onLoad, onDone, getData, size } = props;
  const { t } = useTranslation();
  const [data, setData] = useState([]);
  const { user, token }  = useSelector(state => state.login);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    let data = [
      { label: t('order.pdf'), onClick: onPressExport },
      { label: t('order.copy'), onClick: onPressCopy },
      { label: t('order.print'), onClick: onPressPrint, disabled: true },
    ];
    if(order?.status === 1) data.push({ label: t('order.cancel'), onClick: onPressCancel });
    if(order?.status === 0) data.push({ label: t('order.delete'), onClick: onPressDelete });
    if(size?.width < 510){
      data.unshift({ label: t('order.send'), onClick: onPressSend, disabled: true });
      if(order?.status === 1 || order?.status === 1) data.unshift({ label: t('order.edit'), onClick: onPressEdit });
      if(order?.status === 1) data.unshift({ label: t('order.receive'), onClick: onPressReceive, disabled: true });
      if(order?.status === 0) data.unshift({ label: t('order.approve'), onClick: onPressApprove });
    }
    setData(data);
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [size?.width, order?.status]);

  const onClick = () => navigate('/management/order_list');

  const updateOrder = async (data, msg) => {
    onLoad();
    const response = await dispatch(sendRequest(user, token, 'Txn/Order', data));
    if(response?.error){
      onDone(true, response?.error);
      return false;
    } else {
      onDone(false, t('order.' + msg));
      return true;
    }
  }
  
  const onPressApprove = async () => {
    let data = { ...order, status: 1, rowStatus: 'U', orderItems: items, orderCosts: adds };
    const response = await updateOrder(data, 'approve_success');
    if(response) getData(order?.orderNo);
  }

  const onPressCancel = async () => {
    let data = { ...order, status: 3, rowStatus: 'U', orderItems: items, orderCosts: adds };
    const response = await updateOrder(data, 'cancel_success');
    if(response) getData(order?.orderNo);
  }

  const onPressDelete = async () => {
    let data = { ...order, rowStatus: 'D', orderItems: items, orderCosts: adds };
    const response = await updateOrder(data, 'delete_success');
    if(response) onClick();
  }

  const onPressEdit = () => {
    navigate({ pathname: '/management/order_list/order_add', search: createSearchParams({ orderNo: order?.orderNo }).toString() });
  };

  const onPressCopy = () => {
    navigate({ pathname: '/management/order_list/order_add', search: createSearchParams({ orderNo: order?.orderNo, copying: true }).toString() });
  }

  const onPressExport = () => console.log('onPressExport');
  const onPressReceive = () => {};//DISABLED FOR NOW
  const onPressSend = () => {};//DISABLED FOR NOW
  const onPressPrint = () => {};//DISABLED FOR NOW

  const id = size?.width >= 510 ? 'ps_large' : 'ps_small';

  const backProps = { className: 'ps_back_btn', text: t('order.back'), icon: <MdChevronLeft className='ps_back_icon' />, onClick };
  const approveProps = { className: 'ps_btn', text: t('order.approve'), onClick: onPressApprove, confirmText: t('order.approve_confirm') };
  const receiveProps = { className: 'ps_btn', text: t('order.receive'), onClick: onPressReceive, disabled: true };
  const editProps = { className: 'ps_btn', text: t('order.edit'), onClick: onPressEdit };
  const sendProps = { className: 'ps_btn', text: t('order.send'), onClick: onPressSend, disabled: true };
  const menu1Props = { className: 'ps_dropdown', label: t('order.more'), data };

  return (
    <div className='ps_menu_back' id={id}>
      <IconButton {...backProps} />
      {!order ? null :
      <div className='ps_menu'>
        {order?.status === 0 && <ButtonConfirm {...approveProps} />}
        {order?.status === 1 && <Button {...receiveProps} />}
        {(order?.status === 0 || order?.status === 1) && <Button {...editProps} />}
        <Button {...sendProps} />
        <Dropdown {...menu1Props} />
      </div>}
    </div>
  )
}