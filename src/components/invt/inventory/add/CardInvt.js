import React, { useState, useEffect } from 'react';
import { Select } from 'antd';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';
import { useTable, usePagination, useRowSelect, useSortBy } from 'react-table';

import { getList } from '../../../../services';
import { formatNumber } from '../../../../helpers';
import { PaginationTable, Table, CustomSelect, Warning, DynamicBSIcon } from '../../../all';
import { SwitchLabel } from './SwitchLabel';
import { SelectItem } from './SelectItem';
const { Option } = Select;

export function CardInvt(props){
  const { isKit, setIsKit, isTrack, setIsTrack, data, setData, setError } = props;
  const { t, i18n } = useTranslation();
  const [columns, setColumns] = useState([]);
  const [search, setSearch] = useState(null);
  const [items, setItems] = useState([]);
  const [open, setOpen] = useState(false);
  const [total, setTotal] = useState(0);
  const { user, token }  = useSelector(state => state.login);
  const dispatch = useDispatch();

  useEffect(() => {
    setColumns([
      {
        Header: t('inventory.t_comp'), accessor: 'name',
        Cell: ({ row, value }) => (<SelectItem item={row?.original} />)
      },
      { Header: t('inventory.t_qty'), accessor: 'qty' },
      { Header: t('inventory.cost'), accessor: 'cost' },
      { id: 'delete', noSort: true, Header: '',
        Cell: ({ row }) => (<div className='ac_delete_back'><DynamicBSIcon name='BsTrashFill' className='ac_delete' onClick={() => onClickDelete(row)} /></div> )
      },
    ]);
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [i18n?.language]);

  const onClickDelete = row => {
    setData(data?.filter(item => item?.invtId !== row?.original?.invtId));
  }

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

  const renderItem = (item, index) => {
    return (<Option key={index} value={index}><SelectItem item={item} /></Option>);
  }

  const isPackProps = { value: isKit, setValue: setIsKit, label: t('inventory.is_pack') };
  const isTrackProps = { value: isTrack, setValue: setIsTrack, label: t('inventory.is_track') };
  const maxHeight = 'calc(100vh - var(--header-height) - var(--page-padding) * 4 - 150px - var(--pg-height))';
  // const tableInstance = useTable({ columns, data: kits, defaultColumn, autoResetPage: false, initialState: { pageIndex: 0, pageSize: 25 }, updateMyData },
  const tableInstance = useTable({ columns, data, autoResetPage: false, initialState: { pageIndex: 0, pageSize: 25 } },
    useSortBy, usePagination, useRowSelect);
  const tableProps = { tableInstance };
  const selectProps = { value: search, setValue: onSelect, placeholder: t('inventory.search'), data: items,
    className: 'kit_select', classBack: 'kit_search', onFocus, renderItem };
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
        <CustomSelect {...selectProps} />
        <div className='ac_paging'>
          <PaginationTable {...tableProps} />
          <p className='ac_page_total'>{t('inventory.total_cost')}: ₮{formatNumber(total)}</p>
        </div>
      </>}
    </div>
  );
}