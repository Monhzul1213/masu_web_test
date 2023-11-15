
import React, { useState, useEffect } from 'react';
import { Modal } from 'antd';
import { useTranslation } from 'react-i18next';

import { ButtonRow, ModalTitle } from '../../../components/all';
import Map from '../tax/add/Map';

export function Location(props){
  const { visible, closeModal, lng, setLng, lat, setLat, selected} = props
  const { t } = useTranslation();
  const [loaded, setLoaded] = useState(false);

    useEffect(() => {
      console.log(selected)
      if(visible && selected && selected?.haslocation){
        setLat(parseFloat(selected?.latitudes));
        setLng(parseFloat(selected?.longitudes));
      } else {
        // setLat(47.914318);
        // setLng(106.919143);
      }
      setLoaded(visible);
      return () => {};
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [visible]);

  const onClick = e => {
    console.log(e.latLng.toString())
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
        {loaded && <Map {...mapProps} />}
      </div>
      <ButtonRow {...btnProps} />
    </Modal>
  );
}