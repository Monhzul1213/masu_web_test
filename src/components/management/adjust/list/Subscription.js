import React, { useEffect, useState } from 'react';
import { Modal, Steps } from 'antd';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import QRCode from 'react-qr-code';

import '../../../../css/config.css'
import { banks, config, encrypt, formatNumber, selectSubscription, subContent, subContent1 } from '../../../../helpers';
import { getList, sendRequest } from '../../../../services';
import { qr_holder } from '../../../../assets';
import { Button, DynamicAIIcon, DynamicMDIcon, Error1, Money, Overlay } from '../../../all';
import { Select, Field } from './Field';
import { Tax } from '../../../system/invoice/list/Tax';

export function Subscription(props){
  const { visible, setVisible, onDone, noBack } = props;
  const [loading, setLoading] = useState(false);
  const [current, setCurrent] = useState(0);
  const [error, setError] = useState(null);
  const [selected, setSelected] = useState(null);
  const [itemAmt, setItemAmt] = useState([]);
  const [amt, setAmt] = useState(0);
  const [txnNo, setTxnNo] = useState('');
  const [data, setData] = useState([]);
  const [length, setLength] = useState('sar');
  const navigate = useNavigate();

  useEffect(() => {
    onSelect(selectSubscription && selectSubscription[0])
    setData(selectSubscription); 
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onSelect = item => {
    setItemAmt([item?.amt, item?.amt1])
    setLength(item?.label1)
    setSelected(item);
  }

  const onPressExport = () => {
    let msg = txnNo
    let code = encrypt(msg);
    let url = config?.domain + '/statement?invoiceno=' + encodeURIComponent(code);
    window.open(url);
  }

  const typeProps = { selected, onSelect, data, amt, setAmt, itemAmt, onDone, length, setError, setLoading, setCurrent, setTxnNo };
  const payProps = { amt, txnNo, onDone, setError, setVisible, onPressExport };

  const steps = [
    { title: 'Subscription', content: <Type {...typeProps} /> },
    { title: 'Payment', content: <Pay {...payProps} /> }
  ];

  const onClose = () => {
    setVisible(false);
    if(!noBack) navigate(-1);
  }

  return (
    <Modal title={null} footer={null} closable={false} open={visible} centered={true} width={txnNo ? 500: 800}>
      <Overlay loading={loading} className={txnNo ? 'pay_back': 'm_back4'} > 
        <DynamicAIIcon className='dr_close' name='AiFillCloseCircle' onClick={onClose} />
        <Steps current={current} items={steps} />
        <div>{steps[current]?.content}</div>
        <div className='gap' />
        {error && <Error1 error={error} />}
      </Overlay>
    </Modal>
  );
}

function Type(props){
  const { selected, onSelect, data, setAmt, itemAmt, setError, setLoading, setTxnNo, onDone, setCurrent, length } = props;
  const { t } = useTranslation();
  const { user, token } = useSelector(state => state.login);
  const dispatch = useDispatch();


  const onNext = async () => {
    setError(null);
    setLoading(true);
    let data = {
      invoiceNo: '',
      invoiceType: selected?.type,
      invoiceTime: selected?.length,
      amount: selected?.amt,
      rowStatus: 'I',
    }
    let response = await dispatch(sendRequest(user, token, 'Txn/ModInvoice', data));
    if(response?.error) setError(response?.error);
    else {
      if(selected?.value === 2){
        onDone();
      } else {
        setCurrent(1);
        setTxnNo(response?.data?.invoiceNo);
        setAmt(selected?.amt);
      }
    setLoading(false);
  } 
}

const onNext1 = async () => {
  setError(null);
  setLoading(true);
  let data = {
    invoiceNo: '',
    invoiceType: selected?.type1,
    invoiceTime: selected?.length,
    amount: selected?.amt1,
    rowStatus: 'I',
  }
  let response = await dispatch(sendRequest(user, token, 'Txn/ModInvoice', data));
  if(response?.error) setError(response?.error);
  else {
    if(selected?.value === 2){
      onDone();
    } else {
      setCurrent(1);
      setTxnNo(response?.data?.invoiceNo);
      setAmt(selected?.amt1)
    }
  setLoading(false);
} 
}

  const renderContent = (item) => {

    return (
      <div className='content_back'>
        <DynamicMDIcon name='MdCheck' className='content_icon'/>
        <p className='content_text'>{item?.label}</p>
      </div>
    )
  };

  const renderItem = (item, index) => {
    const active = selected?.value === item?.value;
    const id = active ? item?.value === 1 ? 'subs_type_btn_active1' : 'subs_type_btn_active' : 'subs_type_btn_inactive';

    return (
        <div >
          <p id={id} key={index} onClick={() => onSelect(item)} className='sub_type_title'>{item?.label}</p>
        </div>      
    );
  }
  return (
    <div className='sub_type_scroll'>
      <p className='sub_type_header'>{t('invoices.invoices')}</p>
      <div className='sub_type_select_back'> 
        {data?.map(renderItem)}
      </div>
      <div className='sub_types'>
        <div className={'sub_type_back'} >
            <div className='es_type_side'>
              <p className='sub_type_title_back'>{'STANDARD'}</p>
              <p className='sub_type_price'>{<Money value={itemAmt[0]}/>}{'/' + length}</p>
              <div className='sub_content_back1'>
                {subContent1?.map(renderContent)}
              </div>
              <Button className='sub_step_next' text={t('employee.pay')} onClick={onNext}/>
            </div> 
        </div>
        <div className={'sub_type_back1'} >
            <div className='es_type_side'>
              <p className='sub_type_title_back1'>{'PREMIUM'}</p>
              <p className='sub_type_price'>{<Money value={itemAmt[1]}/>}{'/' + length}</p>
              <div className='sub_content_back1'>
                {subContent?.map(renderContent)}
              </div>
              <Button className='sub_step_next1' text={t('employee.pay')}  onClick={onNext1}/>
            </div>
        </div>
      </div>
    </div>
  );
}

function Pay(props){
  const { amt, txnNo, onDone, setError, setVisible, onPressExport } = props;
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [qr, setQR] = useState('');
  const [value, setValue] = useState(0);
  const [selected, setSelected] = useState(banks[0]);
  const { user, token } = useSelector(state => state.login);
  const dispatch = useDispatch();
  const [visible1, setVisible1] = useState(false);
  const [tab, setTab] = useState(-1);

  useEffect(() => {
    getQR();
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const intervalCall = setInterval(() => checkInvoice(), 10000);
    return () => clearInterval(intervalCall);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const checkInvoice = async () => {
    let api = 'Txn/GetInvoice?InvoiceNo=' + txnNo;
    let response = await dispatch(getList(user, token, api));
    if(response?.error) setError(response?.error);
    if(!response?.error){
      let invoice = response?.data && response?.data[0]?.status;
      if(invoice === 3){
        if (setVisible1) setVisible1(true)
        else if(onDone) onDone()
        else setVisible(false);
      }
    }
  };

  const getQR = async () => {
    setError(null);
    setLoading(true);
    setQR(null);
    let data = { invoiceNo: txnNo, amount: amt };
    let response = await dispatch(sendRequest(user, token, 'System/GetQPayQr', data));
    if(response?.error) setError(response?.error);
    else setQR(response?.data?.qr_text)
    setLoading(false);
  }

  const changeValue = index => {
    setValue(index);
    setSelected(banks[index]);
  }

  const onBack1 = () => {
    setVisible(false)
    setVisible1(false);
  }

  const bankProps = { value, setValue: changeValue, data: banks, label: t('employee.bank') };
  const sub1Props = { visible : visible1, setVisible: setVisible1, onBack: onBack1, print: true, invNo: txnNo };

  const Tab = props => {
    const { label, index } = props;
    const id = index === tab ? 'tab_btn_active' : 'tab_btn_inactive';

    return (
      <div className='pay_card_btn' id={id} onClick={() => setTab(index)}>
          {t('manage.' + label)}
      </div>
    );
  }
  return (
    <div className='pay_scroll'>
      {visible1 && <Tax {...sub1Props} />}
      <p className='es_title'>{t('employee.pay')}</p>
      <div className='pay_tab_back'>
        <Tab label='qpay' index = {-1}/>
        <Tab label='acct' index ={ 1}/>
      </div>
      {tab === -1 ? 
            <div className='pay_back_col'>
              <Overlay loading={loading}>
                {!qr
                  ? <img className='es_qr_holder' src={qr_holder} alt='Logo' />
                  : <QRCode
                      className='pay_qr_back'
                      size={220}
                      style={{ margin: '5px 0'}}
                      value={qr} />
                }
              </Overlay>
              <p className='pay_amt_title'>{t('employee.amt')}</p>
              <p className='pay_amt'>{formatNumber(amt)}₮</p>
              <div className='pay_button_back'>
                <Button className='pay_step_invoice' text={t('system.invoice')} onClick={onPressExport} />
              </div>
            </div>
             : 
             <div className='pay_back_col2'>
                <p className='pay_amt_title'>{t('employee.amt')}</p>
                <p className='pay_amt'>{formatNumber(amt)}₮</p>
             <Select {...bankProps} />
             <Field label={t('employee.acct_no')} value={selected?.acct} />
             <Field label={t('employee.receive')} value={selected?.name} />
             {/* <Field label={t('employee.amt')} value={formatNumber(amt) + '₮'} copy={amt} /> */}
             <Field label={t('employee.txn_descr')} value={txnNo} isBold={true} />
             <div className='line'/>
             <p className='card_warning1'>{t('invoices.warning')}</p>
             <div className='pay_button_back1'>
              <Button className='pay_step_invoice' text={t('system.invoice')} onClick={onPressExport} />
              <Button className='pay_step_next' text={t('employee.paid')} onClick={onDone} />
             </div>
           </div>}
      {/* <div className='es_pay_back'>
        <div className='es_pay_col'>
          <p className='es_sub_title'>{t('employee.qr')}</p>
          <Overlay loading={loading}>
            {!qr
              ? <img className='es_qr_holder' src={qr_holder} alt='Logo' />
              : <QRCode
                  size={180}
                  style={{ margin: '5px 0' }}
                  value={qr} />
            }
          </Overlay>
          <p className='es_amt_title'>{t('employee.amt')}</p>
          <p className='es_amt'>{formatNumber(amt)}₮</p>
        </div>
        <div className='es_gap' />
        <div className='es_pay_col2'>
          <p className='es_sub_title'>{t('employee.acct')}</p>
          <Select {...bankProps} />
          <Field label={t('employee.acct_no')} value={selected?.acct} />
          <Field label={t('employee.receive')} value={selected?.name} />
          <Field label={t('employee.amt')} value={formatNumber(amt) + '₮'} copy={amt} />
          <Field label={t('employee.txn_descr')} value={txnNo} isBold={true} />
          <p className='card_warning'>{t('invoices.warning')}</p>
        </div>
      </div> */}
    </div>
  );
}