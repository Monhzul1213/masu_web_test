import React from 'react';
import { Select as AntSelect, Tag } from 'antd';
import { BsCheckLg } from 'react-icons/bs';
import { useTranslation } from 'react-i18next';

import { Button } from './Button';
const { Option } = AntSelect;

export function Select(props){
  const { value, setValue, label, placeholder, data, setError, setEdited, s_value, s_descr, mode, inRow, onFocus,
    loading, disabled, id } = props;
  const { t } = useTranslation();
  
  let maxTagPlaceholder = value?.value?.length === data?.length ? t('cashier.pay_shop3') : (value?.value?.length + t('cashier.pay_shop4'));

  const handleChange = e => {
    setValue({ value: e });
    setError && setError(null);
    setEdited && setEdited(true);
  }

  const renderItem = (item, index) => {
    return (<Option key={index} value={item[s_value ?? 'value']}>{item[s_descr ?? 'label']}</Option>);
  }

  const style = value?.error ? { borderColor: '#e41051', color: '#e41051' } : {};
  const backStyle = inRow ? {...style, ...{ margin: '0 0 0 0' }} : style;

  return (
    <div style={inRow ? { flex: 1 } : {}}>
      <div className='select_back' style={backStyle} id={id}>
        <p className='select_lbl' style={style}>{label}</p>
        <AntSelect
          mode={mode}
          loading={loading}
          disabled={disabled}
          className='select_m'
          showSearch
          filterOption={(input, option) => option.children?.toLowerCase().indexOf(input.toLowerCase()) >= 0}
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

export function PlainSelect(props){
  const { value, setValue, placeholder, data, s_value, s_descr, className, classBack, label, onFocus, loading, isIndex, classLabel, bStyle } = props;
  
  const renderItem = (item, index) => {
    return (<Option disabled={item?.disabled} key={index} value={isIndex ? index : item[s_value ?? 'value']}>{item[s_descr ?? 'label']}</Option>);
  }

  return (
    <div className={classBack} style={bStyle}>
      {label && <p className={classLabel ?? 'p_select_lbl'}>{label}</p>}
      <AntSelect
        className={className}
        showSearch
        filterOption={(input, option) => option.children?.toLowerCase().indexOf(input.toLowerCase()) >= 0}
        onChange={setValue}
        value={value}
        loading={loading}
        onFocus={onFocus}
        // suffixIcon={<DynamicAIIcon name='AiFillCaretDown' className='select_icon' />}
        placeholder={placeholder}>
        {data?.map(renderItem)}
      </AntSelect>
    </div>
  );
}

export function CustomSelect(props){
  const { value, setValue, placeholder, data, className, classBack, label, onFocus, loading, renderItem,
    filterOption, setError, setEdited, onSearch, text, setData, disabled } = props;
  const { t } = useTranslation();

  const handleChange = e => {
    setValue({ value: e });
    setError && setError(null);
    setEdited && setEdited(true);
  }

  const onDropdownVisibleChange = show => {
    if(!show) setData && setData([]);
  }

  const style = value?.error ? { borderColor: '#e41051', color: '#e41051' } : {};
  const empty = t(text?.length > 3 ? 'page.no_filter' : 'inventory.morethan');
  
  return (
    <div className={classBack}>
      <div className='input_border' style={style}>
        {label && <p className='p_select_lbl' style={style}>{label}</p>}
        <AntSelect
          className={className}
          showSearch
          filterOption={filterOption}
          disabled={disabled}
          onSearch={onSearch}
          onChange={handleChange}
          value={value?.value}
          loading={loading}
          onDropdownVisibleChange={onDropdownVisibleChange}
          onFocus={onFocus}
          notFoundContent={empty}
          placeholder={placeholder}>
          {data?.map(renderItem)}
        </AntSelect>
      </div>
      {value?.error && <p className='f_input_error'>{label} {value?.error}</p>}
    </div>
  );
}

export function MultiSelect(props){
  const { value, setValue, placeholder, data, s_value, s_descr, className, classBack, classLabel, label, onFocus, loading, isIndex, maxTag, onHide, Icon,
    dropdownStyle, dropdownAlign } = props;
  const { t } = useTranslation();
  
  const renderItem = (item, index) => {
    return (<Option key={index} value={isIndex ? index : item[s_value ?? 'value']}>{item[s_descr ?? 'label']}</Option>);
  }

  const onClick = () => {
    let all = data?.map(item => item[s_value ?? 'value']);
    setValue(all);
  }

  const onDropdownVisibleChange = show => {
    if(!show) onHide();
  }

  const dropdownRender = menu => {
    return (
      <>
        <Button className='multi_btn' text={t('time.all')} onClick={onClick} />
        {menu}
      </>
    );
  }

  return (
    <div className={classBack}>
      {Icon && <Icon />}
      {label && <p className={classLabel ?? 'p_select_lbl'}>{label}</p>}
      <AntSelect
        className={className}
        showSearch
        filterOption={(input, option) => option.children?.toLowerCase().indexOf(input.toLowerCase()) >= 0}
        onChange={setValue}
        value={value}
        loading={loading}
        onFocus={onFocus}
        mode='multiple'
        dropdownStyle={dropdownStyle}
        dropdownAlign={dropdownAlign}
        menuItemSelectedIcon={<BsCheckLg />}
        onDropdownVisibleChange={onDropdownVisibleChange}
        dropdownRender={dropdownRender}
        maxTagCount={0}
        maxTagPlaceholder={maxTag}
        placeholder={placeholder}>
        {data?.map(renderItem)}
      </AntSelect>
    </div>
  );
}

export function IconSelect(props){
  const { value, setValue, data, className, onHide, Icon, dropdownStyle, dropdownAlign } = props;
  
  const renderItem = (item, index) => {
    return (<Option key={index} value={item?.value}>{item.label}</Option>);
  }

  const onDropdownVisibleChange = show => {
    if(!show) onHide && onHide();
  }

  return (
    <AntSelect
      className={className}
      onChange={setValue}
      showSearch={false}
      value={value}
      mode='multiple'
      menuItemSelectedIcon={<BsCheckLg />}
      onDropdownVisibleChange={onDropdownVisibleChange}
      maxTagCount={0}
      dropdownStyle={dropdownStyle}
      dropdownAlign={dropdownAlign}
      showArrow={true}
      suffixIcon={<Icon />}
      maxTagPlaceholder=''>
      {data?.map(renderItem)}
    </AntSelect>
  );
}

export function InvtSelect(props){
  const { value, setValue, placeholder, data, s_value, s_descr, className, classBack, classLabel, label, onFocus, loading, isIndex, onHide, Icon,
    dropdownStyle, dropdownAlign, text, onSearch } = props;
  const { t } = useTranslation();
  
  const renderItem = (item, index) => {
    return (<Option key={index} value={isIndex ? index : item?.msInventory[s_value ?? 'value']}>{item?.msInventory[s_descr ?? 'label']}</Option>);
  }

  const onDropdownVisibleChange = show => {
    if(!show) onHide();
  }

  const tagRender = (props) => {
    const { label, closable, onClose  } = props;

    const onPreventMouseDown = (e) => {
      e.preventDefault();
      e.stopPropagation();
    };
    return (
      <Tag onMouseDown={onPreventMouseDown} closable={closable} onClose={onClose} style={{ marginInlineEnd: 2}}>
        {label}
      </Tag>
    );
  }

  const empty = t(text?.length > 3 ? 'page.no_filter' : 'inventory.morethan');


  return (
    <div className={classBack}>
      {Icon && <Icon />}
      {label && <p className={classLabel ?? 'p_select_lbl'}>{label}</p>}
      <AntSelect
        className={className}
        showSearch allowClear
        filterOption={(input, option) => option.children?.toLowerCase().indexOf(input.toLowerCase()) >= 0}
        onChange={setValue}
        value={value}
        loading={loading}
        onFocus={onFocus}
        mode='multiple'
        dropdownStyle={dropdownStyle}
        dropdownAlign={dropdownAlign}
        menuItemSelectedIcon={<BsCheckLg />}
        onDropdownVisibleChange={onDropdownVisibleChange}
        onSearch={onSearch}
        notFoundContent={empty}
        maxTagCount={'responsive'}
        tagRender={tagRender}
        placeholder={placeholder}>
        {data?.map(renderItem)}
      </AntSelect>
    </div>
  );
}