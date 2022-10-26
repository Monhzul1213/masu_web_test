import React, { useState } from 'react';
import { Modal } from 'antd';
import { useTranslation } from 'react-i18next';

import { ButtonRow, Input, ModalTitle, Overlay } from '../../all';

export function Add(props){
  const { visible, closeModal } = props;
  const { t } = useTranslation();
  const [name, setName] = useState({ value: '' });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const onClickSave = e => {
    e?.preventDefault();
    setLoading(true);
    setTimeout(() => setLoading(false), 1200);
  }
  
  const nameProps = { value: name, setValue: setName, label: t('category.name'), placeholder: t('category.name'), setError };
  
  return (
    <Modal title={null} footer={null} closable={false} open={visible} centered={true} width={400}>
      <Overlay loading={loading}>
        <div className='m_back'>
          <ModalTitle icon='MdOutlineCategory' title={t('category.add')} isMD={true} />
          <Input {...nameProps} />
        </div>
        <ButtonRow onClickCancel={closeModal} onClickSave={onClickSave} type='submit' />
      </Overlay>
    </Modal>
  )
}