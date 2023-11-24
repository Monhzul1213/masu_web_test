
import React, { useState, useEffect } from 'react';
import { Modal } from 'antd';
import { useTranslation } from 'react-i18next';

import { ButtonRow, ModalTitle } from '../../../components/all';
import Map from './Map';


export function Location(props){
  const { visible, closeModal, lng, setLng, lat, setLat, descr1, descr2, city} = props
  const { t } = useTranslation();
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setLat(descr1?.value ? descr1?.value : lat);
    setLng(descr2?.value ? descr2?.value : lng);
    setLoaded(visible);
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible]);

  const onClick = e => {
    setLat(e.latLng.lat());
    setLng(e.latLng.lng());
  }

  const mapProps = { onClick, lat, lng, city };
  const btnProps = { onClickCancel: () => closeModal(), onClickSave: () => closeModal(true, lat, lng) };

  return (
    <Modal title={null} footer={null} closable={false} open={visible} centered={true} width={720}>
      <div className='m_back'>
        <ModalTitle icon='MdLocationPin' title={t('tax.choose_location')} isMD={true} />
        <div style={{height: 5}} />
        {loaded && <Map {...mapProps} />}
      </div>
      <ButtonRow {...btnProps} />
    </Modal>
  );
}