import React, { useEffect, useState } from 'react';
import { Select } from 'antd';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';

import { useDebounce } from '../../../../../helpers';
import { sendRequest } from '../../../../../services';
import { CustomSelect, Overlay } from '../../../all/all_m';
import { SelectItem } from '../../../../../components/invt/inventory/add/SelectItem';
const { Option } = Select;

export function ItemSelect(props){
  const { search, setSearch, data, setData, newItem, siteId, status } = props;
  const { t } = useTranslation();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [text, setText] = useDebounce();
  const { user, token }  = useSelector(state => state.login);
  const dispatch = useDispatch();
  const disabled = siteId?.value ? false : true;

  useEffect(() => {
    getData(text);
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text]);

  const getData = async value => {
    if(value?.length > 3){
      setLoading(true);
      setSearch({ value: null });
      let filter = [{ fieldName: "Name", value }, { fieldName: "SiteID", value: siteId?.value }];
      let response = await dispatch(sendRequest(user, token, 'Inventory/GetInventory/Custom', filter))
      if(response?.error) setSearch({ value: null, error: response?.error });
      else setItems(response?.data);
      setLoading(false);
    }
  }

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

  const selectProps = { value: search, setValue: onSelect, placeholder: disabled ? t('transfer.warning_item') : t('inventory.search'), data: items,
    className: 'kit_select', classBack: 'kit_search', renderItem, filterOption, onSearch: setText, text, setData: setItems, disabled: status?.value !== 0 };

  return (
    <Overlay loading={loading}>
      <CustomSelect {...selectProps} />
    </Overlay>
  );
}