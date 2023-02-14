import React, { useEffect, useState } from 'react';
import { Modal, Steps } from 'antd';
import { useTranslation } from 'react-i18next';
import QRCode from 'react-qr-code';

import '../../../../css/config.css'
import { banks, formatNumber, subscriptions } from '../../../../helpers';
import { qr_holder } from '../../../../assets';
import { DynamicAIIcon, DynamicMDIcon, Step } from '../../../all';
import { Field, Select } from './Field';

export function Subscription(props){
  const { visible, setVisible } = props;
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState(null);
  const [qr, setQR] = useState('');
  const [amt, setAmt] = useState(0);
  const [txnNo, setTxnNo] = useState('1');

  useEffect(() => {
    setSelected(subscriptions && subscriptions[0]);
    setAmt(subscriptions && subscriptions[0] && subscriptions[0]?.amt);
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const closeModal = () => setVisible(false);

  const onSelect = item => {
    setSelected(item);
    setAmt(item?.amt);
  }

  const onDone = async () => {

  }

  const typeProps = { selected, onSelect };
  const payProps = { qr, amt, txnNo };
  const steps = [
    { title: 'Subscription', content: <Type {...typeProps} /> },
    { title: 'Payment', content: <Pay {...payProps} /> }
  ];
  const stepProps = { current, steps, setCurrent, onDone };

  return (
    <Modal title={null} footer={null} closable={false} open={visible} centered={true} width={640}>
      <div className='m_back2'>
        <DynamicAIIcon className='dr_close' name='AiFillCloseCircle' onClick={closeModal} />
        <Steps current={current} items={steps} />
        <div>{steps[current]?.content}</div>
        <div className='gap' />
        <Step {...stepProps} />
      </div>
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
  const { qr, amt, txnNo } = props;
  const { t } = useTranslation();
  const [value, setValue] = useState(0);
  const [selected, setSelected] = useState(banks[0]);

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
          <img className='es_qr_holder' src={qr_holder} alt='Logo' />
          {/* <QRCode
            size={180}
            style={{ margin: '5px 0' }}
            value={qr} /> */}
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