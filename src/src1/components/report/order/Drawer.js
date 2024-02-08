import React, { useEffect, useState } from 'react';
import { Drawer as AntDrawer } from 'antd';
import { useTranslation } from 'react-i18next';
import { IoLocationOutline } from "react-icons/io5";

import '../../../../css/report.css';
import { DynamicAIIcon, DynamicRIIcon, Money } from '../../all/all_m';
import { config, encrypt } from '../../../../helpers';

export function Drawer(props){
  const { selected, open, setOpen, data1, user} = props;
  const { t } = useTranslation();
  const [pureAmount, setPureAmount] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);

  useEffect(() => {
    console.log(selected)
    if(selected){
      let pure = (selected?.totalSalesAmount ?? 0) -
        (selected?.totalVatAmount ?? 0) - (selected?.totalNhatamount ?? 0);
      setPureAmount(pure);
      setTotalAmount((selected?.totalCashAmount ?? 0) + (selected?.totalNonCashAmount ?? 0));
    }
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selected]);

  const onClose = () => setOpen(null);

  const renderItem = (item, index) => {
    let variant = item?.variantName ? (' (' + item?.variantName  + ')') : ''
    return (
      <>
     {item?.salesNo === selected?.salesNo ? 
      <div key={index} className='dr_items'>
        <div key={index} className='dr_item_row_z'>
          <p className='dr_item_text1'>{item?.invtName ?? item?.invtId}{variant}</p>
          <p className='dr_item_text2'>{item?.qty}</p>
          <p className='dr_item_text3'><Money value={item?.price} fontSize={13} /></p>
          <p className='dr_item_text4'><Money value={item?.amount} fontSize={13} /></p>
        </div>
         <p className='dr_item_text_z1'>{(item?.barCode) ? ( item?.barCode ) : ''}</p>
         <p className='dr_item_text_z'>{(item?.serviceCode !== 0 && item?.serviceCode !==null) ? ( t('report_receipt.t_emp')+ ': ' + item?.serviceName ) : ''}</p>
         <p className='dr_item_text_z'>{(item?.serviceCode !== 0 && item?.serviceCode !==null) ? ( t('report.descr')+ ': ' + item?.serviceDescr ) : ''}</p>
      </div>
      : ''
      }
      </>

    )
  }

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

  const onClickLink = () => {
    let msg = user?.merchantId + '-' + selected?.siteId + '-' + selected?.salesNo
    let code = encrypt(msg);
    let url = config?.domain + '/Bill?billno=' + encodeURIComponent(code);
    window.open(url);
  }

  const drawerProps = { className: 'rp_drawer', placement: 'right', onClose, closable: false, open, mask: false };

  return (
    <AntDrawer {...drawerProps}>
      <div className='dr_back'>
        <DynamicAIIcon className='dr_close' name='AiFillCloseCircle' onClick={onClose} />
        <p className='dr_title'>{selected?.salesTypeName}</p>
        <Field icon='RiUserLine' label='time.t_emp' value={selected?.cashierName} />
        <Field icon='RiDeviceLine' label='report_receipt.pos' value={selected?.terminalName} />
        <Field icon='RiStore2Line' label='report_receipt.dr_site' value={selected?.siteName} />
        {selected?.status === 1 ?
        <div className='dr_field'>
          <DynamicRIIcon className='dr_field_icon' name={'RiBillLine'} />
          <p className='dr_field_label'>{t('report_receipt.dr_no')}</p>
          <p className='dr_field_label1'>:</p>
          <a className='table_link' onClick={onClickLink}>{selected?.salesNo}</a>
        </div> :
        <Field icon='RiBillLine' label='report_receipt.dr_no' value={selected?.salesNo} />} 
        <Field icon='RiTeamLine' label='menu.customer' value={selected?.customer} /> 
        <Field icon='IoLocationOutline' label='orders.location' value={selected?.ticket} />
        <div className='dr_header'>
          <p className='dr_header_text1'>{t('report_receipt.invt')}</p>
          <p className='dr_header_text2'>{t('report_receipt.qty')}</p>
          <p className='dr_header_text3'>{t('report_receipt.price')}</p>
          <p className='dr_header_text4'>{t('report_receipt.amt')}</p>
        </div>
        <div className='dr_list'>
          {data1?.map(renderItem)}
        </div>
        <div style={{padding: '5px 0 5px 0'}}>
          <div className='dr_row'>
            <p className='dr_row_label'>{t('report_receipt.amt')}</p>
            <p className='dr_row_value'><Money value={selected?.totalAmount} fontSize={13} /></p>
          </div>
          <div className='dr_row'>
            <p className='dr_row_label'>{t('report_receipt.discount')}</p>
            <p className='dr_row_value'><Money value={selected?.totalDiscountAmount} fontSize={13} /></p>
          </div>
          <div className='dr_row'>
            <p className='dr_row_label' style={{fontWeight: 'bold'}}>{t('report_receipt.pay')}</p>
            <p className='dr_row_value' style={{fontWeight: 'bold'}}><Money value={selected?.totalSalesAmount} fontSize={13} /></p>
          </div>
          <div className='dr_row'>
            <p className='dr_row_label'>{t('report_receipt.pure')}</p>
            <p className='dr_row_value'><Money value={pureAmount} fontSize={13} /></p>
          </div>
          <div className='dr_row'>
            <p className='dr_row_label'>{t('report_receipt.nhat')}</p>
            <p className='dr_row_value'><Money value={selected?.totalNhatamount} fontSize={13} /></p>
          </div>
          <div className='dr_row'>
            <p className='dr_row_label'>{t('report_receipt.vat')}</p>
            <p className='dr_row_value'><Money value={selected?.totalVatAmount} fontSize={13} /></p>
          </div>
          <div className='dr_line' />
          <div className='dr_row'>
            <p className='dr_row_label'>{t('report_receipt.cash')}</p>
            <p className='dr_row_value'><Money value={selected?.totalCashAmount} fontSize={13} /></p>
          </div>
          <div className='dr_row'>
            <p className='dr_row_label'>{t('report_receipt.non_cash')}</p>
            <p className='dr_row_value'><Money value={selected?.totalNonCashAmount} fontSize={13} /></p>
          </div>
          <div className='dr_row'>
            <p className='dr_row_label' style={{fontWeight: 'bold'}}>{t('report_receipt.paid')}</p>
            <p className='dr_row_value' style={{fontWeight: 'bold'}}><Money value={totalAmount} fontSize={13} /></p>
          </div>
        </div>
      </div>
    </AntDrawer>
  );
}