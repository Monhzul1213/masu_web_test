import React, { useState } from 'react';
import { Modal, message } from 'antd';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';

import { ButtonRow, DynamicRIIcon, Error, Overlay } from '../../all/all_m';
import { IoLocationOutline } from 'react-icons/io5';
import { UpdateList } from './UpdateList';
import { sendRequest } from '../../../../services';


export function Update(props){
  const { visible, closeModal, selected, onClickLink, data2, setData2, getData, filter } = props;
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { user, token }  = useSelector(state => state.login);
  const dispatch = useDispatch();

  const Field = props => {
    const { icon, label, value } = props;

    return (
      <div className='dr_field'>
        {label !== 'orders.location' ? <DynamicRIIcon className='dr_field_icon' name={icon} /> :
        <IoLocationOutline className='dr_field_icon'/>}
        <p className='dr_field_label'>{t(label)}</p>
        <p className='dr_field_label1'>:</p>
        <p className='dr_field_value_z'>{value}</p>
      </div>
    )
  }

  const onClickSave = async e => {
    e?.preventDefault();
      setLoading(true);
      let data = [];
      data2?.forEach(item => {
        data.push(item)
      })
      const response = await dispatch(sendRequest(user, token, 'Sales/ModSalesHold', data));
      if(response?.error) setError(response?.error);
      else {
        closeModal(true);
        message.success(t('report.update_success'));
        getData(filter)
      }
      setLoading(false);
    
  }

  const btnProps = { onClickCancel: () => closeModal(), onClickSave };
  const listProps = { data: data2, setData: setData2 };

  return (
    <Modal title={null} footer={null} closable={false} open={visible} centered={true} width={600}>
      <Overlay loading={loading}>
      <div className='m_back'>
        <p className='dr_title_m'>{selected?.salesTypeName}</p>
        {selected?.status === 1 ?
        <div className='dr_field'>
          <DynamicRIIcon className='dr_field_icon' name={'RiBillLine'} />
          <p className='dr_field_label'>{t('report_receipt.dr_no')}</p>
          <p className='dr_field_label1'>:</p>
          <a className='table_link' onClick={onClickLink}>{selected?.salesNo}</a>
        </div> :
        <Field icon='RiBillLine' label='report_receipt.dr_no' value={selected?.salesNo} />} 
        <Field icon='RiStore2Line' label='report_receipt.dr_site' value={selected?.siteName} />
        <Field icon='RiDeviceLine' label='report_receipt.pos' value={selected?.terminalName} />
        <Field icon='RiUserLine' label='time.t_emp' value={selected?.cashierName} />
        <Field icon='RiTeamLine' label='menu.customer' value={selected?.customer} />
        <UpdateList {...listProps}/>
        {error && <Error error={error} id='m_error' />}
        <ButtonRow {...btnProps}/>
      </div>
      </Overlay>
    </Modal>
  )
}