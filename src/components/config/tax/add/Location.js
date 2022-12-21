
import React, { useState, useEffect } from 'react';
import { Modal } from 'antd';
import { useTranslation } from 'react-i18next';

import { ButtonRow, ModalTitle } from '../../../all';
import Map from './Map';

export function Location(props){
  const { visible, selected, closeModal } = props
  const { t } = useTranslation();
  const [lat, setLat] = useState(47.914318);
  const [lng, setLng] = useState(106.919143);

  useEffect(() => {
    if(visible && selected && selected?.item && selected?.item?.haslocation){
      setLat(selected?.item?.locationY);
      setLng(selected?.item?.locationX);
    }
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible]);

  const onClick = e => {
    setLat(e.latLng.lat());
    setLng(e.latLng.lng());
  }

  const mapProps = { onClick, lat, lng };
  const btnProps = { onClickCancel: () => closeModal(), onClickSave: () => closeModal(true, lat, lng) };

  return (
    <Modal title={null} footer={null} closable={false} open={visible} centered={true} width={720}>
      <div className='m_back'>
        <ModalTitle icon='MdLocationPin' title={t('tax.choose_location')} isMD={true} />
        <div style={{height: 5}} />
        <Map {...mapProps} />
      </div>
      <ButtonRow {...btnProps} />
    </Modal>
  );
}