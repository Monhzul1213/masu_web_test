import React from 'react';
import { useTranslation } from 'react-i18next';

import '../../../css/report.css';
import { formatNumber } from '../../../helpers';
import { DynamicTBIcon } from '../../all';

export function Card(props){
  const { tab, setTab, size, total } = props;
  const { t } = useTranslation();

  const id = size?.width >= 520 ? 'rp_card_large' : 'rp_card_small';

  const Tab = props => {
    const { label, value, value1, icon, index, color } = props;
    const btnStyle = index === tab ?  { borderColor: '#4BAF4F' } : {};
    
    return (
      <button className='rp_card_btn' style={btnStyle} onClick={() => setTab(index)}>
        <div className='rp_card_icon_back' style={{backgroundColor: color}}><DynamicTBIcon name={icon} className='rp_card_icon' /></div>
        <div className='rp_card_side'>
          <p className='rp_card_label'>{t('report_receipt.' + label)}</p>
          <p className='rp_card_value'>{value ?? 0} / ₮{formatNumber(value1)}</p>
        </div>
      </button>
    );
  }

  return (
    <div className='rp_card' id={id}>
      <Tab label='c_title1' value={total?.totalQty} value1={total?.totalAmt} index={-1} color='#b0b0b0' icon='TbReceipt' />
      <Tab label='c_title2' value={total?.salesQty} value1={total?.salesAmt}  index={0} color='#4BAF4F' icon='TbReceipt2' />
      <Tab label='c_title3' value={total?.returnQty} value1={total?.returnAmt}  index={1} color='#e41051' icon='TbReceiptRefund' />
    </div>
  );
}