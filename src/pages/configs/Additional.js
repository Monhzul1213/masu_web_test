import React, { useState } from 'react';
import { message } from 'antd';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';
import moment from 'moment';

import { Overlay, ButtonRow, Error1, Prompt } from '../../components/all';
import { Item } from '../../components/config/add';
import { sendRequest } from '../../services';

export function Additional(){
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [edited, setEdited] = useState(false);
  const [error, setError] = useState(null);
  const [checked, setChecked] = useState({});
  const { user, token } = useSelector(state => state.login);
  const dispatch = useDispatch();

  const items = [
    { title: t('add_menu.cashier1'), sub_title: t('add_menu.cashier2'), checked: checked['cashier'], label: 'cashier' },
    { title: t('add_menu.time1'), sub_title: t('add_menu.time2'), checked: checked['time'], label: 'time' },
    { title: t('add_menu.order1'), sub_title: t('add_menu.order2'), checked: checked['order'], label: 'order' },
    { title: t('add_menu.kitchen1'), sub_title: t('add_menu.kitchen2'), checked: checked['kitchen'], label: 'kitchen' },
    { title: t('add_menu.user1'), sub_title: t('add_menu.user2'), checked: checked['user'], label: 'user' },
    { title: t('add_menu.meal1'), sub_title: t('add_menu.meal2'), checked: checked['meal'], label: 'meal' },
    { title: t('add_menu.balance1'), sub_title: t('add_menu.balance2'), checked: checked['balance'], label: 'balance' },
    { title: t('add_menu.info1'), sub_title: t('add_menu.info2'), checked: checked['info'], label: 'info' },
    { title: t('add_menu.barcode1'), sub_title: t('add_menu.barcode2'), checked: checked['barcode'], label: 'barcode' },
  ];

  const onCheck = (label, value) => {
    setChecked({...checked, ...{[label]: value}});
    setError(null);
    setEdited(true);
  }

  const onClickCancel = () => {
    setChecked({});
    setEdited(false);
  }

  const onClickSave = async () => {
    setError(null);
    setLoading(true);
    let data = {
      merchantId: user?.merchantId, useNuatus: '', vatPayerNo: '',
      useShifts: checked?.cashier ? 'Y' : 'N',
      useTimeClock: checked?.time ? 'Y' : 'N',
      useOpenTicket: checked?.order ? 'Y' : 'N',
      useKitchenPrinter: checked?.kitchen ? 'Y' : 'N',
      useCustomerDisplay: checked?.user ? 'Y' : 'N',
      useDiningOption: checked?.meal ? 'Y' : 'N',
      useLowStockNotification: checked?.balance ? 'Y' : 'N',
      useNegativeStockAlert: checked?.info ? 'Y' : 'N',
      useBarCodeWeight: checked?.barcode ? 'Y' : 'N',
      createdDate: moment().format('yyyy.MM.DD'),
      lastUpdate: moment().format('yyyy.MM.DD'),
    }
    console.log(data);
    const response = await dispatch(sendRequest(user, token, 'Merchant/Setconfig', data));
    console.log(response);
    setLoading(false);
    if(response?.error) setError(response?.error);
    else {
      setEdited(false);
      message.success(t('add_menu.success_msg'));
    }
  }

  const renderItem = (item, index) => {
    const itemProps = { key: index, item, more: t('page.more'), onCheck };
    return (<Item {...itemProps} />);
  }

  const btnProps = { onClickCancel, onClickSave };

  return (
    <div>
      {error && <Error1 error={error} />}
      <Prompt edited={edited} />
      <Overlay className='co_tab' loading={loading}>
        <p className='c_tab_title'>{t('system_menu.additional')}</p>
        <div className='c_tab_back'>
          {items?.map(renderItem)}
        </div>
        <ButtonRow {...btnProps} />
      </Overlay>
    </div>
  )
}