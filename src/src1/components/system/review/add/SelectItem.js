import React, { useEffect, useState } from 'react';
import { Select } from 'antd';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';
import { useDebounce } from '../../../../../helpers';
import { getList } from '../../../../../services';
import { CustomSelect, Overlay } from '../../../all/all_m';
const { Option } = Select;

export function SelectItem(props){
  const { item } = props;
  return (
    <div className='cs_item'>
      <p className='cs_name'>{item?.name ?? item?.descr }</p>
      {/* <p className='cs_sku'>{label } {item?.email}</p> */}
    </div>
  );
}

export function ItemSelect(props){
  const { search, setSearch, data, setData, newItem } = props;
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
    if(value?.length > 3){
      setLoading(true);
      setSearch({ value: null });
      let api = 'Merchant?merchname=' + (value ?? '');
      const response = await dispatch(getList(user, token, api));
      if(response?.error) setSearch({ value: null, error: response?.error });
      else setItems(response?.data);
      setLoading(false);
    }
  }

  const onSelect = value => {
    let cust = items[value?.value];
    let exists = data?.findIndex(d => d.merchantId === cust?.merchantId);
    if(exists === -1){
      let item = newItem(cust);
      setData(old => [...old, item]);
      setSearch({ value: null });
    } else {
      setSearch({ value: null, error: t('noti.already_added') });
    }
  }

  const onFocus = async () => {
    // if(!items?.length){
    //   setLoading(true);
    //   setSearch({ value: null });
    //   const response = await dispatch(getList(user, token, 'Inventory/GetInventory'));
    //   if(response?.error) setSearch({ value: null, error: response?.error });
    //   else setItems(response?.data);
    //   setLoading(false);
    // }
  }

  const renderItem = (item, index) => {
    let optItem = { name: item?.descr, merchantId: item?.merchantId };
    return (
      <Option key={index} value={index} name={optItem?.name} sku={optItem?.sku}>
        <SelectItem item={optItem} />
      </Option>
    );
  }

  const filterOption = (input, option) => {
    return option?.name?.toLowerCase().indexOf(input.toLowerCase()) >= 0 
  }

  const selectProps = { value: search, setValue: onSelect, placeholder: t('noti.search'), data: items,
    className: 'kit_select', classBack: 'kit_search', onFocus, renderItem, filterOption, onSearch: setText, text,
    setData: setItems };

  return (
    <Overlay loading={loading}>
      <CustomSelect {...selectProps} />
    </Overlay>
  );
}