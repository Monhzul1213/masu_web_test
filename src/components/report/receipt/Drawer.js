import React from 'react';
import { Drawer as AntDrawer } from 'antd';
import { useTranslation } from 'react-i18next';
import moment from 'moment';

import '../../../css/report.css';
import { formatNumber } from '../../../helpers';
import { DynamicAIIcon } from '../../all';

export function Drawer(props){
  const { selected, setSelected } = props;
  const { t } = useTranslation();

  const onClose = () => setSelected(null);

  const renderItem = (item, index) => {
    return (
      <div key={index} className='dr_item'>
        <div className='dr_item_top'>
          <p className='dr_item_title'>{item?.invtName ?? item?.invtId}</p>
          <p className='dr_item_total'>₮{formatNumber(item?.amount)}</p>
        </div>
        <p className='dr_item_price'>{item?.qty} x ₮{formatNumber(item?.price)}</p>
        {item?.modifierId ? <p className='dr_item_price'>+{item?.modifierName} (₮{formatNumber(item?.modifierAmount)})</p> : null}
        {item?.discountId ? <p className='dr_item_price'>+{item?.discountName} (₮{formatNumber(item?.discountAmount)})</p> : null}
      </div>
    )
  }

  const drawerProps = { className: 'rp_drawer', placement: 'right', onClose, closable: false, open: selected ? true : false, mask: false };

  return (
    <AntDrawer {...drawerProps}>
      <div className='dr_back'>
        <DynamicAIIcon className='dr_close' name='AiFillCloseCircle' onClick={onClose} />
        <div className='dr_total'>
          <p className='dr_total_value'>₮{formatNumber(selected?.sale?.totalSalesAmount)}</p>
          <p className='dr_total_label'>{t('report_receipt.t_total')}</p>
        </div>
        <div className='dr_section'>
          <p className='dr_text'>{t('report_receipt.cashier')}: {selected?.sale?.cashierName}</p>
          <p className='dr_text'>{t('report_receipt.pos')}: {selected?.sale?.terminalName}</p>
        </div>
        <div className='dr_section'>
          {selected?.saleitem?.map(renderItem)}
        </div>
        {selected?.sale?.totalDiscountAmount ?
          <div className='dr_section'>
            <div className='dr_row' style={{margin: '0'}}>
              <p className='dr_row_label'>{t('report_receipt.discount')}</p>
              <p className='dr_row_value'>-₮{formatNumber(selected?.sale?.totalDiscountAmount)}</p>
            </div>
          </div>
        : null}
        <div className='dr_section' style={{padding: '10px 0 5px 0'}}>
          <div className='dr_row'>
            <p className='dr_row_label' style={{fontWeight: 'bold'}}>{t('report_receipt.t_total')}</p>
            <p className='dr_row_value' style={{fontWeight: 'bold'}}>₮{formatNumber(selected?.sale?.totalSalesAmount)}</p>
          </div>
          {selected?.sale?.totalCashAmount ? 
            <div className='dr_row'>
              <p className='dr_row_label'>{t('report_receipt.cash')}</p>
              <p className='dr_row_value'>₮{formatNumber(selected?.sale?.totalCashAmount)}</p>
            </div>
          : null}
          {selected?.sale?.totalNonCashAmount ? 
            <div className='dr_row'>
              <p className='dr_row_label'>{t('report_receipt.non_cash')}</p>
              <p className='dr_row_value'>₮{formatNumber(selected?.sale?.totalNonCashAmount)}</p>
            </div>
          : null}
        </div>
        <div className='dr_footer'>
          <p className='dr_footer_text'>{moment(selected?.sale?.createdDate).format('yyyy.MM.DD HH:mm')}</p>
          <p className='dr_footer_text'>№ {selected?.sale?.salesNo}</p>
        </div>
      </div>
    </AntDrawer>
  );
}

// totalNhatamount: 0
// totalVatAmount: 0