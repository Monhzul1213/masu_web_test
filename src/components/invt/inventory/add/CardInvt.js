import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useTable, usePagination, useRowSelect, useSortBy } from 'react-table';
import { withSize } from 'react-sizeme';

import { PaginationTable, Table, DynamicBSIcon, Money } from '../../../all';
import { SwitchLabel } from './SwitchLabel';
import { ItemSelect, SelectItem } from './SelectItem';
import { EditableCell } from './EditableCell';

export function Card(props){
  const { isKit, setIsKit, isTrack, setIsTrack, data, setData, setEdited, setCost, search, setSearch, total, setTotal, setDKits, size } = props;
  const { t, i18n } = useTranslation();
  const [columns, setColumns] = useState([]);

  useEffect(() => {
    setColumns([
      {
        Header: t('inventory.t_comp'), accessor: 'name',
        Cell: ({ row }) => (<SelectItem item={row?.original} />)
      },
      { Header: <div style={{textAlign: 'right'}}>{t('inventory.t_qty')}</div>, accessor: 'qty', isQty: true,
        customStyle: { width: 100, paddingRight: 18 }, width: 80 },//, autoFocus: true
      {
        Header: <div style={{textAlign: 'right'}}>{t('inventory.cost')}</div>, accessor: 'cost', isMoney: true, customStyle: { width: 100 },
        // Cell: ({ value }) => <div style={{textAlign: 'right', paddingRight: 18}}><Money value={value} fontSize={14} /></div>,
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
    if(row?.original?.kitId || row?.original?.kitId === 0) setDKits(old => [...old, row?.original]);
    let newTotal = total - (row?.original?.cost ?? 0);
    setTotal(newTotal);
    setCost({ value: newTotal });
    setData(data?.filter(item => item?.invtId !== row?.original?.invtId));
    setSearch({ value: null });
  }

  const updateMyData = (rowIndex, columnId, value, e) => {
    e?.preventDefault();
    let total = 0;
    setData(old => old.map((row, index) => {
      if(index === rowIndex){
        let qty = columnId === 'qty' ? parseFloat(value ? value : 0) : old[rowIndex]?.qty;
        let cost = columnId === 'cost' ? parseFloat(value ? value : 0) : old[rowIndex]?.unitCost;
        let totalCost = qty * cost;
        total += totalCost;
        return { ...old[rowIndex], qty, cost, totalCost };
      } else {
        total += row.totalCost;
        return row;
      }
    }));
    setTotal(total);
    setCost({ value: total });
    setEdited && setEdited(true);
    setSearch({ value: null });
  }

  const onChangeKit = value => {
    setIsKit(value);
    setCost({ value: value ? total : 0 });
    setSearch({ value: null });
  }

  const newItem = invt => {
    return { invtId: invt.invtId, name: invt.name, qty: 0, cost: 0, unitCost: invt.cost };
  }

  const classPage = size?.width > 510 ? 'ii_page_row_large' : 'ii_page_row_small';

  const isPackProps = { value: isKit, setValue: onChangeKit, label: t('inventory.is_pack') };
  const isTrackProps = { value: isTrack, setValue: setIsTrack, label: t('inventory.is_track') };
  const maxHeight = 'calc(100vh - var(--header-height) - var(--page-padding) * 4 - 150px - var(--pg-height))';
  const defaultColumn = { Cell: EditableCell };
  const tableInstance = useTable({ columns, data, defaultColumn, autoResetPage: false, initialState: { pageIndex: 0, pageSize: 25 }, updateMyData, onClickDelete },
    useSortBy, usePagination, useRowSelect);
  const tableProps = { tableInstance };
  const selectProps = { search, setSearch, data, setData, newItem };

  return (
    <div className='ia_back'>
      <p className='ac_title'>{t('inventory.title')}</p>
      <SwitchLabel {...isPackProps} />
      {!isKit && false && <SwitchLabel {...isTrackProps} />}
      {!isKit ? null : <>
        <div id='paging' style={{overflowY: 'scroll', maxHeight}}>
          <Table {...tableProps} />
        </div>
        <ItemSelect {...selectProps} />
        <div className={classPage}>
          <PaginationTable {...tableProps} />
          <p className='ac_page_total'>{t('inventory.total_cost')} : <Money value={total} fontSize={13} /></p>
        </div>
      </>}
    </div>
  );
}

const withSizeHOC = withSize();
export const CardInvt = withSizeHOC(Card);