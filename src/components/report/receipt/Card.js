import React from 'react';
import { useTranslation } from 'react-i18next';

import { DynamicTBIcon } from '../../all';

export function Card(props){
  const { data, tab, setTab, size } = props;
  const { t } = useTranslation();

  const id = size?.width >= 500 ? 'rp_card_large' : 'rp_card_small';

  const Tab = props => {
    const { label, value, icon, index, color } = props;
    const btnStyle = index === tab ?  { borderColor: '#4BAF4F' } : {};
    
    return (
      <button className='rp_card_btn' style={btnStyle} onClick={() => setTab(index)}>
        <div className='rp_card_icon_back' style={{backgroundColor: color}}><DynamicTBIcon name={icon} className='rp_card_icon' /></div>
        <div className='rp_card_side'>
          <p className='rp_card_label'>{t('report_receipt.' + label)}</p>
          <p className='rp_card_value'>{value ?? 0}</p>
        </div>
      </button>
    );
  }

  return (
    <div className='rp_card' id={id}>
      <Tab label='c_title1' value={data?.value1} index={1} color='#b0b0b0' icon='TbReceipt' />
      <Tab label='c_title2' value={data?.value2} index={2} color='#4BAF4F' icon='TbReceipt2' />
      <Tab label='c_title3' value={data?.value3} index={3} color='#e41051' icon='TbReceiptRefund' />
    </div>
  );
}