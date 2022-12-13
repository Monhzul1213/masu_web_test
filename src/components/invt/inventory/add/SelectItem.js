import React, { useState } from 'react';
import { Select } from 'antd';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';

import { getList } from '../../../../services';
import { CustomSelect, Overlay } from '../../../all';
const { Option } = Select;

export function SelectItem(props){
  const { item, label } = props;

  return (
    <div className='cs_item'>
      <p className='cs_name'>{item?.name ?? item?.descr ?? item?.invtName}</p>
      <p className='cs_sku'>{label ?? 'SKU'} {item?.sku ?? item?.invtId}</p>
    </div>
  );
}

export function ItemSelect(props){
  const { search, setSearch, data, setData, newItem } = props;
  const { t } = useTranslation();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const { user, token }  = useSelector(state => state.login);
  const dispatch = useDispatch();

  const onSelect = value => {
    let invt = items[value?.value]?.msInventory;
    let exists = data?.findIndex(d => d.invtId === invt?.invtId);
    if(exists === -1){
      let item = newItem(invt);
      setData(old => [...old, item]);
      setSearch({ value: null });
    } else {
      setSearch({ value: null, error: t('inventory.already_added') });
    }
  }

  const onFocus = async () => {
    if(!items?.length){
      setLoading(true);
      setSearch({ value: null });
      const response = await dispatch(getList(user, token, 'Inventory/GetInventory'));
      if(response?.error) setSearch({ value: null, error: response?.error });
      else setItems(response?.data);
      setLoading(false);
    }
  }

  const renderItem = (item, index) => {
    let optItem = { name: item?.msInventory?.name, sku: item?.msInventory?.sku };
    return (
      <Option key={index} value={index} name={optItem?.name} sku={optItem?.sku}>
        <SelectItem item={optItem} />
      </Option>
    );
  }

  const filterOption = (input, option) => {
    return option?.name?.toLowerCase().indexOf(input.toLowerCase()) >= 0 || option?.sku?.toLowerCase().indexOf(input.toLowerCase()) >= 0
  }

  const selectProps = { value: search, setValue: onSelect, placeholder: t('inventory.search'), data: items,
    className: 'kit_select', classBack: 'kit_search', onFocus, renderItem, filterOption };

  return (
    <Overlay loading={loading}>
      <CustomSelect {...selectProps} />
    </Overlay>
  );
}