import React, { useEffect, useState } from "react";
import { Modal } from "antd";
// import { IoCheckbox, IoCheckboxOutline } from "react-icons/io5";
// import { createColumnHelper, getCoreRowModel, getSortedRowModel, useReactTable } from "@tanstack/react-table";
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';
import useMeasure from "react-use-measure";

import '../../../../../css/table.css';
import { getList } from "../../../../../services";
import { Button, ButtonRow, Check, Empty1, Error, Input1, ModalTitle, Money, MultiSelect, MultiSelect1, Overlay, TableRowResize } from "../../../../../components/all";

export function AddInventory(props){
  const { visible, setVisible, invoice, items, setItems, setError1 } = props;
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [loading1, setLoading1] = useState(false);
  const [error, setError] = useState(null);
  const [name, setName] = useState({ value: '' });
  const [width, setWidth] = useState(180);
  const [barCode, setBarCode] = useState({ value: '' });
  const [category, setCategory] = useState([]);
  const [categories, setCategories] = useState([]);
  const [data, setData] = useState([]);
  const [checked, setChecked] = useState(true);
  const [ref, bounds] = useMeasure();
  const { user, token }  = useSelector(state => state.login);
  const dispatch = useDispatch();
  const pgWidth = bounds?.width;

  useEffect(() => {
    if(visible) onSearch();
    return () => {};
  }, [visible]);

  useEffect(() => {
    onFocusCategory();
    return () => {};
  }, []);

  useEffect(() => {
    if(pgWidth >= 710) setWidth((pgWidth - 70) / 4);
    else if(pgWidth < 710 && pgWidth >= 540) setWidth((pgWidth - 60) / 3);
    else if(pgWidth < 540) setWidth((pgWidth - 50) / 2);
    return () => {};
  }, [pgWidth]);

  const onClickCancel = () => setVisible(false);

  const onFocusCategory = async () => {
    if(!categories?.length){
      setError(null);
      setLoading1(true);
      const response = await dispatch(getList(user, token, 'Inventory/GetCategory'));
      if(response?.error) setError(response?.error);
      else {
        setCategories(response?.data);
        setCategory(response?.data?.map(item => item.categoryId));
      }     
      setLoading1(false);
    }
  }

  const onSearch = async () => {
    let query = name?.value ? ('?InvtDescr=' + name?.value) : '?=';
    query += barCode?.value ? '&BarCode=' + barCode?.value : ''
    if(category?.length !== categories?.length) category?.forEach(item => query += '&CategoryID=' + item);
    setLoading(true);
    setError(null);
    let response = await dispatch(getList(user, token, 'Inventory/SelectInventory' + query));
    if(response?.error) setError(response?.error);
    else {
      response?.data?.forEach(list => {
        let check = items?.findIndex(it => it?.invtId === list?.invtId);
        if(check !== -1) list.checked = true;
      })
      setData(response?.data);
    }
    setLoading(false);
    setChecked(false);
  }

  const onClickSave = async () => {
    setLoading(true);
    let list = [];
    data?.forEach(li => { if(li?.checked) list.push(li); });
    if(!list?.length) setError(t('invoice.no_data'));
    else {
      setError(null);
      let li = [];
      list?.forEach(l => {
        let check = items?.findIndex(it => it?.invtId === l?.invtId);
        if(check === -1) li.push({...l, qty: 0, amount: 0, rowStatus: 'I', invoiceID: invoice?.invoiceID ?? invoice?.invoiceId ?? 0 });
      });
      setItems(old => [...old, ...li]);
      setError1 && setError1(null);
      setVisible(false);
    }
    setLoading(false);
  }

  const selectProps = { setError, width, className: 'card_input' };
  const listProps = { data, setData, checked, setChecked };

  return (
    <Modal title={null} footer={null} closable={false} open={visible} centered={true} width={790} transitionName=''>
      <Overlay loading={loading}>
        <div className='m_back' ref={ref}>
          <ModalTitle icon='MdAllInbox' title={t('inventory.add')} isMD={true} />
          <div className="gap2" />
          <div style={{ overflowY: 'scroll', maxHeight: 'calc(90vh - 105px)' }}>
            <div className="filter_wrap">
              <Input1 {...selectProps}
                placeholder={t('page.name')}
                value={name}
                setValue={setName} />
              <Input1 {...selectProps}
                placeholder={t('inventory.barcode')}
                value={barCode}
                setValue={setBarCode} />
              <MultiSelect1
                classBack='filter_select_back'
                className='filter_select'
                width={width}
                value={category}
                setValue={setCategory}
                data={categories}
                placeholder={t('invoice.choose_category')}
                label1={t('count.category')}
                loading={loading1}
                onFocus={onFocusCategory}
                s_value='categoryId' s_descr='categoryName' />
              <Button
                text={t('page.search')}
                width={width}
                className='card_btn'
                onClick={onSearch} />
            </div>
            {error && <Error error={error} id='m_error' />}
            {/* {data?.length ? <List {...listProps}/> : <Empty1 icon='MdAllInbox' />} */}
          </div>
        </div>
        <ButtonRow text2='inventory.t_choose' onClickCancel={onClickCancel} onClickSave={onClickSave} /> 
      </Overlay>
    </Modal>
  );
}

