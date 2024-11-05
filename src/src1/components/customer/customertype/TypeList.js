import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useTable, usePagination, useRowSelect, useSortBy } from 'react-table';

import { Check, Money, Table } from '../../../../components/all';
import { EditableCell } from '../../../../components/invt/inventory/add/EditableCell';
import { ModalSales } from './ModalSales';
import { ModalWhole } from './ModalWhole';


export function TypeList(props){
  const { data, size, setData, setEdited} = props;
  const { t, i18n } = useTranslation();
  const [columns, setColumns] = useState([]);
  const [visibleSales, setVisibleSales] = useState(false);
  const [visibleWhole, setVisibleWhole] = useState(false);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    const style1 = {margin: 0, borderBottomStyle: 'solid ',borderBottomWidth: 1, borderBottomColor: 'var(--line-color)'};
    setColumns([
      { Header: t('inventory.title'), accessor: 'invtName', customStyle: {minWidth: 180}, isText: true},
      { Header: t('inventory.barcode'), accessor: 'barCode', isText: true},
      { Header: t('inventory.category'), accessor: 'categoryName', customStyle: {minWidth: 150}, isText: true},
      { Header: <div style={{textAlign: 'right'}}>{t('inventory.cost')}</div>, accessor: 'cost', customStyle: {minWidth: 80},
        Cell: props => <div style={{textAlign: 'right', paddingRight: 15}}><Money value={props?.value} fontSize={14} /></div>},
        { Header: <div style={{textAlign: 'right'}}>{t('customer.standardPrice')}</div>, accessor: 'standardPrice', customStyle: {minWidth: 100},
        Cell: props => <div style={{textAlign: 'right', paddingRight: 15}}><Money value={props?.value} fontSize={14} /></div>},
        { Header: <div style={{textAlign: 'right'}}>{t('customer.price')}</div>, accessor: 'price', width: 120, isMoney: true},
      {
        id: 'salesprice', isBtn: true, customStyle: { width: 200 },
        Header: <div style={{textAlign: 'right'}}>{t('inventory.t_salesprice')}</div>,
        Cell: ({ row, onClickSales }) => {
          // let checked = row?.original?.useSalesPrice === 'Y';
          return (
            <div style={{ display: 'flex', flexFlow: 'row', alignItems: 'center', textAlign: 'right', width: 180 }}>
              <div style={{marginRight: 10, flex: 1, marginTop: 3}} onClick={e => onClickSales(e, row)}>
                <p style={style1}>
                  <Money value={row?.original?.salesPrice} fontSize={14} />
                  <span>{row?.original?.salesLabel}</span>
                </p>
              </div>
            </div>
          );
        }
      },
      {
        id: 'wholeprice', isBtn: true, customStyle: { width: 200 },
        Header: <div style={{textAlign: 'right'}}>{t('inventory.t_wholeprice')}</div>,
        Cell: ({ row, onClickWhole }) => {
          return (
            <div style={{ display: 'flex', flexFlow: 'row', alignItems: 'center', textAlign: 'right', width: 130 }}>
              {/* <Check checked={checked} onClick={e => onClickWholeCheck(e, row, checked)} /> */}
              <div style={{marginRight: 10, flex: 1, marginTop: 3}} onClick={e => onClickWhole(e, row)}>
                <p style={style1}>
                  <Money value={row?.original?.wholePrice} fontSize={14} />
                  {row?.original?.wholeQty ? (' (' + row?.original?.wholeQty + ')') : ''}
                </p>
              </div>
            </div>
          );
        }
      },
        // { Header: <div style={{textAlign: 'right'}}>{t('inventory.t_salesprice')}</div>, width: 120, accessor: 'salesPrice', isMoney: true},
        // { Header: <div style={{textAlign: 'right'}}>{t('inventory.t_wholeprice')}</div>, width: 100, accessor: 'wholePrice', isMoney: true},
    ]);
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [i18n?.language,]);

  // const onClickSalesCheck = (e, item, checked) => {
  //   e?.preventDefault();
  //   // if(item?.original?.checked){
  //     setEdited && setEdited(true);
  //     if(checked){
  //       setData(old => old.map((row, index) => {
  //         if(index === item?.index)
  //           return { ...old[item?.index], useSalesPrice: checked ? 'N' : 'Y', salesPrice: 0, salesLabel: "", salesTimeLimited: "N" };
  //         else
  //           return row
  //       }));
  //     } else {
  //       setVisibleSales(true);
  //       setSelected(item);
  //     }
  //   // }
  // }

  const onClickSales = (e, item) => {
    e?.preventDefault();
    if(item?.original){
      setEdited && setEdited(true);
      setVisibleSales(true);
      setSelected(item);
    }
  }

  // const onClickWholeCheck = (e, item, checked) => {
  //   e?.preventDefault();
  //   if(item?.original?.checked){
  //     setEdited && setEdited(true);
  //     if(checked){
  //       setData(old => old.map((row, index) => {
  //         if(index === item?.index) return { ...old[item?.index], useWholePrice: checked ? 'N' : 'Y', wholePrice: 0, wholeQty: 0 };
  //         return row
  //       }));
  //     } else {
  //       setVisibleWhole(true);
  //       setSelected(item);
  //     }
  //   }
  // }

  const onClickWhole = (e, item) => {
    e?.preventDefault();
    if(item?.original){
      setEdited && setEdited(true);
      setVisibleWhole(true);
      setSelected(item);
    }
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

  const maxHeight = size?.width > 380
  ? 'calc(100vh - var(--header-height) - var(--page-padding) * 3 - 7px - 51px - 10px - 37px)'
  : 'calc(100vh - var(--header-height) - var(--page-padding) * 3 - 7px - 210px - 10px - 37px)';
  const defaultColumn = { Cell: EditableCell };
  const tableInstance = useTable( { columns, data, defaultColumn, autoResetPage: false,  initialState: { pageIndex: 0, pageSize: 1000000 , sortBy: [{ id: 'salesDate', desc: true }]},
  updateMyData, onClickSales, onClickWhole }, useSortBy, usePagination, useRowSelect);
  const tableProps = { tableInstance };
  const modalSalesProps = { visibleSales, closeSales, selected, data, setData };
  const modalWholeProps = { visibleWhole, closeWhole, selected, data, setData };

  return (
    <div >
      {visibleSales && <ModalSales {...modalSalesProps} />}
      {visibleWhole && <ModalWhole {...modalWholeProps} />}
      <div className='table_scroll' style={{overflow: 'scroll'}} >
        <div id='paging' style={{marginTop: 10, overflowY: 'scroll', maxHeight, minWidth : 900}}>
              <Table {...tableProps} />
        </div>
      </div>
      <p className='data_size_text'>{t('info.all') + data?.length}</p>
    </div>
  )
}