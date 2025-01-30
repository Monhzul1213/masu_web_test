import React, { useState, useEffect } from 'react';
import { message } from 'antd';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';
import moment from 'moment';

import { sendRequest, getList } from '../../services';
import { Overlay, ButtonRow, Error1, Prompt } from '../../components/all';
import { Item } from '../../components/config/add';
import { Subscription } from '../../components/management/adjust/list';

export function Additional(){
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [edited, setEdited] = useState(false);
  const [visible, setVisible] = useState(false);
  const [error, setError] = useState(null);
  const [checked, setChecked] = useState({});
  const [config, setConfig] = useState(null);
  const { user, token } = useSelector(state => state.login);
  const dispatch = useDispatch();
  // const disabled = true;

  const items = [
    { title: t('add_menu.order1'), sub_title: t('add_menu.order2'), checked: checked['order'], label: 'order' },
    { title: t('add_menu.cashier1'), sub_title: t('add_menu.cashier2'), checked: checked['cashier'], label: 'cashier' },
    // { title: t('add_menu.time1'), sub_title: t('add_menu.time2'), checked: checked['time'], label: 'time', disabled },
    { title: t('add_menu.kitchen1'), sub_title: t('add_menu.kitchen2'), checked: checked['kitchen'], label: 'kitchen' },
    // { title: t('add_menu.user1'), sub_title: t('add_menu.user2'), checked: checked['user'], label: 'user', disabled },
    { title: t('add_menu.meal1'), sub_title: t('add_menu.meal2'), checked: checked['meal'], label: 'meal' },
    // { title: t('add_menu.balance1'), sub_title: t('add_menu.balance2'), checked: checked['balance'], label: 'balance', disabled },
    // { title: t('add_menu.info1'), sub_title: t('add_menu.info2'), checked: checked['info'], label: 'info', disabled },
    { title: t('add_menu.barcode1'), sub_title: t('add_menu.barcode2'), checked: checked['barcode'], label: 'barcode' },
    { title: t('add_menu.auto1'), sub_title: t('add_menu.auto2'), checked: checked['auto'], label: 'auto' },
  ];

  useEffect(() => {
    getData();
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getData = async () => {
    setError(null);
    setLoading(true);
    const response = await dispatch(getList(user, token, 'Merchant/GetConfig'));
    console.log(response);
    if(response?.error) setError(response?.error);
    else if(response?.data){
      setConfig(response?.data);
      let checked = {
        cashier: response?.data?.useShifts === 'Y',
        barcode: response?.data?.useBarCodeWeight === 'Y',
        user: response?.data?.useCustomerDisplay === 'Y',
        meal: response?.data?.useDiningOption === 'Y',
        kitchen: response?.data?.useKitchenPrinter === 'Y',
        balance: response?.data?.useLowStockNotification === 'Y',
        info: response?.data?.useNegativeStockAlert === 'Y',
        order: response?.data?.useOpenTicket === 'Y',
        time: response?.data?.useTimeClock === 'Y',
        auto: response?.data?.useAutoAssembly === 'Y',
        
      }
      setChecked(checked);
    }
    setLoading(false);
  }

  const onCheck = (label, value) => {
    setChecked({...checked, ...{[label]: value}});
    setError(null);
    setEdited(true);
  }

  const onClickCancel = () => {
    setEdited(false);
    getData();
  }

  const onClickSave = async () => {
    setError(null);
    setLoading(true);
    let data = {
      merchantId: user?.merchantId, useNuatus: '',
      vatPayerNo: config?.vatPayerNo ?? '',
      useShifts: checked?.cashier ? 'Y' : 'N',
      useTimeClock: checked?.time ? 'Y' : 'N',
      useOpenTicket: checked?.order ? 'Y' : 'N',
      useKitchenPrinter: checked?.kitchen ? 'Y' : 'N',
      useCustomerDisplay: checked?.user ? 'Y' : 'N',
      useDiningOption: checked?.meal ? 'Y' : 'N',
      useLowStockNotification: checked?.balance ? 'Y' : 'N',
      useNegativeStockAlert: checked?.info ? 'Y' : 'N',
      useBarCodeWeight: checked?.barcode ? 'Y' : 'N',
      useAutoAssembly: checked?.auto ? 'Y' : 'N',
      createdDate: config?.createdDate ?? moment().format('yyyy.MM.DD'),
      lastUpdate: moment().format('yyyy.MM.DD'),
    }
    const response = await dispatch(sendRequest(user, token, 'Merchant/Setconfig', data));
    setLoading(false);
    if(response?.code === 1000){
      // comment
      // isNew or isExpired
      // || response?.code === 1001
      setVisible(true);
    }
    if(response?.error) setError(response?.error);
    else {
      setEdited(false);
      message.success(t('add_menu.success_msg'));
      getData();
    }
  }

  const renderItem = (item, index) => {
    const itemProps = { key: index, item, more: t('page.more'), onCheck };
    return (<Item {...itemProps} />);
  }

  const onDone = () => {
    setVisible(false);
  };

  const btnProps = { onClickCancel, onClickSave };
  const subProps = { visible, setVisible, onDone };

  return (
    <div>
      {visible && <Subscription {...subProps}/> }
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