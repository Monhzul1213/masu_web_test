import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

import '../../../css/report.css';
import { Button, DynamicAIIcon, DynamicTBIcon, Money, Select } from '../../all';
import { IconButton } from './Button';

const { Option } = Select;

export function Select1(props){
  const { tab, setTab, size, data, data1, setValue, value, label } = props;
  const { t } = useTranslation();

  const maxWidth = size?.width >= 1260 ? 410 : 230;

  const renderItem = (item, index) => {

    const onClick = () => {
        console.log(item)
        // setValue(item?.valueNum)
        // console.log(value)
        // setIcon(<BsCheckLg/>)
      }

    return (
      <>
        <IconButton icon={item?.valueNum === value ? 
        <DynamicAIIcon style={{color:'var(--config-color)'}} name={'AiOutlineCheck'} /> : ''}  
        className={item?.valueNum === value ? 'pro_button' : 'pro_button1'} text= {item?.valueStr1} onClick ={onClick}/>
        <div className='button_line'/>
      </>
    );
  }


  const Tab = props => {
    const { label, icon, index, color } = props;
    const btnStyle = index === tab ?  { borderColor: 'var(--config-color)', maxWidth: 230, width: maxWidth } : { maxWidth: 230, width: maxWidth };

    return (
        <>
            <button className='pro_card_btn' style={btnStyle} onClick={() => setTab(index)}>
                <div className='pro_card_header'>
                    {/* <DynamicTBIcon name={icon} className='rp_card_icon' style={{ color }} /> */}
                    <p className='pro_card_label' >{t('profile.' + label)}</p>
                </div>
            </button>
        </>

    );
  }

  return (
    <div className='pro_card'>
        <p className='select_lbl'>{t('profile.activity')}</p>
      <div className='pro_card_row'>
        <Tab label='sale' index={-1} color='#017EBE' icon='TbReceipt' />
        <div className='rp_card_line' />
        <Tab label='vendor' index={0} color='#4BAF4F' icon='TbReceipt2' />
      </div>
      <div className={ 'button_back'  }>
        {tab === -1 ? data?.map(renderItem) : data1?.map(renderItem)}
      </div>
      {value?.error && <p className='f_input_error'>{value?.noLabel ? '' : label} {value?.error}</p>}
    </div>
  );
}