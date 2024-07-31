import React, { useEffect, useState } from 'react';
import { Checkbox, Modal } from 'antd';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';

import { getService } from '../../services';
import { Button, ButtonRow, FloatingInput } from '../all';

export function Partner(props){
  const { partner, setPartner } = props;
  const { t } = useTranslation();
  const [checked, setChecked] = useState(false);
  const [open, setOpen] = useState(false);

  const onChange = e => {
    setChecked(e?.target?.checked);
    if(e?.target?.checked) setOpen(true);
    else setPartner({ value: '' });
  }

  const onPressPartner = e => {
    e?.preventDefault();
    setOpen(true);
  }

  const checkProps = { className: 'login_check', checked, onChange };
  const modalProps = { open, setOpen, setChecked, partner, setPartner };
  const text = (partner?.value ?? '') + ' - ' + (partner?.name ?? '');

  return (
    <div>
      {open && <PartnerModal {...modalProps} />}
      <div className='l_partner_check'>
        <Checkbox {...checkProps} />
        <p className='l_partner_check_lbl'>{t('login.is_partner')}</p>
      </div>
      {checked && partner?.value
        ? <Button text={text} className='l_partner_field' onClick={onPressPartner} />
        : null}
    </div>
  );
}

function PartnerModal(props){
  const { open, setOpen, setChecked, partner, setPartner } = props;
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [value, setValue] = useState({ value: '' });
  const dispatch = useDispatch();

  useEffect(() => {
    setValue(partner);
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const closeModal = () => {
    setOpen(false);
    if(!(partner?.value && partner?.name)) setChecked(false);
  }

  const onClickSave = () => {
    if(value?.value && value?.name){
      setPartner(value);
      setOpen(false);
    } else
      setValue({...value, error: t('login.partner_error') })
  }

  const handlePartner = async e => {
    e?.preventDefault();
    setLoading(true);
    let api = 'Merchant/GetPartner?partnercode=' + value?.value;
    let response = await dispatch(getService(api, 'GET'));
    if(response?.error) setValue({...value, error: response?.error });
    else {
      let name = response?.data?.retdata?.partner?.partnerName ?? '';
      setValue({...value, name, error: null });
    }
    setLoading(false);
  }

  const disabled = value?.value ? false : true;
  const partnerProps = { text: t('login.partner'), value, setValue, handleEnter: handlePartner, id: 'l_partner' };
  const partnerBtnProps = { className: 'l_partner_btn', text: t('tax.check'), onClick: handlePartner, disabled, loading };
  const partnerNameProps = { text: t('login.partner_name'), value: { value: value?.name ?? '' }, disabled: true };

  return (
    <Modal title={null} footer={null} closable={false} open={open} centered={true} width={360}>
      <div className='m_back'>
        <div className='l_partner_row'>
          <FloatingInput {...partnerProps} />
          <Button {...partnerBtnProps} />
        </div>
        <FloatingInput {...partnerNameProps} />
      </div>
      <ButtonRow onClickCancel={closeModal} onClickSave={onClickSave} text1='login.close' />
    </Modal>
  );
}