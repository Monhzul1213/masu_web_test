import React from 'react';
import { useTranslation } from 'react-i18next';
import { Check, DynamicAIIcon, SelectTime } from '../all/all_m';

export function CheckBox(props){
    const { label, checked, setChecked, style, disabled, value, setValue } = props;
    const { t } = useTranslation();
  
    const onClick = () => {
      setChecked(!checked);
    }

    const onClickAdd = () => {
        console.log('add')
    }

    return (
      <div className='tm_check_row' style={style} >
        <div className='tm_check'>
            <Check checked={checked} onClick={onClick} disabled={disabled} />
            <p className='i_check_lbl'>{t(label)}</p>
        </div>
        <div className='tm_button_back'>
            <SelectTime label='name' className='tm_button' value={value} setValue={setValue}/>
            <DynamicAIIcon name ='AiOutlinePlusCircle' className='tm_icon' onClick={onClickAdd}/>
        </div>
      </div>
    );
  }