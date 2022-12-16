import React from 'react';
import { Drawer as AntDrawer } from 'antd';
import { useTranslation } from 'react-i18next';

import '../../../css/report.css';
import { DynamicAIIcon, DynamicRIIcon, Money } from '../../all';

export function Drawer(props){
  const { selected, open, setOpen } = props;
  const { t } = useTranslation();

  const onClose = () => setOpen(null);

  const renderItem = (item, index) => {
    return (
      <div key={index} className='dr_item'>
        <p className='dr_item_text1'>{item?.invtName ?? item?.invtId}</p>
        <p className='dr_item_text2'>{item?.qty}</p>
        <p className='dr_item_text3'><Money value={item?.price} fontSize={13} /></p>
        <p className='dr_item_text4'><Money value={item?.amount} fontSize={13} /></p>
      </div>
    )
  }

  const Field = props => {
    const { icon, label, value } = props;

    return (
      <div className='dr_field'>
        <DynamicRIIcon className='dr_field_icon' name={icon} />
        <p className='dr_field_label'>{t(label)}</p>
        <p className='dr_field_label1'>:</p>
        <p className='dr_field_value'>{value}</p>
      </div>
    )
  }

  const drawerProps = { className: 'rp_drawer', placement: 'right', onClose, closable: false, open, mask: false };

  return (
    <AntDrawer {...drawerProps}>
      <div className='dr_back'>
        <DynamicAIIcon className='dr_close' name='AiFillCloseCircle' onClick={onClose} />
        <p className='dr_title'>{selected?.sale?.salesTypeName}</p>
        <Field icon='RiUserLine' label='time.t_emp' value={selected?.sale?.cashierName} />
        <Field icon='RiDeviceLine' label='report_receipt.pos' value={selected?.sale?.terminalDescr} />
        <Field icon='RiStore2Line' label='report_receipt.dr_site' value={selected?.sale?.siteName} />
        <Field icon='RiBillLine' label='report_receipt.dr_no' value={selected?.sale?.salesNo} />
        <div className='dr_header'>
          <p className='dr_header_text1'>{t('report_receipt.invt')}</p>
          <p className='dr_header_text2'>{t('report_receipt.qty')}</p>
          <p className='dr_header_text3'>{t('report_receipt.price')}</p>
          <p className='dr_header_text4'>{t('report_receipt.amt')}</p>
        </div>
        <div className='dr_list'>
          {selected?.saleitem?.map(renderItem)}
        </div>
        <div style={{padding: '5px 0 5px 0'}}>
          <div className='dr_row'>
            <p className='dr_row_label' style={{fontWeight: 'bold'}}>{t('report_receipt.t_total')}</p>
            <p className='dr_row_value' style={{fontWeight: 'bold'}}><Money value={selected?.sale?.totalSalesAmount} fontSize={13} /></p>
          </div>
          <div className='dr_row'>
            <p className='dr_row_label'>{t('report_receipt.discount')}</p>
            <p className='dr_row_value' style={{fontWeight: 'bold'}}><Money value={selected?.sale?.totalDiscountAmount} fontSize={13} /></p>
          </div>
          <div className='dr_row'>
            <p className='dr_row_label'>{t('report_receipt.cash')}</p>
            <p className='dr_row_value' style={{fontWeight: 'bold'}}><Money value={selected?.sale?.totalCashAmount} fontSize={13} /></p>
          </div>
          <div className='dr_row'>
            <p className='dr_row_label'>{t('report_receipt.non_cash')}</p>
            <p className='dr_row_value' style={{fontWeight: 'bold'}}><Money value={selected?.sale?.totalNonCashAmount} fontSize={13} /></p>
          </div>
        </div>
      </div>
    </AntDrawer>
  );
}