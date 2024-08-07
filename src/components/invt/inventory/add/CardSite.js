import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useTable, usePagination, useRowSelect, useSortBy } from 'react-table';

import { Check, CheckAll, Money, PaginationTable, Table } from '../../../all';
import { EditableCell } from './EditableCell';
import { ModalSales } from './ModalSales';
import { ModalWhole } from './ModalWhole';

export function CardSite(props){
  const { isTrack, data, setData, setEdited, checked, setChecked } = props;
  const { t, i18n } = useTranslation();
  const [columns, setColumns] = useState([]);
  const [visibleSales, setVisibleSales] = useState(false);
  const [visibleWhole, setVisibleWhole] = useState(false);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    const style = { display: 'flex', alignItems: 'center', justifyContent: 'center', maxWidth: 72 };
    const style1 = { display: 'flex', alignItems: 'center', justifyContent: 'center', maxWidth: 122 };
    let columns = [
      {
        id: 'check', noSort: true, isBtn: true, customStyle: { width: 75 },
        Header: <div style={style}>{t('inventory.t_choose')}</div>,
        Cell: ({ row, onClickCheck }) => <div style={style}><Check checked={row?.original?.checked} onClick={e => onClickCheck(e, row)} /></div>,
      },
      { Header: <div style={{flex: 1}}>{t('inventory.t_site')}</div>, accessor: 'name', isText: true },
      {
        id: 'check1', noSort: true, isBtn: true, customStyle: { width: 125 },
        Header: <div style={style1}>{t('inventory.t_nhat')}</div>,
        Cell: ({ row, onClickNHAT }) => {
          let checked = row?.original?.useNhat === 'Y';
          return (<div style={style}><Check checked={checked} onClick={e => onClickNHAT(e, row, checked)} /></div>);
        }
      },
      { Header: <div style={{textAlign: 'right'}}>{t('inventory.t_price')}</div>, accessor: 'price', noSort: true, isMoney: true,
        customStyle: { width: 100 }, width: 100 },
      {
        id: 'salesprice', noSort: true, isBtn: true, customStyle: { width: 360 },
        Header: <div style={style1}>{t('inventory.t_salesprice')}</div>,
        Cell: ({ row, onClickSalesCheck, onClickSales }) => {
          let checked = row?.original?.useSalesPrice === 'Y';
          return (
            <div style={{ display: 'flex', flexFlow: 'row', alignItems: 'center', width: 300 }}>
              <Check checked={checked} onClick={e => onClickSalesCheck(e, row, checked)} />
              <div style={{marginLeft: 8, flex: 1}} onClick={e => onClickSales(e, row)}>
                <p style={{margin: 0}}>
                  <Money value={row?.original?.salesPrice} fontSize={14} />
                  <span>{row?.original?.salesLabel}</span>
                </p>
              </div>
            </div>
          );
        }
      },
      {
        id: 'wholeprice', noSort: true, isBtn: true, customStyle: { width: 200 },
        Header: <div style={style1}>{t('inventory.t_wholeprice')}</div>,
        Cell: ({ row, onClickWholeCheck, onClickWhole }) => {
          let checked = row?.original?.useWholePrice === 'Y';
          return (
            <div style={{ display: 'flex', flexFlow: 'row', alignItems: 'center' }}>
              <Check checked={checked} onClick={e => onClickWholeCheck(e, row, checked)} />
              <div style={{marginLeft: 8, flex: 1}} onClick={e => onClickWhole(e, row)}>
                <p style={{margin: 0}}>
                  <Money value={row?.original?.wholePrice} fontSize={14} />
                  {row?.original?.wholeQty ? (' (' + row?.original?.wholeQty + ')') : ''}
                </p>
              </div>
            </div>
          );
        }
      },
    ];
    if(isTrack){
      columns.push({ Header: t('inventory.t_stock'), accessor: 'stock', noSort: true, isQty: true, width: 90 });
      columns.push({ Header: t('inventory.t_track'), accessor: 'track', noSort: true, isQty: true, width: 90 });
    }
    setColumns(columns);
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [i18n?.language, isTrack]);

  const onCheckAll = checked => {
    setChecked(checked);
    setEdited && setEdited(true);
    setData(old => old.map((row, index) => {
      return { ...old[index], checked };
    }));
  }

  const onClickCheck = (e, item) => {
    e?.preventDefault();
    setChecked(false);
    setEdited && setEdited(true);
    setData(old => old.map((row, index) => {
      if (index === item?.index) return { ...old[item?.index], checked: !row?.checked };
      return row
    }));
  }

  const onClickNHAT = (e, item, checked) => {
    e?.preventDefault();
    setEdited && setEdited(true);
    setData(old => old.map((row, index) => {
      if (index === item?.index) return { ...old[item?.index], useNhat: checked ? 'N' : 'Y' };
      return row
    }));
  }

  const onClickSalesCheck = (e, item, checked) => {
    e?.preventDefault();
    setEdited && setEdited(true);
    if(checked){
      setData(old => old.map((row, index) => {
        if(index === item?.index)
          return { ...old[item?.index], useSalesPrice: checked ? 'N' : 'Y', salesPrice: 0, salesLabel: "", salesTimeLimited: "N" };
        else
          return row
      }));
    } else {
      setVisibleSales(true);
      setSelected(item);
    }
  }

  const onClickSales = (e, item) => {
    e?.preventDefault();
    setEdited && setEdited(true);
    setVisibleSales(true);
    setSelected(item);
  }

  const onClickWholeCheck = (e, item, checked) => {
    e?.preventDefault();
    setEdited && setEdited(true);
    if(checked){
      setData(old => old.map((row, index) => {
        if(index === item?.index) return { ...old[item?.index], useWholePrice: checked ? 'N' : 'Y', wholePrice: 0, wholeQty: 0 };
        return row
      }));
    } else {
      setVisibleWhole(true);
      setSelected(item);
    }
  }

  const onClickWhole = (e, item) => {
    e?.preventDefault();
    setEdited && setEdited(true);
    setVisibleWhole(true);
    setSelected(item);
  }

  const updateMyData = (rowIndex, columnId, value, e) => {
    e?.preventDefault();
    setData(old => old.map((row, index) => {
      if(index === rowIndex){
        if(columnId === 'price') return { ...old[rowIndex], [columnId]: value, changed: true };
        return { ...old[rowIndex], [columnId]: value };
      }
      return row
    }));
    setEdited && setEdited(true);
  }

  const closeSales = () => {
    setVisibleSales(false);
    setSelected(null);
  }

  const closeWhole = () => {
    setVisibleWhole(false);
    setSelected(null);
  }
 
  const defaultColumn = { Cell: EditableCell };
  const checkProps = { type: 'inventory', checked, onCheckAll, style: {border: 'none'} };
  const tableInstance = useTable({ columns, data, defaultColumn, autoResetPage: false, initialState: { pageIndex: 0, pageSize: 25 },
    updateMyData, onClickCheck, onClickNHAT, onClickSalesCheck, onClickSales, onClickWholeCheck, onClickWhole }, useSortBy, usePagination, useRowSelect);
  const tableProps = { tableInstance };
  const maxHeight = 'calc(100vh - var(--header-height) - var(--page-padding) * 4 - 120px - var(--pg-height))';
  const modalSalesProps = { visibleSales, closeSales, selected, data, setData };
  const modalWholeProps = { visibleWhole, closeWhole, selected, data, setData };

  return (
    <div className='ia_back'>
      {visibleSales && <ModalSales {...modalSalesProps} />}
      {visibleWhole && <ModalWhole {...modalWholeProps} />}
      <p className='ac_title'>{t('inventory.sites')}</p>
      <div style={{padding: 5}} />
      <CheckAll {...checkProps} />
      <div className='table_scroll' style={{overflowX: 'scroll'}}>
        <div id='paging' style={{overflowY: 'scroll', maxHeight, minWidth: 860}}>
          <Table {...tableProps} />
        </div>
      </div>
      <PaginationTable {...tableProps} />
    </div>
  );
}