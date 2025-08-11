import React from 'react';
import { Select as AntSelect } from 'antd';
import { useTranslation } from 'react-i18next';

const { Option } = AntSelect;

export function SelectItem(props){
  const { item } = props;

  return (
    <div className='cs_item' style={{display: 'flex', flexFlow: 'row'}}>
      <p className='cs_name' style={{width: 80 }}>{item?.templateId}</p>
      <p className='cs_name'  >{item?.templateName}</p>
    </div>
  );
}

export function TempSelect(props){
  const { value, setValue, label, placeholder, data, setError, setEdited, mode, inRow, onFocus,
    loading, disabled, id, inRow1, className } = props;
  const { t } = useTranslation();
  
  let maxTagPlaceholder = value?.value?.length === data?.length ? t('cashier.pay_shop3') : (value?.value?.length + t('cashier.pay_shop4'));

  const handleChange = e => {
    setValue({ value: e });
    setError && setError(null);
    setEdited && setEdited(true);
  }

  const renderItem = (item, index) => {
    let optItem = { templateName: item?.templateName, templateId: item?.templateId};
    return (
      <Option key={index} value={item?.templateId} templateName= {optItem?.templateName} templateId= {optItem?.templateId} template={item?.template}>
          <SelectItem item={optItem} />
      </Option>);
  }

  const filterOption = (input, option) => {
    return option?.template?.toLowerCase().indexOf(input.toLowerCase()) >= 0
  }

  const style = value?.error ? { borderColor: '#e41051', color: '#e41051' } : {};
  const backStyle = inRow ? {...style, ...{ margin: '0 0 0 0' }} : style;

  return (
    <div style={inRow ? inRow1 ? {flex: 1,  maxWidth: 300 } : {flex: 1} : {}}>
      <div className= {className ?? 'select_back'} style={backStyle} id={id}>
        <p className='select_lbl' style={style}>{label}</p>
        <AntSelect
          mode={mode}
          loading={loading}
          disabled={disabled}
          className='select_m'
          showSearch
          filterOption={filterOption}
          onChange={handleChange}
          value={value?.value}
          onFocus={() => onFocus && onFocus()}
          maxTagCount={0}
          maxTagPlaceholder={maxTagPlaceholder}
          // suffixIcon={<DynamicAIIcon name='AiFillCaretDown' className='select_icon' style={style} />}
          placeholder={placeholder}>
          {data?.map(renderItem)}
        </AntSelect>
      </div>
      {value?.error && <p className='f_input_error'>{label} {value?.error}</p>}
    </div>
  );
}
