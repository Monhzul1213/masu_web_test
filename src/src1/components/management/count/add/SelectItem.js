import React, { useEffect, useState } from 'react';
import { Select } from 'antd';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';

import { useDebounce } from '../../../../../helpers';
import { getList } from '../../../../../services';
import { CustomSelect, Overlay } from '../../../../../components/all';
import { SelectItem } from '../../../../../components/invt/inventory/add/SelectItem';
const { Option } = Select;

export function ItemSelect(props){
  const { search, setSearch, data, setData, newItem, disabled } = props;
  const { t } = useTranslation();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [text, setText] = useDebounce();
  const { user, token }  = useSelector(state => state.login);
  const dispatch = useDispatch();

  useEffect(() => {
    getData(text);
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text]);

  const getData = async value => {
    // if(value){
      setLoading(true);
      setSearch({ value: null });
      const api = `Integration/GetInventoryList?Descr=${encodeURIComponent(value)}`;
      let response = await dispatch(getList(user, token, api))
      if(response?.error) setSearch({ value: null, error: response?.error });
      else {
        response?.data?.forEach(item => {
          item.name = item?.descr;
          item.itemStatus = 0;
          item.countQty= item?.qty ? item?.qty : 0
          item.siteQty= item?.qty ? item?.qty : 0
          item.origCost= item?.cost ? item?.cost : 0
          // item.itemType= 'RC'
          item.picountItemId= 0
          item.invtID = item?.invtId
          item.notes= ''
          item.rowStatus = 'I'
        })
        setItems(response?.data);
      }
      setLoading(false);
    // }
  }

  const onSelect = value => {
    let invt = items[value?.value];
    let exists = data?.findIndex(d => d.invtId === invt?.invtId);
    if(exists === -1){
      let item = newItem(invt);
      setData(old => [...old, item]);
      setSearch({ value: null });
    } else {
      setSearch({ value: null, error: t('inventory.already_added') });
    }
  }

  const renderItem = (item, index) => {
    let optItem = { name: item?.name, sku: item?.sku };
    return (
      <Option key={index} value={index} name={optItem?.name} sku={optItem?.sku}>
        <SelectItem item={optItem} />
      </Option>
    );
  }

  const filterOption = (input, option) => {
    return option?.name?.toLowerCase().indexOf(input.toLowerCase()) >= 0 || option?.sku?.toLowerCase().indexOf(input.toLowerCase()) >= 0
  }

  const selectProps = { value: search, setValue: onSelect, placeholder: disabled ? t('transfer.warning_item') : t('inventory.search'), data: items,
    className: 'kit_select', classBack: 'kit_search', renderItem, filterOption, onSearch: setText, text, setData: setItems, disabled};

  return (
    <Overlay loading={loading}>
      <CustomSelect {...selectProps} />
    </Overlay>
  );
}