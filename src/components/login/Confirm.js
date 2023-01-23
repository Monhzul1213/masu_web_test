import React, { useState } from 'react';
import { Modal, message } from 'antd';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import ReactInputMask from 'react-input-mask';

import '../../css/config.css';
import '../../css/report.css';
import { getService } from '../../services';
import { Button, DynamicAIIcon, Error } from '../all';

export function Confirm(props){
  const { visible, number, closeModal } = props;
  const { t } = useTranslation();
  const [code, setCode] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const onKeyDown = e => {
    if(e?.key?.toLowerCase() === "enter") onClickConfirm();
  }

  const onChange = e => {
    setCode(e.target.value);
    setError && setError(null);
  }

  const onClickConfirm = async () => {
    setLoading(true);
    let api = 'Merchant/Validate/Phone?mobile=' + number + '&regnum=' + code?.replace(/[ _]/g, '');
    console.log(api);
    let response = await dispatch(getService(api));
    setLoading(false);
    if(response?.error) setError(response?.error);
    else {
      message.success(t('login.success'));
      closeModal(true);
    }
  }

  return (
    <Modal title={null} footer={null} closable={false} open={visible} centered={true} width={400}>
      <div className='m_back'>
        <DynamicAIIcon className='dr_close' name='AiFillCloseCircle' onClick={() => closeModal()} />
        <p className='ap_title'>{t('login.confirm')}</p>
        <div className='cfnumber_back'>
          <p className='cfnumber_text'>{number}</p>
        </div>
        <p className='cf_msg'>{t('login.confirm_msg')}</p>
        <p className='cfcode_lbl'>{t('login.confirm_code')}</p>
        <ReactInputMask
          className='cfcode_input'
          mask='9 9 9 9 9 9'
          maskChar='_'
          onKeyDown={onKeyDown}
          value={code}
          placeholder='_ _ _ _ _ _'
          onChange={onChange} />
        <div className='gap' />
        {error && <Error error={error} />}
        <Button className='l_btn' loading={loading} text={t('login.confirm')} onClick={onClickConfirm} />
      </div>
    </Modal>
  );
}