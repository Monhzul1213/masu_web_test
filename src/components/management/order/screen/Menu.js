import React, { useState, useEffect } from 'react';
import { MdChevronLeft } from 'react-icons/md';
import { useTranslation } from 'react-i18next';
import { useNavigate, createSearchParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';

import { sendRequest } from '../../../../services';
import { config, encrypt } from '../../../../helpers';
import { IconButton, Button, ButtonConfirm, Dropdown } from '../../../all';
import { PDF1 } from './PDF1';

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
    if(order?.status === 1) data.push({ label: t('order.cancel'), onClick: onPressCancel, confirmText: t('order.cancel_confirm') });
    if(order?.status === 0) data.push({ label: t('order.delete'), onClick: onPressDelete, confirmText: t('order.delete_confirm') });
    if(size?.width < 510){
      data.unshift({ label: t('order.send'), onClick: onPressSend });
      if(order?.status === 1 || order?.status === 1) data.unshift({ label: t('order.edit'), onClick: onPressEdit });
      if(order?.status === 1) data.unshift({ label: t('order.receive'), onClick: onPressReceive });
      if(order?.status === 0) data.unshift({ label: t('order.approve'), onClick: onPressApprove, confirmText: t('order.approve_confirm') });
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

  const onPressExport = () => {
    let msg = order?.merchantId + '-' + order?.orderNo + '-' + order?.vendId;
    let code = encrypt(msg);
    let url = config?.domain + '/Order?orderno=' + encodeURIComponent(code);
    window.open(url);
    // html2canvas(document.getElementById('order_pdf')).then(function(canvas) {
    //   const imgWidth = 208, pageHeight = 295;
    //   const imgHeight = (canvas.height * imgWidth) / canvas.width;
    //   let heightLeft = imgHeight, position = 0;
    //   heightLeft -= pageHeight;
    //   const pdf = new jsPDF('p', 'mm');
    //   pdf.addImage(canvas, 'PNG', 0, position, imgWidth, imgHeight, '', 'FAST');
    //   while (heightLeft >= 0) {
    //     position = heightLeft - imgHeight;
    //     pdf.addPage();
    //     pdf.addImage(canvas, 'PNG', 0, position, imgWidth, imgHeight, '', 'FAST');
    //     heightLeft -= pageHeight;
    //   }
    //   pdf.save('order_' + order?.orderNo + '.pdf');
    // });
  }

  const onPressReceive = () => {
    navigate({ pathname: '/management/order_list/order_receipt', search: createSearchParams({ orderNo: order?.orderNo }).toString() });
  }
  const onPressPrint = () => {};//DISABLED FOR NOW
  
  const onPressSend = async () => {
    let msg = order?.merchantId + '-' + order?.orderNo + '-' + order?.vendId;
    let code = encrypt(msg);
    let url = config?.domain + '/Order?orderno=' + encodeURIComponent(code);
    const data = {
      orderNo: order?.orderNo,
      custRegNo: order?.custRegNo ?? '',
      reqDate: order?.reqDate,
      url
    }
    onLoad();
    const response = await dispatch(sendRequest(user, token, 'Txn/SendOrderOTC', data));
    if(response?.error){
      onDone(true, response?.error);
      return false;
    } else {
      onDone(false, t('order.send_success'));
      return true;
    }
  };
  
  const id = size?.width >= 510 ? 'ps_large' : 'ps_small';

  const backProps = { className: 'ps_back_btn', text: t('order.back'), icon: <MdChevronLeft className='ps_back_icon' />, onClick };
  const approveProps = { className: 'ps_btn', text: t('order.approve'), onClick: onPressApprove, confirmText: t('order.approve_confirm') };
  const receiveProps = { className: 'ps_btn', text: t('order.receive'), onClick: onPressReceive };
  const editProps = { className: 'ps_btn', text: t('order.edit'), onClick: onPressEdit };
  const sendProps = { className: 'ps_btn', text: t('order.send'), onClick: onPressSend };
  const menuProps = { className: 'ps_dropdown', label: t('order.more'), data };

  return (
    <div className='ps_menu_back' id={id}>
      <IconButton {...backProps} />
      {!order ? null :
      <div className='ps_menu'>
        {order?.status === 0 && <ButtonConfirm {...approveProps} />}
        {order?.status === 1 && <Button {...receiveProps} />}
        {(order?.status === 0 || order?.status === 1) && <Button {...editProps} />}
        <Button {...sendProps} />
        <Dropdown {...menuProps} />
      </div>}
      <PDF1 order={order} items={items} adds={adds} />
    </div>
  )
}