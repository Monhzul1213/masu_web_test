import React, { useState, useEffect } from 'react';
import { message } from 'antd';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import moment from 'moment';
import mime from 'mime';

import { urlToFile } from '../../helpers';
import { sendRequest, getList } from '../../services';
import { Overlay, Error1, Prompt, ButtonRow } from '../../components/all';
import { FinanceMain, Item } from '../../components/config/add';
import { Subscription } from '../../components/management/adjust/list';
import { Help } from '../../components/invt/inventory/list';

export function Additional(){
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [edited, setEdited] = useState(false);
  const [visible, setVisible] = useState(false);
  const [error, setError] = useState(null);
  const [checked, setChecked] = useState({});
  const [config, setConfig] = useState(null);
  const [name, setName] = useState({ value: '' });
  const [director, setDirector] = useState({ value: '' });
  const [accountant, setAccountant] = useState({ value: '' });
  const [image, setImage] = useState(null);
  const [image64, setImage64] = useState('');
  const [imageType, setImageType] = useState('');
  const [Ftime, setFtime] = useState({ value: 'S' });
  const { user, token } = useSelector(state => state.login);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const items = [
    { title: t('add_menu.order1'), sub_title: t('add_menu.order2'), checked: checked['order'], label: 'order', 
      link: 'https://youtu.be/UZBPxipeEQQ?si=lfjCg6Cczcy3Yu1h' },
    { title: t('add_menu.cashier1'), sub_title: t('add_menu.cashier2'), checked: checked['cashier'], label: 'cashier' },
    // { title: t('add_menu.time1'), sub_title: t('add_menu.time2'), checked: checked['time'], label: 'time', disabled },
    { title: t('add_menu.kitchen1'), sub_title: t('add_menu.kitchen2'), checked: checked['kitchen'], label: 'kitchen',
      link: 'https://youtu.be/VjYQ_TzigYA?si=GhIwmYi6WaKuQ9F-' },
    // { title: t('add_menu.user1'), sub_title: t('add_menu.user2'), checked: checked['user'], label: 'user', disabled },
    { title: t('add_menu.meal1'), sub_title: t('add_menu.meal2'), checked: checked['meal'], label: 'meal' },
    // { title: t('add_menu.balance1'), sub_title: t('add_menu.balance2'), checked: checked['balance'], label: 'balance', disabled },
    // { title: t('add_menu.info1'), sub_title: t('add_menu.info2'), checked: checked['info'], label: 'info', disabled },
    { title: t('add_menu.barcode1'), sub_title: t('add_menu.barcode2'), checked: checked['barcode'], label: 'barcode',
      link: 'https://youtu.be/DclYbThnhmM?si=NTBeZWVXDCFBH7hn' },
    { title: t('add_menu.auto1'), sub_title: t('add_menu.auto2'), checked: checked['auto'], label: 'auto' },
  ];

  useEffect(() => {
    user?.msRole?.webEditSettings !== 'Y' ? navigate({ pathname: '/' }) : getData();
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getImage = async image => {
    if(image?.fileRaw?.fileData){
      let type = image?.fileRaw?.fileType?.replace('');
      setImageType(type ?? '');
      let mimeType = mime.getType(type);
      let dataPrefix = `data:` + mimeType + `;base64,`;
      let attach64 = `${dataPrefix}${image?.fileRaw?.fileData}`;
      let attachFile = await urlToFile(attach64, mimeType);
      setImage64(attach64);
      setImage(attachFile);
    }
  }

  const getData = async () => {
    setError(null);
    setLoading(true);
    const response = await dispatch(getList(user, token, 'Merchant/GetConfig'));
    if(response?.error) setError(response?.error);
    else if(response?.data){
      setConfig(response?.data);
      let request = response?.data;
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
      setName({value: request?.merchantName ? request?.merchantName :  user?.msMerchant?.descr});
      setDirector({value: request?.director});
      setAccountant({value: request?.accountant});
      setFtime({value: request?.periodType});
      getImage(request)
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
      merchantName: name?.value,
      director: director?.value,
      accountant: accountant?.value,
      periodType: Ftime?.value,
      image: { FileData: image64 ?? '', FileType: imageType ?? '' }
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

  const btnProps = { onClickCancel, onClickSave, id: 'fi_btn'};
  const subProps = { visible, setVisible, onDone };
  const videoData = [{id: "DclYbThnhmM"}, {id: "Bxwdue0lTaw"}, {id: "NVN0oaH3aLc"}];
  const mainProps = {name, setName, director, setDirector, accountant, setAccountant, image, setImage, 
                    setImage64, setImageType, setError, setEdited, Ftime, setFtime};

  return (
    <div className='store_tab'>
      {visible && <Subscription {...subProps}/> }
      {error && <Error1 error={error} />}
      <Prompt edited={edited} />
      <Overlay loading={loading}>
        <div className='card_scroll' style={{gap: 20, maxHeight: 'calc(100vh - var(--header-height) - var(--page-padding) * 9)'}}>
          <div className='co_tab'>
            <p className='c_tab_title'>{t('config.finance_info')}</p>
            <FinanceMain {...mainProps}/>
          </div>
          <div className='co_tab'>
            <p className='c_tab_title'>{t('system_menu.additional')}</p>
            <div className='c_tab_back'>
              {items?.map(renderItem)}
            </div>
          </div>
        </div>
        <ButtonRow {...btnProps} />
      </Overlay>
      <Help videoData={videoData}/>
    </div>
  )
}