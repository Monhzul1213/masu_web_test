import React from 'react';
import { useTranslation } from 'react-i18next';
import moment from 'moment';
import QRCode from 'react-qr-code';

import { logo_image, qr_holder } from '../../../../../assets';
import { Overlay } from '../../../../all';

export function Info(props){
  const { size, header, url } = props;
  const { t } = useTranslation();


  const id = size?.width >= 600 ? 'ps_info_large' : 'ps_info_small';

  return (
    <div className='ps_info_back' id={id}>
      <div className='in_row'>
           <img className='in_logo' src={logo_image} alt='Logo' />
           <div className='in_col'>
             <p className='in_header_text'>{t('invoice.invoice')}</p>
             <p className='in_text1'>{'# '+ header?.invoiceNo}</p>
           </div>
      </div>
      <div className='in_info_back'>
            <div className='in_info'>
                <div className='in_info_row'>
                    <p className='in_info_label'>{'МАСУПОС ХХК'}</p>
                </div>
                <div className='in_info_row'>
                    <p className='in_info_label'>{t('system.RD')} : </p>
                    <p className='in_info_value'>{'6934277'}</p>
                </div>
                <div className='in_info_row'>
                    <p className='in_info_value'>{'Монгол улс, Улаанбаатар хот, Сүхбаатар дүүрэг 2-р хороо, Сөүлийн гудамж Твин Тауэр-2, 11-р давхар 1101 тоот'}</p>
                </div>
            </div>
            <Overlay >
              {!url ? 
                <img className='es_qr_holder' src={qr_holder} alt='Logo' /> :
                  <QRCode
                    size={100}
                    
                    value={url} 
                    />
              }
            </Overlay>
        </div>
        <div className='in_info_back1'>
            <div className='in_info'>
              <p className='in_text'>{t('system.bill')}</p>
              <p className='in_text2'>{header?.merchantName}</p>
            </div>
            <div className='in_info'>
              <p className='in_text'>{t('system.invoice_date')} </p>
              <p className='in_text2'>{moment(header?.invoiceDate).format('yyyy.MM.DD')}</p>
            </div>
        </div>
    </div>
  );
}