import React, { useEffect, useState } from 'react';
import { Modal, Steps } from 'antd';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import QRCode from 'react-qr-code';

import '../../../../css/config.css'
import { banks, formatNumber, subscriptions } from '../../../../helpers';
import { getList, getServiceBarimt, sendRequest } from '../../../../services';
import { qr_holder } from '../../../../assets';
import { Button, DynamicAIIcon, DynamicBSIcon, DynamicMDIcon, Error1, IconButton, Input, Overlay } from '../../../all';
import { Step } from './Step';
import { Tax } from '../../../system/invoice/list/Tax';
import { config, encrypt } from '../../../../helpers';
import { Field, Select } from '../../../management/adjust/list/Field';

export function Subscription(props){
  const { visible, emp, onBack, onDone, onPay, invNo} = props;
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

  const onNext = () => {
    setCurrent(1);
  }
  
  const saveInvoice = async (info) => {
    setLoading(true);
    setError(null);
    const response = await dispatch(sendRequest(user, token, 'Txn/ModInvoice', info));
    setLoading(false);
    return response;
  };

  const onPressExport = () => {
    let msg = txnNo
    let code = encrypt(msg);
    let url = config?.domain + '/statement?invoiceno=' + encodeURIComponent(code);
    window.open(url);
  }

  const typeProps = { selected, onSelect, setError, setCurrent };
  const receiptProps = { dataSelect: selected, setCurrent, setError, setTxnNo, saveInvoice, emp };
  const payProps = { amt, txnNo, setError, onPay, onBack, onPressExport, onDone };
  const steps = [
    { title: 'Subscription', content: <Type {...typeProps} /> },
    { title: 'Receipt', content: <Receipt {...receiptProps} /> },
    { title: 'Payment', content: <Pay {...payProps} /> }
  ];
  const stepProps = { current, steps, onNext};

  return (
    <Modal title={null} footer={null} closable={false} open={visible} centered={true} width={current === 1 || current === 2 ? 500 : 640}>
      <Overlay loading={loading} className={current === 2 ? 'pay_back': 'm_back2'}>
        <DynamicAIIcon className='dr_close' name='AiFillCloseCircle' onClick={onBack} />
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
};

function Receipt(props){
  const { setCurrent, setError, dataSelect, setTxnNo, saveInvoice, emp } = props
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState(0);
  const [regNo, setRegNo] = useState({ value: '' });
  const [name, setName] = useState({ value: '' });
  const dispatch = useDispatch();


  const onNext = async () => {
    if(selected === 1){
      if(!regNo?.value){
        setError(t('bill.rd_empty'));
        return;
      }
      if(!name?.value){
        setError(t('bill.name_empty'));
        return;
      }
    };
    let invoiceData = {
      invoiceNo: '',
      invoiceType: 'Employee',
      invoiceTime: dataSelect?.value ? 'YEAR' : 'MONTH',
      amount: dataSelect?.amt,
      empCode: emp?.empCode,
      vatType: selected,
      vatCustomerId: regNo?.value,
      rowStatus: 'I',
    };
    const response = await saveInvoice(invoiceData);
    if(response?.error) setError(response?.error);
    else {
      setTxnNo(response?.data?.invoiceNo);
      setCurrent(2);
    }
  };

  const onChangeRegNo = value => {
    setRegNo(value);
    setName({value: ''})
  };

  const handleEnter = async e => {
    e?.preventDefault();
    if(regNo?.value){
      setLoading(true);
      setError(null);
      const response = await dispatch(getServiceBarimt('?regno=' + regNo?.value));
      if(response?.error) setError(response?.error);
      else if(response?.data?.found){
        setName({ value: response?.data?.name });
      } else {
        setError(t('tax.error'));
        setName({ value: '' });
      }
      setLoading(false);
    } else setRegNo({ value: '', error: t('error.not_empty') });
  };

  const onClick = () => {
    setSelected(0);
    setName({value: ''});
    setRegNo({value: ''});
  }

  const onClick1 = () => {
    setSelected(1);
  }

  const noProps = { value: regNo, setValue: onChangeRegNo, placeholder: t('system.RD'), classBack : 're_select_back', handleEnter};
  const nameProps = { value: name, setValue: setName, placeholder: t('bill.company_name'), classBack : 're_select_back', disabled: true};
  const btnProps = { className: `re_check_btn ${name?.value ? 'active' : ''}`, onClick: handleEnter, icon: <DynamicBSIcon name='BsCheckLg' className='re_back_icon' />, loading };

  return (
    <div className='pay_scroll'>
      <p className='es_title1'>{t('tax.receipt_send')}</p>
      <div className='receipt_switch_container'>
        <div className={`receipt_option ${selected === 0 ? 'active' : ''}`}  onClick={onClick}>
          {t('bill.individual')}
        </div>
        <div className={`receipt_option ${selected === 1 ? 'active' : ''}`}  onClick={onClick1}>
          {t('report_receipt.customerID')}
        </div>
      </div>
      {selected === 1 ? 
        <div style={{display: 'flex', marginTop: 15, flexFlow: 'row', alignItems: 'center'}}>
          <div style={{display: 'flex', margin: 0, flexFlow: 'column', flex: 1}}>
              <Input {...noProps} />
              <Input {...nameProps} />
          </div>
          <div className='gap'/>
          <IconButton {...btnProps} />
        </div> : ''
      }
      <div style={{display: 'flex', justifyContent: 'center', marginTop: 20}}>
        <Button className='re_step_next' text={t('page.next')} onClick={onNext}/>
      </div>
    </div>
  );
};

function Pay(props){
  const { amt, txnNo, setError, onPay, onBack, onPressExport, onDone } = props;
  const { t } = useTranslation();
  const [value, setValue] = useState(0);
  const [selected, setSelected] = useState(banks[0]);
  const [loading, setLoading] = useState(false);
  const [qr, setQR] = useState('');
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
    if(!response?.error){
      let invoice = response?.data && response?.data[0]?.status;
      if(invoice === 3){
        if (setVisible1) {
          setVisible1(true)
        }
        else if(onPay) onPay()
        else { onBack() };
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
  
  const onBack1 = () => {
    onBack()
    setVisible1(false);
  }

  const bankProps = { value, setValue: changeValue, data: banks, label: t('employee.bank') };
  const sub1Props = { visible: visible1, setVisible: setVisible1, onBack: onBack1, print: true, invNo: txnNo };

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
  </div>
    // <div className='es_scroll'>
    //   {visible1 && <Tax {...sub1Props} />}
    //   <p className='es_title'>{t('employee.pay')}</p>
    //   <div className='es_pay_back'>
    //     <div className='es_pay_col'>
    //       <p className='es_sub_title'>{t('employee.qr')}</p>
    //       <Overlay loading={loading}>
    //         {!qr
    //           ? <img className='es_qr_holder' src={qr_holder} alt='Logo' />
    //           : <QRCode
    //               size={180}
    //               style={{ margin: '5px 0' }}
    //               value={qr} />
    //         }
    //       </Overlay>
    //       <p className='es_amt_title'>{t('employee.amt')}</p>
    //       <p className='es_amt'>{formatNumber(amt)}₮</p>
    //     </div>
    //     <div className='es_gap' />
    //     <div className='es_pay_col2'>
    //       <p className='es_sub_title'>{t('employee.acct')}</p>
    //       <Select {...bankProps} />
    //       <Field label={t('employee.acct_no')} value={selected?.acct} />
    //       <Field label={t('employee.receive')} value={selected?.name} />
    //       <Field label={t('employee.amt')} value={formatNumber(amt) + '₮'} copy={amt} />
    //       <Field label={t('employee.txn_descr')} value={txnNo} isBold={true} />
    //       <p className='card_warning'>{t('invoices.warning') }</p>
    //     </div>
    //   </div>
    // </div>
  );
}