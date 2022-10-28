import React, { useState } from 'react';
import { Modal, message } from 'antd';
import { useTranslation } from 'react-i18next';

import { ButtonRow, ModalTitle, Overlay, Input } from '../../../all';

export function Add(props){
  const { visible, selected, closeModal } = props;
  const { t } = useTranslation();
  const [name, setName] = useState({ value: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * name": "Дэлгүүрийн нэр",
    "name1": "Оноосн нэр бусад дэлүүрээс ялгаатай байна",
    "addr": "Дэлгүүрийн хаяг",
    "addr1": "Тухайн дэлгүүрийн хаяг",
    "phone": "Утас",
    "phone1": "Тухайн дэлгүүрийн утас",
    "descr": "Тайлбар",
    "descr1":
   */

  const onClickSave = () => {

  }

  const onClickDelete = () => {

  }

  // const nameProps = { value: name, setValue: setName, label: t('shop.name'), placeholder: t('shop.name1'), setError,
  // handleEnter, mask, style1, style2 };
  const btnProps = { onClickCancel: () => closeModal(), onClickSave, type: 'submit', show: selected ? true : false, onClickDelete };

  return (
    <Modal title={null} footer={null} closable={false} open={visible} centered={true} width={400}>
      <Overlay loading={loading}>
        <div className='m_back'>
          <ModalTitle icon='MdStorefront' title={t(selected ? 'shop.edit' : 'shop.new')} isMD={true} />
          {/* <Input {...nameProps} /> */}
          {/* {error && <Error error={error} id='m_error' />} */}
        </div>
        <ButtonRow {...btnProps} />
      </Overlay>
    </Modal>
  )
}