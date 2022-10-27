import React, { useState } from 'react';
import { Modal, message } from 'antd';
import { useTranslation } from 'react-i18next';

import { ButtonRow, ModalTitle, Overlay } from '../../../all';

export function Add(props){
  const { visible, selected, closeModal } = props;
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);

  const onClickSave = () => {

  }

  const onClickDelete = () => {

  }

  const btnProps = { onClickCancel: () => closeModal(), onClickSave, type: 'submit', show: selected ? true : false, onClickDelete };

  return (
    <Modal title={null} footer={null} closable={false} open={visible} centered={true} width={400}>
      <Overlay loading={loading}>
        <div className='m_back'>
          <ModalTitle icon='MdStorefront' title={t(selected ? 'shop.edit' : 'shop.add')} isMD={true} />
          {/* {error && <Error error={error} id='m_error' />} */}
        </div>
        <ButtonRow {...btnProps} />
      </Overlay>
    </Modal>
  )
}