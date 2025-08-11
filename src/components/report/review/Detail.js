import React from 'react';
import { useTranslation } from 'react-i18next';

import { Overlay, DynamicTBIcon, Error, Empty1 } from '../../all';
import { Modal } from 'antd';
import { DetailList } from './DetailList';


export function Detail(props){
  const { data, size, visible, closeModal, loading, error} = props;
  const { t } = useTranslation();

  const listProps = { data, size }
  const emptyProps = { id: 'rp_empty', icon: 'MdOutlineViewColumn' };

  return (
    <Modal title={null} footer={null} closable={false} open={visible} onCancel = {closeModal}  centered={true} width={size?.width >= 500 ? 500 : 300}>
        <Overlay loading={loading} className='m_back2'>
            <div >
              {error && <Error error={error}/>}
            <div className='row'>
              <DynamicTBIcon name='TbReportAnalytics' className='report_icon'/>
              <p style={{fontSize: 16, fontWeight: 600}}>{t('menu.invt_remainder')}</p>
            </div>
            {data?.length ? <DetailList {...listProps} /> : <Empty1 {...emptyProps} />}
            </div>
        </Overlay>
    </Modal>
  )
}