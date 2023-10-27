
import React from 'react';
import { useTranslation } from 'react-i18next';

import { masu } from '../../../../../assets';

export function Sign(props){
  const { header } = props;
  const { t } = useTranslation();

  const Field = ({ label, value }) => {
    return (
      <div className='in_info_row'>
        <p className='in_text_label'>{t(label)} : </p>
        <p className='in_text_value'>{value}</p>
      </div>
    )
  }

  const Field1 = ({ label, value }) => {
    return (
      <div className='in_info_row'>
        <p className='in_text_label1'>{t(label)} : </p>
        <p className='in_text_value'>{value}</p>
      </div>
    )
  }

  return (
    <div>
        <div className='qr_back'>
          <div className='in_notes_back'>
            <p className='inText'>{t('system.notes')}</p>
            <p className='inText'>{'Та төлбөрөө дараах банкны дансуудад төлөхдөө гүйлгээний утганд нэхэмжлэхийн дугаараа зөвхөн бичнэ үү.'}</p>
            <Field label={'Таны нэхэмжлэхийн дугаар'} value={header?.invoiceNo}/>
            <p className='inText'>{'Байгууллага дээр и-Баримт авах бол регистерийн дугаараа хамтад нь бичиж шилжүүлнэ үү.'}</p>
            <div className='in_row'>
                <div style={{marginTop: 20, width: 500}}>
                  <Field1 label={'Хүлээн авагч'} value={'МАСУПОС ХХК'}/>
                  <Field1 label={'Хаан банк'} value={'5011703186'}/>
                  <Field1 label={'Худалдаа хөгжлийн банк'} value={'819006011'}/>
                </div>
                <div className='inCol'>
                  <p className='inText1'>{'Тамга:'}</p>
                  <img className='in_seal' src={masu} alt='Logo' />
                </div>
            </div>
          </div>
        </div>
    </div>
  );
}