import React, { useEffect, useState } from 'react';
import { Modal } from 'antd';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import QRCode from 'react-qr-code';
import moment from 'moment';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

import '../../../../css/config.css'
import '../../../../css/system.css'
import { sendVat, getVat } from '../../../../services';
import { getPrintHtml } from '../../../../helpers/getPrintHtml';
import { qr_holder, logo_image } from '../../../../assets';
import { Error1, Overlay, Money } from '../../../all';
import { Step } from './Step';
import { TaxList } from './TaxList';

export function Tax(props){
  const { visible, onBack, onDone1, print, invNo } = props;
  const { t } = useTranslation();
  const [qr, setQR] = useState('');
  const [info, setInfo] = useState(null);
  const [amt, setAmt] = useState(null);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { user, token } = useSelector(state => state.login);
  const dispatch = useDispatch();

  useEffect(() => {
    console.log(user)
    if(visible) {
      // getQR();
      getQR1();
    }
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible]);

  const Field = ({ label, value }) => {
    return (
      <div className='sys_info_row'>
        <p className='sys_info_label'>{t(label)} : </p>
        <p className='sys_info_value'>{value}</p>
      </div>
    )
  }

  const Field1 = ({ label, value }) => {
    return (
      <div className='sys_info_row'>
        <p className='sys_info_label1'>{t(label)} : </p>
        <p className='sys_info_value'>{value}</p>
      </div>
    )
  }
  const Field2 = ({ label, value }) => {
    return (
      <div className='sys_info_row'>
        <p className='sys_pdf_value'>{t(label)} : </p>
        <p className='sys_pdf_value'>{value}</p>
      </div>
    )
  }

  const getQR = async ( query) => {
    setError(null);
    setLoading(true);
    setQR(null);
    let api = 'Pos/GetMasuVat' + ('?InvoiceNo=' + invNo)
    let response = await dispatch(sendVat(user, token, api ));
    console.log(api, invNo)
    if(response?.error) setError(response?.error);
    else setQR(response?.data?.ebarimtdata?.qrData)
    setInfo(response?.data)
    setData(response?.data?.info)
    setLoading(false);
  }

  const getQR1 = async ( query) => {
    setError(null);
    setLoading(true);
    setQR(null);
    let api = 'Pos/SendDataEBarimt'
    let response = await dispatch(getVat(user, token, api ));
    if(response?.error) setError(response?.error);
    else getQR()
    setLoading(false);
  }

  const onPressPrint = () => {
    const html = getPrintHtml({merchant: info, data, amt, currency: user?.msMerchant?.currency});
    console.log(html)
    // html2canvas(document.getElementById('tax_pdf')).then(function(canvas) {
    //   const imgWidth = 188, pageHeight = 195;
    //   const imgHeight = (canvas.height * imgWidth) / canvas.width;
    //   let heightLeft = imgHeight, position = 10, margin= 10;
    //   heightLeft -= pageHeight;
    //   const pdf = new jsPDF('p', 'mm');
    //   pdf.addImage(canvas, 'PNG', margin, position, imgWidth, imgHeight, '', 'FAST');
    //   while (heightLeft >= 0) {
    //     position = heightLeft - imgHeight;
    //     pdf.addPage();
    //     pdf.addImage(canvas, 'PNG', margin, position, imgWidth, imgHeight, '', 'FAST');
    //     heightLeft -= pageHeight;
    //   }
    //   pdf.save(t('system.receipt') + '.pdf');
    // });
  }

  const stepProps = { onBack, onDone: onDone1, print: print, onPressPrint };
  const listProps = { data, setAmt };

  return (
    <Modal title={null} footer={null} closable={false} open={visible} centered={true} width={650}>
      <Overlay loading={loading} className='m_back2'>
      <div className='' id='tax_pdf'>
        <img className='sys_logo' src={logo_image} alt='Logo' />
        <div className='h_row'>
          <p className='h_text'>{t('system.receipt')}</p>
        </div>
        <div className='line'/>
        <div className='sys_date'>
            <div className='sys_h_row'>
              <p className='h_label'>{t('bill.ddtd')}: </p>
              <p className='sys_info_value'>{info?.ebarimtdata?.billId}</p>
            </div>
            <div className='sys_h_row'>
              <p className='h_label'>{t('page.date')}: </p>
              <p className='sys_info_value'>{moment(info?.createdDate).format('yyyy.MM.DD HH:mm')}</p>
            </div>
        </div>
        <div className='sys_row'>
          <div className='sys_col'>
              <p className='sys_label'>{t('system.receive')}:</p>
              <Field1 label={t('page.name')} value={"МасуПОС"}/>
              <Field1 label={t('noti.address')} value={'Twin Tower2, 11 давхар'}/>
              <Field1 label={t('bill.phone')} value={'95082022'}/>
              <Field1 label={t('system.bank')} value={"Хаан банк"}/>
              <Field1 label={t('system.bank_no')} value={'5011703186'}/>
          </div>
          <div className='sys_col1'>
            <p className='sys_label'>{t('system.resend')}:</p>
              <Field label={t('page.name')} value={info?.merchant?.Descr}/>
              <Field label={t('employee.mail')} value={info?.merchant?.Email}/>
              <Field label={t('noti.address')} value={info?.merchant?.Address}/>
              <Field label={t('bill.phone')} value={info?.merchant?.Phone}/>
          </div>
        </div>
        <div>
          {!data?.length ? null : <TaxList {...listProps}/>}
        </div>
        <div className='line'/>
        <div className='tax_back'>
          <div className='es_pay_col'>
            <Overlay loading={loading}>
              {!qr
                ? <img className='es_qr_holder' src={qr_holder} alt='Logo' />
                : <QRCode
                    size={180}
                    style={{ margin: '5px 0' }}
                    value={qr} />
              }
            </Overlay>
          </div>
            <div className='sys_pdf_col'>
              <Field2 label={t('system.tax_no')} value={info?.ebarimtdata?.lottery}/>
              <Field2 label={t('system.e_amt')} value={<Money value ={amt}/>}/>
            </div>
        </div>
      </div>
        <div className='gap' />
        {error && <Error1 error={error} />}
        <Step {...stepProps}/>
      </Overlay>
    </Modal>
  );
}

