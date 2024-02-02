import React, { useEffect, useState } from 'react';
import { Select, message } from 'antd';
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
      <p className='cs_name'>{item?.name ?? item?.descr ?? item?.firstName}</p>
    </div>
  );
}

export function ItemSelect(props){
  const { search, setSearch, data, setData, newItem, number } = props;
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
      let api = 'Site/GetConsumer?Descr=' + value;
      let response = await dispatch(getList(user, token, api))
      if(response?.error) setSearch({ value: null, error: response?.error });
      else setItems(response?.data);
      setLoading(false);
    }
  }

  const onSelect = value => {
    let consumer = items[value?.value];
    let exists = data?.findIndex(d => d.consumerId === consumer?.consumerId);
    if(exists === -1){
      let item = newItem(consumer);
      if(data?.length < number?.value) setData(old => [...old, item]);
      else setSearch({ value: null, error: t('coupon.number_max') });
    } else {
      setSearch({ value: null, error: t('coupon.already_added') });
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
    let optItem = { name: item?.firstName };
    return (
      <Option key={index} value={index} name={optItem?.firstName}>
        <SelectItem item={optItem} />
      </Option>
    );
  }

  const filterOption = (input, option) => {
    return option?.firstName?.toLowerCase().indexOf(input.toLowerCase()) >= 0 >= 0
  }

  const selectProps = { value: search, setValue: onSelect, placeholder: t('coupon.search'), data: items,
    className: 'kit_select', classBack: 'kit_search', onFocus, renderItem, filterOption, onSearch: setText, text,
    setData: setItems };

  return (
    <Overlay loading={loading}>
      <CustomSelect {...selectProps} />
    </Overlay>
  );
}