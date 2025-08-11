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
    <div className='cs_item' style={{display: 'flex', flexFlow: 'row', borderBottom: '1px solid #f2f2f2', height: 25}}>
      <p className='cs_name' style={{width: 150 }}>{item?.acctCode}</p>
      <p className='cs_name'style={{width: 500 }} >{item?.acctName}</p>
      <p className='cs_name'>{item?.accTypeName}</p>
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
    else {
      response?.data?.acct?.forEach(item=> {
        item.name = item?.acct + "-" + item?.acctName + "-" + item?.accTypeName
      })
      setItems(response?.data?.acct);
    }
    setLoading(false);
  }


  const onSelect = value => {
    let acct = items[value?.value];
    let exists = data?.findIndex(d => d.acct === acct?.acct);
    if(exists === -1){
      let item = newItem(acct);
      setData(old => [...old, item]);
      setSearch({ value: null});
    } else {
      setSearch({ value: null, error: t('journal.already_added') });
    }
  }

  const renderItem = (item, index) => {
    let optItem = { acctName: item?.acctName, acctCode: item?.acct, accTypeName: item?.accTypeName };
    return (
      <Option key={index} value={index} acctCode={optItem?.acctCode} acctName={optItem?.acctName} name={item?.name}>
        <SelectItem item={optItem} />
      </Option>
    );
  }

  const filterOption = (input, option) => {
    return option?.name?.toLowerCase().indexOf(input.toLowerCase()) >= 0
  }

  const selectProps = { value: search, setValue: onSelect, placeholder: t('journal.warning_item'), data: items, onFocus: getData,
    className: 'kit_select', classBack: 'kit_search', renderItem, filterOption, onSearch: setText, text, disabled };

  return (
    <Overlay loading={loading}>
      <ComSelect {...selectProps} />
    </Overlay>
  );
}