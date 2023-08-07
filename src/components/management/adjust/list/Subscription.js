import React, { useEffect, useState } from 'react';
import { message, Modal, Steps } from 'antd';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import QRCode from 'react-qr-code';

import '../../../../css/config.css'
import { banks, divide, formatNumber, siteSubscriptions, siteSubscriptions1 } from '../../../../helpers';
import { getList, sendRequest } from '../../../../services';
import { qr_holder } from '../../../../assets';
import { Check, DynamicAIIcon, DynamicMDIcon, Error1, Overlay } from '../../../all';
import { Step } from '../../../emp/employee/add/Step';
import { Select, Field } from '../../../emp/employee/add/Field';

export function Subscription(props){
  const { visible, setVisible, sites, setSites, onDone, noTrial, noBack } = props;
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [current, setCurrent] = useState(0);
  const [error, setError] = useState(null);
  const [selected, setSelected] = useState(null);
  const [amt, setAmt] = useState(0);
  const [txnNo, setTxnNo] = useState('');
  const [data, setData] = useState([]);
  const { user, token } = useSelector(state => state.login);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    setSelected(siteSubscriptions && siteSubscriptions[0]);
    setData(noTrial ? siteSubscriptions1 : siteSubscriptions);
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onSelect = item => {
    if(item?.value !== selected?.value){
      let newSites = sites?.map(i => {
        let checked = item?.value === 2 ? true : selected?.value === 2 ? false : i.checked;
        return {...i, checked};
      });
      setSites(newSites);
      let amt = divide(newSites?.filter(i => i.checked)?.length, item?.amt, true);
      setAmt(amt);
      setSelected(item);
    }
    setError(null);
  }

  const typeProps = { selected, onSelect, amt, sites, setSites, setAmt, setError, data };
  const payProps = { amt, txnNo, onDone, setError };

  const steps = [
    { title: 'Subscription', content: <Type {...typeProps} /> },
    { title: 'Payment', content: <Pay {...payProps} /> }
  ];

  const onNext = async () => {
    let checked = sites?.filter(i => i.checked)?.length;
    if(checked){
      setError(null);
      setLoading(true);
      let siteID = [];
      sites?.map(item => { if(item?.checked) siteID?.push(item?.siteId); });
      let data = { invoicetime: selected?.length, invoiceAmount: amt, siteID }
      let response = await dispatch(sendRequest(user, token, 'Txn/ModSiteInvoice', data));
      if(response?.error) setError(response?.error);
      else {
        if(selected?.value === 2){
          onDone();
        } else {
          setCurrent(1);
          setTxnNo(response?.data?.invoiceNo);
        }
      }
      setLoading(false);
    } else
      setError(t('adjust.select_site'));
  }
  const onClose = () => {
    setSites([]);
    setVisible(false);
    if(!noBack) navigate(-1);
  }

  const stepProps = { current, steps, onBack: onClose, onDone, onNext };

  return (
    <Modal title={null} footer={null} closable={false} open={visible} centered={true} width={640}>
      <Overlay loading={loading} className='m_back2'>
        <DynamicAIIcon className='dr_close' name='AiFillCloseCircle' onClick={onClose} />
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
  const { selected, onSelect, amt, sites, setSites, setAmt, setError, data } = props;
  const { t } = useTranslation();

  const renderItem = (item, index) => {
    const active = selected?.value === item?.value;
    const id = active ? 'es_type_btn_active' : 'es_type_btn_inactive';

    return (
      <button className='es_type_btn' id={id} key={index} onClick={() => onSelect(item)}>
        <div className='es_type_side'>
          <p className='es_type_title'>{item?.label}</p>
          <p className='es_type_descr'>{item?.text}</p>
        </div>
        <DynamicMDIcon className='es_type_icon'
          name={active ? 'MdOutlineRadioButtonChecked' : 'MdOutlineRadioButtonUnchecked'} />
      </button>
    );
  }

  const onCheck = index => {
    let newSites = sites?.map((item, i) => {
      let checked = i === index ? !item?.checked : item?.checked;
      return {...item, checked};
    });
    setSites(newSites);
    let amt = divide(newSites?.filter(i => i.checked)?.length, selected?.amt, true);
    setAmt(amt);
    setError(null);
  }

  const renderSite = (item, index) => {
    return (
      <button className='ss_site_btn' key={index} onClick={() => onCheck(index)}>
        <Check checked={item?.checked} onClick={() => {}} />
        <p className='ss_site_text'>{item?.name}</p>
      </button>
    );
  }

  return (
    <div className='es_scroll'>
      <p className='es_title'>{t('adjust.subscription')}</p>
      <div className='es_types'>
        {data?.map(renderItem)}
      </div>
      <p className='ss_site_title'>{t('adjust.select_site')}</p>
      <div className='ss_sites'>
        {sites?.map(renderSite)}
      </div>
      <p className='ss_amt'>{t('adjust.payment')}: {formatNumber(amt)}₮</p>
    </div>
  );
}

function Pay(props){
  const { amt, txnNo, onDone, setError } = props;
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [qr, setQR] = useState('');
  const [value, setValue] = useState(0);
  const [selected, setSelected] = useState(banks[0]);
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
        onDone();
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