import React, { useEffect, useState } from 'react';
import { Modal, Steps } from 'antd';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import QRCode from 'react-qr-code';

import '../../../../css/config.css'
import { banks, config, encrypt, formatNumber, selectSubscription, subContent, subContent1 } from '../../../../helpers';
import { getList, sendRequest, getServiceBarimt } from '../../../../services';
import { qr_holder } from '../../../../assets';
import { Button, DynamicAIIcon, DynamicBSIcon, DynamicMDIcon, Error1, IconButton, Input, Money, Overlay } from '../../../all';
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
  const [type, setType] = useState(0);
  const [txnNo, setTxnNo] = useState('');
  const [data, setData] = useState([]);
  const [length, setLength] = useState('sar');
  const navigate = useNavigate();
  const { user, token } = useSelector(state => state.login);
  const dispatch = useDispatch();

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

  const saveInvoice = async (info) => {
    setLoading(true);
    setError(null);
    const response = await dispatch(sendRequest(user, token, 'Txn/ModInvoice', info));
    setLoading(false);
    return response;
  };
  

  const typeProps = { selected, onSelect, data, amt, setAmt, itemAmt, setError, setLoading, setCurrent, setTxnNo, length, setType };
  const receiptProps = { dataSelect: selected, amt, setCurrent, setError, setTxnNo, onDone, saveInvoice , type};
  const payProps = { amt, txnNo, onDone, setError, setVisible, onPressExport };

  const steps = [
    { title: 'Subscription', content: <Type {...typeProps} /> },
    { title: 'Receipt', content: <Receipt {...receiptProps} /> },
    { title: 'Payment', content: <Pay {...payProps} /> }
  ];

  const onClose = () => {
    setVisible(false);
    if(!noBack) navigate(-1);
  }

  return (
    <Modal title={null} footer={null} closable={false} open={visible} centered={true} width={current === 1 || current === 2 ? 500 : 800}>
      <Overlay loading={loading} className={current === 2 ? 'pay_back': 'm_back4'} > 
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
  const { selected, onSelect, data, setAmt, itemAmt, setCurrent, length, setType } = props;
  const { t } = useTranslation();

  const onNext = () => {
    setAmt(selected?.amt);
    setType(selected?.type);
    setCurrent(1);
  };

  const onNext1 = () => {
    setAmt(selected?.amt1);
    setType(selected?.type1);
    setCurrent(1);
  };

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


function Receipt(props){
  const { setCurrent, setError, amt, saveInvoice, setTxnNo, dataSelect, type } = props
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
      invoiceType: type,
      invoiceTime: dataSelect?.length,
      amount: amt,
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
      let invoice = response?.data && response?.data?.invoice && response?.data?.invoice[0]?.status;
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
    </div>
  );
}
