import React, { useEffect } from 'react';
import { Drawer as AntDrawer } from 'antd';
import { useTranslation } from 'react-i18next';
import moment from 'moment';

import '../../../css/report.css';
import { DynamicAIIcon, Money } from '../../all/all_m';

export function Drawer(props){
  const { selected, open, setOpen } = props;
  const { t } = useTranslation();

  useEffect(() => {
    if(selected){
      console.log(selected)
    }
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selected]);

  const onClose = () => setOpen(null);

  // const Field = props => {
  //   const { icon, label, value } = props;
    
  //   return (
  //     <div className='dr_field'>
  //       <DynamicRIIcon className='dr_field_icon' name={icon} />
  //       <p className='dr_field_label'>{t(label)}</p>
  //       <p className='dr_field_label1'>:</p>
  //       <p className='dr_field_value'>{value}</p>
  //     </div>
  //   )
  // }

  const drawerProps = { className: 'tm_drawer', placement: 'right', onClose, closable: false, open, mask: false };

  return (
    <AntDrawer {...drawerProps}>
      <div className='dr_back'>
        <DynamicAIIcon className='dr_close' name='AiFillCloseCircle' onClick={onClose} />
        <p className='tm_dr_title'>{t('timetable.order_time')}</p>
        <div className='tm_col'>
            <p className='dr_row_label'>{selected?.item?.beginTime + '-' + selected?.item?.endTime}</p>
            <p className='dr_row_value'>{moment(selected?.item?.schdDate)?.format('yyyy.MM.DD dddd')}</p>
        </div>
        <div className='tm_col'>
            <p className='dr_row_label'>{t('employee.title')}</p>
            <p className='dr_row_value'>{(selected?.item?.empName)}</p>
        </div>
        <div className='tm_col'>
            <p className='tm_dr_row_label'>{t('timetable.service')}</p>
        </div>
         <div style={{padding: '5px 0 5px 0'}}>
         <div className='dr_row'>
            <p className='dr_row_label'>{selected?.title}</p>
            <p className='dr_row_value'><Money value={selected?.item?.amount} fontSize={13} /></p>
          </div>
          <div className='dr_row'>
            <p className='dr_row_label'>{t('report_receipt.discount')}</p>
            <p className='dr_row_value'><Money value={selected?.sale?.totalDiscountAmount} fontSize={13} /></p>
          </div>
          <div className='dr_row'>
            <p className='dr_row_label'>{t('report_receipt.vat')}</p>
            <p className='dr_row_value'><Money value={selected?.sale?.totalVatAmount} fontSize={13} /></p>
          </div>
          <div className='dr_row'>
            <p className='dr_row_label'>{t('report_receipt.amt')}</p>
            <p className='dr_row_value'><Money value={selected?.sale?.totalAmount} fontSize={13} /></p>
          </div>
        </div>
        {/* <Field icon='RiUserLine' label='time.t_emp' value={selected?.sale?.cashierName} />
        <Field icon='RiDeviceLine' label='report_receipt.pos' value={selected?.sale?.terminalDescr} />
        <Field icon='RiStore2Line' label='report_receipt.dr_site' value={selected?.sale?.siteName} />
        <Field icon='RiBillLine' label='report_receipt.dr_no' value={selected?.sale?.salesNo} /> */}
        {/* <Field icon='RiCalendarLine' label='system.date' value={moment(selected?.item?.createdDate)?.format('yyyy.MM.DD HH:mm:ss')} /> */}
        {/* <Field icon='RiTeamLine' label='menu.customer' value={selected?.customer} />  */}
        <p>{'----------------------------------------------------'}</p>
      </div>
    </AntDrawer>
  );
}