import React from 'react';
import { useTranslation } from 'react-i18next';

import '../../../css/report.css';
import { formatNumber } from '../../../helpers';
import { DynamicTBIcon } from '../../all';

export function Card(props){
  const { tab, setTab, size, total } = props;
  const { t } = useTranslation();

  const id = size?.width >= 720 ? 'rp_card_large' : 'rp_card_small';
  const maxWidth = size?.width >= 1260 ? 410 : size?.width >= 720 ? ((size?.width - 60) / 3) : ((size?.width - 45) / 2);

  const Tab = props => {
    const { label, value, value1, icon, index, color } = props;
    const btnStyle = index === tab ?  { borderColor: '#4BAF4F', maxWidth, width: maxWidth } : { maxWidth, width: maxWidth };

    return (
      <button className='rp_card_btn' style={btnStyle} onClick={() => setTab(index)}>
        <div className='rp_card_header'>
          <p className='rp_card_label'>{t('report_receipt.' + label)}</p>
          <DynamicTBIcon name={icon} className='rp_card_icon' style={{ color }} />
        </div>
        <div className='rp_card_side'>
          <p className='rp_card_value'>₮{formatNumber(value1)}</p>
          <p className='rp_card_value1' style={{ color: '#969696' }}>{value ?? 0}</p>
        </div>
      </button>
    );
  }

  return (
    <div className='rp_card' id={id}>
      <div className='rp_card_row'>
        <Tab label='c_title1' value={total?.totalQty} value1={total?.totalAmt} index={-1} color='#017EBE' icon='TbReceipt' />
        <div className='rp_card_line' />
        <Tab label='c_title2' value={total?.salesQty} value1={total?.salesAmt}  index={0} color='#4BAF4F' icon='TbReceipt2' />
      </div>
      <div className='rp_card_line' />
      <Tab label='c_title3' value={total?.returnQty} value1={total?.returnAmt}  index={1} color='#e41051' icon='TbReceiptRefund' />
    </div>
  );
}