// function List(props){
//   const { data, setData, checked, setChecked } = props;
//   const { t, i18n } = useTranslation();
//   const columnHelper = createColumnHelper();
//   const [columns, setColumns] = useState([columnHelper.accessor('invtDescr', { header: t('inventory.title'), size: 120, minSize: 90 }),]);

//   useEffect(() => {
//     setColumns([
//       columnHelper.accessor('checked', {
//         id: 'select-col', size: 50, minSize: 50, maxSize: 50,
//         header: ({ table }) => (
//           <div className="cell_center">
//             <Check checked={table?.options?.meta?.checked} onClick={e => table?.options?.meta?.onClickCheckAll(e)} />
//           </div>
//         ),
//         cell: ({ row, table }) => (
//           <div className="cell_center" style={{ width: 45 }}>
//             <Check checked={row?.original?.checked} onClick={e => table?.options?.meta?.onClickCheck(e, row)} />
//           </div>
//         ),
//         enableSorting: false,
//       }),
//       columnHelper.accessor('invtDescr', { header: t('inventory.title'), size: 120, minSize: 90 }),
//       columnHelper.accessor('barCode', { header: t('inventory.barcode'), size: 100, minSize: 90 }),
//       columnHelper.accessor('categoryName', { header: t('inventory.category'), size: 100, minSize: 90 }),
//       columnHelper.accessor('cost', {
//         header: <div style={{textAlign: 'right'}}>{t('inventory.cost')}</div>,
//         cell: props => <div style={{textAlign: 'right', flex: 1, paddingRight: 15}}><Money value={props?.getValue()} fontSize={12} /></div>,
//       }),
//       columnHelper.accessor('price', {
//         header: <div style={{textAlign: 'right'}}>{t('inventory.price')}</div>,
//         cell: props => <div style={{textAlign: 'right', flex: 1, paddingRight: 15}}><Money value={props?.getValue()} fontSize={12} /></div>,
//       }),
//       columnHelper.accessor('isService', {
//         header: <div className="cell_center">{t('inventory.service')}</div>,
//         cell: ({ row, table }) => {
//           let checked = row?.original?.isService === 'Y';
//           return <div className="cell_center">{checked ? <IoCheckbox className="cell_check1" /> : <IoCheckboxOutline className="cell_check2" />}</div>;
//         },
//         enableSorting: false,
//       }),
//     ]);
//     return () => {};
//   }, [i18n?.language]);

//   const onClickCheck = (e, item) => {
//     e?.preventDefault();
//     setChecked(false);
//     setData(old => old.map((row, index) => {
//       if(index === item?.index) return { ...old[item?.index], checked: !row?.checked };
//       return row
//     }));
//   }

//   const onClickCheckAll = e => {
//     setChecked(!checked);
//     setData(old => old.map((row, index) => {
//       return { ...old[index], checked: !checked };
//     }));
//   }

//   const tableInstance = useReactTable({
//     data, columns,
//     columnResizeMode: 'onChange',
//     defaultColumn: { size: 135, minSize: 90 },
//     getCoreRowModel: getCoreRowModel(),
//     getSortedRowModel: getSortedRowModel(),
//     initialState: { sorting: [{ id: 'invtDescr', desc: false }] },
//     meta: { checked, onClickCheck, onClickCheckAll }
//   });
//   const tableProps = { tableInstance };

//   return (
//     <div>
//       <div id='paging' className='table_scroll' style={{ overflowY: 'scroll', maxHeight: 'calc(90vh - 185px)', marginTop: 5 }}>
//         <TableRowResize {...tableProps} />
//       </div>
//       <p className='inv_total'>{t('customer.total')}{data?.length}</p>
//     </div>
//   );
// }