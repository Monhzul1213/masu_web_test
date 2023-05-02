import React, { useEffect, useState } from 'react';
import { message, Modal, Steps } from 'antd';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import QRCode from 'react-qr-code';

import '../../../../css/config.css'
import { banks, formatNumber, subscriptions } from '../../../../helpers';
import { getList, sendRequest } from '../../../../services';
import { qr_holder } from '../../../../assets';
import { DynamicMDIcon, Error1, Overlay } from '../../../all';
import { Field, Select } from './Field';
import { Step } from './Step';

export function Subscription(props){
  const { visible, emp, onBack, onDone, onPay, invNo } = props;
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState(null);
  const [amt, setAmt] = useState(0);
  const [txnNo, setTxnNo] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { user, token } = useSelector(state => state.login);
  const dispatch = useDispatch();

  useEffect(() => {
    setSelected(subscriptions && subscriptions[0]);
    setAmt(subscriptions && subscriptions[0] && subscriptions[0]?.amt);
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setError(null);
    if(visible && invNo){
      setCurrent(1);
      setTxnNo(invNo);
      setAmt(emp?.amount)
    } else {
      setTxnNo('');
      setCurrent(0);
    }
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible]);

  const onSelect = item => {
    setSelected(item);
    setAmt(item?.amt);
  }

  const onNext = async () => {
    setError(null);
    setLoading(true);
    let data = {
      invoiceNo: '',
      invoiceType: 'Employee',
      invoiceTime: selected?.value ? 'YEAR' : 'MONTH',
      amount: selected?.amt,
      rowStatus: 'I',
      empCode: emp?.empCode
    }
    let response = await dispatch(sendRequest (user, token, 'Txn/ModInvoice', data));
    if(response?.error) setError(response?.error);
    else {
      setCurrent(1);
      setTxnNo(response?.data?.invoiceNo);
    }
   
    setLoading(false);
  }

  const typeProps = { selected, onSelect };
  const payProps = { amt, txnNo, setError, onPay, onBack };
  const steps = [
    { title: 'Subscription', content: <Type {...typeProps} /> },
    { title: 'Payment', content: <Pay {...payProps} /> }
  ];
  const stepProps = { current, steps, onBack, onDone, onNext };

  return (
    <Modal title={null} footer={null} closable={false} open={visible} centered={true} width={640}>
      <Overlay loading={loading} className='m_back2'>
        <Steps current={current} items={steps} />
        <div>{steps[current]?.content}</div>
        <div className='gap' />
        {error && <Error1 error={error} />}
        <Step {...stepProps} />
      </Overlay>
    </Modal>
  );
}

function Type(props){
  const { selected, onSelect } = props;
  const { t } = useTranslation();

  const renderItem = (item, index) => {
    const active = selected?.value === item?.value;
    const id = active ? 'es_type_btn_active' : 'es_type_btn_inactive';

    return (
      <button className='es_type_btn' id={id} key={index} onClick={() => onSelect(item)}>
        <div className='es_type_side'>
          <p className='es_type_title'>
            {formatNumber(item?.amt)}
            <span className='es_type_sub'>₮/{item?.length}</span>
          </p>
          <p className='es_type_descr'>{item?.text}</p>
        </div>
        <DynamicMDIcon className='es_type_icon'
          name={active ? 'MdOutlineRadioButtonChecked' : 'MdOutlineRadioButtonUnchecked'} />
      </button>
    );
  }

  return (
    <div className='es_scroll'>
      <p className='es_title'>{t('employee.add')}</p>
      <p className='es_text'>{t('employee.sub_text')}</p>
      <div className='es_types'>
        {subscriptions?.map(renderItem)}
      </div>
    </div>
  );
}

function Pay(props){
  const { amt, txnNo, setError, onPay, onBack } = props;
  const { t } = useTranslation();
  const [value, setValue] = useState(0);
  const [selected, setSelected] = useState(banks[0]);
  const [loading, setLoading] = useState(false);
  const [qr, setQR] = useState('');
  const { user, token } = useSelector(state => state.login);
  const dispatch = useDispatch();
  
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
    if(!response?.error){
      let invoice = response?.data && response?.data[0]?.status;
      if(invoice === 3){
        message.success(t('employee.success_pay'));
        if(onPay) onPay()
        else onBack();
      }
    }
  };

  const getQR = async () => {
    setError(null);
    setLoading(true);
    setQR(null);
    let data = { invoiceNo: txnNo, amount: amt };
    let response = await dispatch(sendRequest (user, token, 'System/GetQPayQr', data));
    if(response?.error) setError(response?.error);
    else setQR(response?.data?.qr_text)
    setLoading(false);
  }

  const changeValue = index => {
    setValue(index);
    setSelected(banks[index]);
  }

  const bankProps = { value, setValue: changeValue, data: banks, label: t('employee.bank') };
  
  return (
    <div className='es_scroll'>
      <p className='es_title'>{t('employee.pay')}</p>
      <div className='es_pay_back'>
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
          <Field label={t('employee.txn_descr')} value={txnNo} />
        </div>
      </div>
    </div>
  );
}