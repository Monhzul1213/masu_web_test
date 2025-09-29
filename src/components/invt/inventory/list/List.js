import React, { useState, useEffect, useMemo } from 'react';
import { useTable, usePagination, useRowSelect, useSortBy, useExpanded, useResizeColumns } from 'react-table';
import { useTranslation } from 'react-i18next';

import { Check, DynamicFAIcon, Money, Empty1, PaginationTable, PaginationList, TableDetailResize } from '../../../all';
import { EditableCell, SelectableCell } from '../add/EditableCell';
import { Detail } from './Detail';
import { Header } from './Header';
import { Image } from './Image';

export function List(props){
  const { data, setData, onClickAdd, categories, setShow, checked, setChecked, updateInventory, autoResetExpanded,
    size, filtering, onClickDelete, show, setError, onSearch, cats, excelName, pageInfo, getInventory, vendors} = props;
  const [columns, setColumns] = useState([]);
  const [visible, setVisible] = useState(false);
  const [selected, setSelected] = useState();
  const { t, i18n } = useTranslation();

  useEffect(() => {
    const style = { display: 'flex', alignItems: 'center', justifyContent: 'center', width: 40, };
    setColumns([
      { id: 'expander', noSort: true, isBtn: true, Header: '', width: 30, minWidth: 40, maxWidth: 50,
        Cell: ({ row }) => !row?.original?.msInventoryVariants?.length ? '' :
          (<div style={style}>
            <DynamicFAIcon {...row.getToggleRowExpandedProps()} name={row.isExpanded ? 'FaChevronUp': 'FaChevronDown'} className='t_expand' />
          </div>)
      },
      {
        id: 'check', noSort: true, isBtn: true, width: 45, minWidth: 40, maxWidth: 45,
        Header: ({ onClickCheckAll, checked }) => <div style={style}><Check checked={checked} onClick={onClickCheckAll} /></div>,
        Cell: ({ row, onClickCheck }) => <div style={style}><Check checked={row?.original?.checked} onClick={e => onClickCheck(e, row)} /></div>,
      },
      { id: 'logo', noSort: true, isBtn: true, Header: '', width: 40, minWidth: 30, maxWidth: 40,
        Cell: ({ row, onClickModal }) => !row?.original?.msInventory?.image ? '' :
          (<div style={style}>
            <DynamicFAIcon name={'FaImage'} className='t_image' onClick={e => onClickModal(e, row)}/>
          </div>)
      },
      {
        Header: t('page.name'), accessor: 'msInventory.name', exLabel: t('page.name'), width: 300, minWidth: 90
      },
      {
        Header: t('inventory.barcode'), accessor: 'msInventory.barCode', exLabel: t('inventory.barcode'), width: 150, minWidth: 90
      },
      {
        Header: t('category.title'), accessor: 'msInventory.categoryId', width: 180, width1: 170, minWidth: 150, isBtn: true, exLabel: t('category.title'),
        Cell: props => <SelectableCell {...props} data={categories} s_value='categoryId' s_descr='categoryName' cellID='hide_border'/>
      },
      {
        Header: t('order.vend'), accessor: 'msInventory.vendId',  width: 180, width1: 170, minWidth: 120, isBtn: true, exLabel: t('order.vend'),
        Cell: props => <SelectableCell {...props} data={vendors} s_value='vendId' s_descr='vendName' cellID='hide_border'/>
      },
      {
        Header: <div style={{textAlign: 'right'}}>{t('inventory.price')}</div>, accessor: 'msInventory.price',  width: 120, minWidth: 90, exLabel: t('inventory.price'),
        Cell: props => props?.row?.original?.msInventoryVariants?.length ? '' :
          (<div style={{textAlign: 'right', paddingRight: 15}}><Money value={props?.value} fontSize={11}/></div>)
      },
      {
        Header: <div style={{textAlign: 'right'}}>{t('inventory.cost')}</div>, accessor: 'msInventory.cost',
        width: 120, minWidth: 90, isBtn: true, exLabel: t('inventory.cost'),
        Cell: props => props?.row?.original?.msInventoryVariants?.length ? '' : props?.row?.original?.msInventory?.isKit === 'Y'
          ? (<div style={{textAlign: 'right', paddingRight: 10}}><Money value={props?.value} fontSize={11}/></div>)
          : <div style={{textAlign: 'right', paddingRight: 10}}><EditableCell {...props} cellID='hide_border' /></div>, isMoney: true,
      },
      {
        Header: <div style={{textAlign: 'right'}}>{t('inventory.margin')}</div>, accessor: 'msInventory.margin',  width: 100, minWidth: 90, 
        exLabel: t('inventory.margin'),
        Cell: props => props?.row?.original?.msInventoryVariants?.length ? '' :
          <div style={{textAlign: 'right', paddingRight: 15}}>{props?.value}</div>
      },
    ]);
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [i18n?.language]);

  const updateMyData = async (row, column, value, e, invvar, isEdit, isExpand) => {
    let item = data[row]?.msInventory;
    let newData = { invtID: item?.invtId, categoryID: item?.categoryId, cost: item?.cost, vendId: item?.vendId };
    if(column === 'msInventory.categoryId') newData.categoryID = value;
    else if(column === 'msInventory.cost') newData.cost = parseFloat(value ? value : 0);
    else if(column === 'msInventory.vendId') newData.vendId = value;
    else if(invvar) newData.invvar = invvar;
    const response = await updateInventory(newData, isEdit, isExpand);
    return response;
  }

  const onClickCheckAll = e => {
    setShow(!checked);
    setChecked(!checked);
    setData(old => old.map((row, index) => {
      return { ...old[index], checked: !checked };
    }));
  }

  const onClickCheck = (e, item) => {
    e?.preventDefault();
    setChecked(false);
    setShow(false);
    setData(old => old.map((row, index) => {
      if(index === item?.index){
        if(!row?.checked) setShow(true);
        return { ...old[item?.index], checked: !row?.checked };
      } else {
        if(row?.checked) setShow(true);
        return row;
      }
    }));
  }

  const onClickModal = (e, row) => {
    e?.preventDefault();
    setVisible(true);
    setSelected(row?.original?.msInventory)
  }

  const closeModal = e => {
    e?.preventDefault();
    setVisible(false);
  }

  const onRowClick = row => onClickAdd(row?.original?.msInventory);
  const defaultColumn = useMemo(() => ({ minWidth: 40, width: 150, maxWidth: 400 }), []);
  const tableInstance = useTable({ columns, data, defaultColumn, autoResetPage: !filtering, autoResetSortBy: false, autoResetExpanded,
    initialState: { pageIndex: 0, pageSize: 1000, size : true, sortBy: [{ id: 'msInventory.name', desc: true }] },
    onClickCheckAll, checked, onClickCheck, updateMyData, onClickModal }, useSortBy, useExpanded, usePagination, useRowSelect, useResizeColumns);
  const tableProps = { tableInstance, onRowClick, Detail: props => <Detail {...props} updateData={updateMyData} />,
    detailName: 'msInventoryVariants', colSpan: 9, className: 'table_cell_text', className1: 'table_cell_text_resize1'};
  const maxHeight = size?.width > 780
    ? 'calc(100vh - var(--header-height) - var(--page-padding) * 3 - 180px)'
    : 'calc(100vh - var(--header-height) - var(--page-padding) * 3 - 220px)';
  const pageProps = { pageInfo, getInventory, size : true };
  const filterProps = { onClickAdd, onClickDelete, show, setError, onSearch, cats, size,  columns, data, excelName, vendors };
  const emptyProps = { icon: 'MdSchedule', type: 'time', noDescr: true };
  const imageProps = { visible, closeModal , selected};

  return (
    <div>
      {visible && <Image {...imageProps} />}
      <Header {...filterProps} />
      {!data?.length ? <Empty1 {...emptyProps} /> : 
      <>
        <div style={{overflowX: 'scroll'}}>
          <div className='table_scroll' id='paging' style={{marginTop: 10, overflow: 'scroll', maxHeight, minWidth: 120}}>
            <TableDetailResize {...tableProps} />
          </div>
        </div>
        <p className='data_size_text'>{t('info.all') + data?.length}</p>
        {filtering ? <PaginationTable {...tableProps} /> : <PaginationList {...pageProps} />}
      </>
      }
    </div>
  )
}