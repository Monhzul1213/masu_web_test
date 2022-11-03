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
import { EditableCell } from './EditableCell';
const { Option } = Select;

export function CardInvt(props){
  const { isKit, setIsKit, isTrack, setIsTrack, data, setData, setError, setEdited, setCost } = props;
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
        Cell: ({ row }) => (<SelectItem item={row?.original} />)
      },
      { Header: <div style={{textAlign: 'right'}}>{t('inventory.t_qty')}</div>, accessor: 'qty', isQty: true,
        customStyle: { width: 100, paddingRight: 18 }, width: 80 },
      {
        Header: <div style={{textAlign: 'right'}}>{t('inventory.cost')}</div>, accessor: 'cost', disabled: true, customStyle: { width: 100 },
        Cell: ({ value }) => <div style={{textAlign: 'right', paddingRight: 18}}>{formatNumber(value)}</div>,
      },
      { id: 'delete', noSort: true, Header: '', customStyle: { width: 40 },
        Cell: ({ row, onClickDelete }) =>
          (<div className='ac_delete_back'><DynamicBSIcon name='BsTrashFill' className='ac_delete' onClick={() => onClickDelete(row)} /></div>)
      },
    ]);
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [i18n?.language]);

  const onClickDelete = row => {
    let newTotal = total - (row?.original?.cost ?? 0);
    setTotal(newTotal);
    setCost({ value: newTotal });
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
      let item = { invtId: invt.invtId, name: invt.descr, qty: 0, cost: 0, unitCost: invt.cost };
      setData(old => [...old, item]);
    } else setOpen(true);
    setSearch(null);
  }

  const renderItem = (item, index) => {
    return (
      <Option key={index} value={index} name={item?.name ?? item?.descr} sku={(item?.sku ?? item?.invtId) + ''}>
        <SelectItem item={item} />
      </Option>
    );
  }

  const updateMyData = (rowIndex, columnId, value) => {
    let total = 0;
    setData(old => old.map((row, index) => {
      if(index === rowIndex){
        let cost = old[rowIndex]?.unitCost * parseFloat(value ? value : 0);
        total += cost;
        return { ...old[rowIndex], [columnId]: value, cost };
      } else {
        total += row.cost;
        return row;
      }
    }));
    setTotal(total);
    setCost({ value: total });
    setEdited && setEdited(true);
  }

  const filterOption = (input, option) => {
    return option?.name?.toLowerCase().indexOf(input.toLowerCase()) >= 0 || option?.sku?.toLowerCase().indexOf(input.toLowerCase()) >= 0
  }

  const onChangeKit = value => {
    setIsKit(value);
    setCost({ value: value ? total : 0 });
  }

  const isPackProps = { value: isKit, setValue: onChangeKit, label: t('inventory.is_pack') };
  const isTrackProps = { value: isTrack, setValue: setIsTrack, label: t('inventory.is_track') };
  const maxHeight = 'calc(100vh - var(--header-height) - var(--page-padding) * 4 - 150px - var(--pg-height))';
  const defaultColumn = { Cell: EditableCell };
  const tableInstance = useTable({ columns, data, defaultColumn, autoResetPage: false, initialState: { pageIndex: 0, pageSize: 25 }, updateMyData, onClickDelete },
    useSortBy, usePagination, useRowSelect);
  const tableProps = { tableInstance };
  const selectProps = { value: search, setValue: onSelect, placeholder: t('inventory.search'), data: items,
    className: 'kit_select', classBack: 'kit_search', onFocus, renderItem, filterOption};
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