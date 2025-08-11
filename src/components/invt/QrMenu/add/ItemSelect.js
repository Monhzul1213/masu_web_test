import React, { useEffect, useState } from 'react';
// import { Select } from 'antd';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';
import { useDebounce } from '../../../../helpers';
import { sendRequest } from '../../../../services';
import { CustomSelect, Overlay } from '../../../all';
import { SelectItem } from '../../../invt/inventory/add/SelectItem';

export function ItemSelect({search,setSearch,data,setData,newItem,siteId,disabled = false}) 
{
  const { t } = useTranslation();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [text, setText] = useDebounce();
  const { user, token } = useSelector((state) => state.login);
  const dispatch = useDispatch();

  useEffect(() => {
    if (text && text.length > 2) {
      getData(text);
    }
  }, [text]);

  const getData = async (value) => {
    setLoading(true);
    setSearch({ value: null });

    const filter = [
      { fieldName: 'Name', value },
      { fieldName: 'GetVariant', value: 'Y' },
    ];

    if (siteId) {
      filter.push({ fieldName: 'SiteID', value: siteId });
    }

    const res = await dispatch(
      sendRequest(user, token, 'Inventory/GetInventory/Custom', filter)
    );

    setLoading(false);

    if (res?.error) {
      setSearch({ value: null, error: res.error });
    } else {
      setItems(res.data || []);
    }
  };

  const onSelect = (value) => {
    const item = items.find(i => i?.msInventory?.invtId === value?.value);
    const invt = item?.msInventory;
    if (!invt) return;

    const exists = data?.some((d) => d.invtId === invt.invtId);
    if (exists) {
      setSearch({ value: null, error: t('inventory.already_added') });
      return;
    }

    const newRow = {
      ...newItem(invt),
      status: 1,
      statusName: 'Идэвхтэй',
    };

    setData((prev) => [...prev, newRow]);
    setSearch({ value: null });
  };

  const renderItem = (item) => {
    const invt = item?.msInventory;
    return (
      <option key={invt?.invtId} value={invt?.invtId} name={invt?.name} sku={invt?.sku}>
        <SelectItem item={{ name: invt?.name, sku: invt?.sku }} />
      </option>
    );
  };

  const filterOption = (input, option) =>
    option?.name?.toLowerCase().includes(input.toLowerCase()) ||
    option?.sku?.toLowerCase().includes(input.toLowerCase());

  return (
    <Overlay loading={loading}>
      <CustomSelect  value={search}
        setValue={onSelect}
        placeholder={t('inventory.search')}
        data={items}
        className="kit_select"
        classBack="kit_search"
        renderItem={renderItem}
        filterOption={filterOption}
        onSearch={setText}
        text={text}
        setData={setItems}
        disabled={disabled}
      />
    </Overlay>
  );
}
