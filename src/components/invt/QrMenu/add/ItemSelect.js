import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';
import { useDebounce } from '../../../../helpers';
import { getList } from '../../../../services';        
import { CustomSelect, Overlay } from '../../../all';
import { SelectItem } from '../../../invt/inventory/add/SelectItem';
 
const normalize = (s) => (s || '').toString().trim().toLowerCase();
const MIN_CHARS = 1;
 
export function ItemSelect({
  search,
  setSearch,
  data,
  setData,
  newItem,
  siteId,                
  disabled = false,
}) {
  const { t } = useTranslation();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
 
  const [text, setText] = useDebounce('', 300);
 
  const { user, token } = useSelector((state) => state.login);
  const dispatch = useDispatch();
 
  const currentQueryRef = useRef('');
  const seqRef = useRef(0);
  const cacheRef = useRef(new Map());
 
  const cacheFirst = useCallback((q) => {
    const key = normalize(q);
    if (cacheRef.current.has(key)) {
      setItems(cacheRef.current.get(key));
      return true;
    }
    for (let i = key.length - 1; i > 0; i--) {
      const shortKey = key.slice(0, i);
      if (cacheRef.current.has(shortKey)) {
        setItems(cacheRef.current.get(shortKey));
        return true;
      }
    }
    return false;
  }, []);
 
  useEffect(() => {
    const q = (text || '').trim();
    if (q.length < MIN_CHARS) {
      setItems([]);
      currentQueryRef.current = '';
      return;
    }
 
    const hitCache = cacheFirst(q);
    currentQueryRef.current = q;
    const mySeq = ++seqRef.current;
 
    (async () => {
      if (!hitCache) setLoading(true);
      setSearch({ value: null });
 
      try {
        const api = `Integration/GetInventoryList?Descr=${encodeURIComponent(q)}`;
        const res = await dispatch(getList(user, token, api));
 
        if (seqRef.current !== mySeq) return;
 
        if (res?.error) {
          setSearch({ value: null, error: res.error });
        } else {
          const rows = Array.isArray(res?.data) ? res.data : [];
          const list = rows.slice(0, 30).map((row) => {
            const invtId =
              row?.invtId ?? row?.InvtID ?? row?.InvtId ?? row?.INVTID ?? row?.invtID;
            const name =
              row?.name ?? row?.Name ?? row?.Descr ?? row?.DESCR ?? '';
            const sku =
              row?.sku ?? row?.Sku ?? row?.SKU ?? '';
 
            const msInventory = { invtId, name, sku };
 
            return {
              ...row,
              msInventory,
              _normName: normalize(name),
              _normSku: normalize(sku),
            };
          });
 
          setItems(list);
          cacheRef.current.set(normalize(q), list);
        }
      } catch (e) {
        if (seqRef.current === mySeq) {
          setSearch({ value: null, error: t('common.error') });
        }
      } finally {
        if (seqRef.current === mySeq) setLoading(false);
      }
    })();
  }, [text, siteId, dispatch, setSearch, token, t, user, cacheFirst]);
 
  const onSelect = useCallback(
    (value) => {
      const item = items.find((i) => i?.msInventory?.invtId === value?.value);
      const invt = item?.msInventory;
      if (!invt) return;
 
      if (data?.some((d) => d.invtId === invt.invtId)) {
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
    },
    [items, data, setData, setSearch, newItem, t]
  );
 
  const renderItem = useCallback((item) => {
    const invt = item?.msInventory;
    return (
      <option
        key={invt?.invtId}
        value={invt?.invtId}
        name={invt?.name}
        sku={invt?.sku}
      >
        <SelectItem item={{ name: invt?.name, sku: invt?.sku }} />
      </option>
    );
  }, []);
 
  const filterOption = useCallback((input, option) => {
    const q = normalize(input);
    if (!q) return true;
    const name = normalize(option?.name);
    const sku = normalize(option?.sku);
    return name.startsWith(q) || sku.startsWith(q);
  }, []);
 
  return (
    <Overlay loading={loading}>
      <CustomSelect
        value={search}
        setValue={onSelect}
        placeholder={`${t('inventory.search')}`}
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