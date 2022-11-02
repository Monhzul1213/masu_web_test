import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';
import { useTable, usePagination, useRowSelect, useSortBy } from 'react-table';

import { getList } from '../../../../services';
import { PaginationTable, Table, PlainSelect, Warning } from '../../../all';
import { SwitchLabel } from './SwitchLabel';

export function CardInvt(props){
  const { isKit, setIsKit, isTrack, setIsTrack, data, setData, setError } = props;
  const { t, i18n } = useTranslation();
  const [columns, setColumns] = useState([]);
  const [search, setSearch] = useState(null);
  const [items, setItems] = useState([]);
  const [open, setOpen] = useState(false);
  const { user, token }  = useSelector(state => state.login);
  const dispatch = useDispatch();

  useEffect(() => {
    setColumns([
      {
        Header: t('inventory.t_comp'), accessor: 'name',
        Cell: ({ row, value }) => (
          <div>{value}SKU{row?.original?.sku}</div>
        )
      },
      { Header: t('inventory.t_qty'), accessor: 'qty' },
      { Header: t('inventory.cost'), accessor: 'cost' },
    ]);
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [i18n?.language]);

  const onFocus = async () => {
    if(!items?.length){
      setError(null);
      const response = await dispatch(getList(user, token, 'Inventory/GetInventory'));
      if(response?.error) setError(response?.error);
      else setItems(response?.data);
    }
  }

  const onSelect = value => {
    let invt = items[value];
    let exists = data?.findIndex(d => d.invtId === invt?.invtId);
    if(exists === -1){
      let item = { invtId: invt.invtId, name: invt.descr, qty: 0, cost: 0 };
      setData(old => [...old, item]);
    } else setOpen(true);
    setSearch(null);
  }

  const isPackProps = { value: isKit, setValue: setIsKit, label: t('inventory.is_pack') };
  const isTrackProps = { value: isTrack, setValue: setIsTrack, label: t('inventory.is_track') };
  const maxHeight = 'calc(100vh - var(--header-height) - var(--page-padding) * 4 - 150px - var(--pg-height))';
  // const tableInstance = useTable({ columns, data: kits, defaultColumn, autoResetPage: false, initialState: { pageIndex: 0, pageSize: 25 }, updateMyData },
  const tableInstance = useTable({ columns, data, autoResetPage: false, initialState: { pageIndex: 0, pageSize: 25 } },
    useSortBy, usePagination, useRowSelect);
  const tableProps = { tableInstance };
  const selectProps = { value: search, setValue: onSelect, placeholder: t('inventory.search'), data: items, s_value: 'invtId', s_descr: 'descr', 
    className: 'kit_select', classBack: 'kit_search', onFocus, isIndex: true };
  const warningProps = { open, close: () => setOpen(false), text: 'inventory.already_added' };
 
  return (
    <div className='ac_back'>
      <Warning {...warningProps} />
      <p className='ac_title'>{t('inventory.title')}</p>
      <SwitchLabel {...isPackProps} />
      {!isKit && false && <SwitchLabel {...isTrackProps} />}
      {!isKit ? null : <>
        <div id='paging' style={{overflowY: 'scroll', maxHeight}}>
          <Table {...tableProps} />
        </div>
        <PlainSelect {...selectProps} />
        <PaginationTable {...tableProps} />
      </>}
    </div>
  );
}