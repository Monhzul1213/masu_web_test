import React, { useEffect, useState } from 'react';
import { Select } from 'antd';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';

import { useDebounce } from '../../../../../helpers';
import { getList } from '../../../../../services';
import { Overlay } from '../../../../../components/all';
import { ComSelect } from '../../../all/all_m/Select';
const { Option } = Select;

export function SelectItem(props){
  const { item } = props;

  return (
    <div className='cs_item'>
      <p className='cs_name'>{item?.acctName}</p>
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
  const disabled = false

  useEffect(() => {
    getData();
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  
  const getData = async () => {
    setLoading(true);
    setSearch({ value: null });
    let api = 'Txn/GetAccount' //[{ fieldName: "Name", value }, { fieldName: "SiteID", value: siteId?.value }, {fieldName : 'GetVariant', value : "Y"}];
    let response = await dispatch(getList(user, token, api ))
    if(response?.error) setSearch({ value: null, error: response?.error });
    else setItems(response?.data?.acct);
    setLoading(false);
  }

  const onSelect = value => {
    let acct = items[value?.value];
    let exists = data?.findIndex(d => d.accountID === acct?.accountId);
    if(exists === -1){
      let item = newItem(acct);
      setData(old => [...old, item]);
      setSearch({ value: null});
    } else {
      setSearch({ value: null, error: t('journal.already_added') });
    }
  }

  const renderItem = (item, index) => {
    let optItem = { acctName: item?.acctName, acctCode: item?.acctCode };
    return (
      <Option key={index} value={index} acctCode={optItem?.acctCode} acctName={optItem?.acctName}>
        <SelectItem item={optItem} />
      </Option>
    );
  }

  const filterOption = (input, option) => {
    return option?.acctName?.toLowerCase().indexOf(input.toLowerCase()) >= 0
  }

  const selectProps = { value: search, setValue: onSelect, placeholder: t('journal.warning_item'), data: items, onFocus: getData,
    className: 'kit_select', classBack: 'kit_search', renderItem, filterOption, onSearch: setText, text, disabled };

  return (
    <Overlay loading={loading}>
      <ComSelect {...selectProps} />
    </Overlay>
  );
}