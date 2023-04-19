import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useTable, usePagination, useRowSelect, useSortBy } from 'react-table';
import { Table, PaginationTable, Input, DynamicBSIcon , PlainSelect , ButtonRow} from '../../../components/all';
import { EditableCell } from './EditableCell';

export function CardVariant(props){
  const { data, setData, setEdited, search, setSearch, disabled, setDisabled, setDVariants , size , site, changeSite , sites , onClickCancel , onClickSave} = props;
  const { t, i18n } = useTranslation();
  const [columns, setColumns] = useState([]);

  useEffect(() => {
    const width = size?.width >= 600 ? 600 : (size?.width -20 );
    setColumns([
      { Header: t('orders.location'), accessor: 'ticketBinName', customStyle: { width, paddingRight: 18 }, width: width, length: 20 },
      { id: 'delete', noSort: true, Header: '', customStyle: { width: 40 },
        Cell: ({ row, onClickDelete }) =>
          (<div className='ac_delete_back'>
            <DynamicBSIcon name='BsTrashFill' className='ac_delete' onClick={() => onClickDelete(row)} />
          </div>)
      },
    ]);
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [i18n?.language]);

  const updateMyData = (rowIndex, columnId, value, e) => {
    e?.preventDefault();
    let hasError = false, errorIndex = -1;
    if(columnId === 'ticketBinName' ){
      errorIndex = data?.findIndex((item, index) =>
        value && index !== rowIndex && item[columnId]?.trim()?.toLowerCase() === value?.trim()?.toLowerCase());
      hasError = errorIndex !== -1;
      if(!value && columnId === 'ticketBinName') hasError = true;
    }
    setDisabled(hasError);
    setData(old => old.map((row, index) => {
      if(index === rowIndex){
        return { ...old[rowIndex], [columnId]: value, error: hasError ? columnId : null };
      } else if(hasError && errorIndex === index){
        return {...old[index], error: columnId };
      } else {
        return {...old[index], error: null };
      }
    }));
    setEdited && setEdited(true);
  }

  const onClickDelete = row => {
    if(row?.original?.ticketBinId ) setDVariants(old => [...old, row?.original]);
    if(row?.original?.error){
      setDisabled(false);
      setData(old => old?.reduce(function(list, item, index) {
        if(index !== row?.index){
          item.error = null;
          list.push(item);
        }
        return list;
      }, []));
    } else {
      setData(data?.filter(item => item?.ticketBinId !== row?.original?.ticketBinId));
    }
    setSearch({ value: search?.value });
    setEdited && setEdited(true);
  }

  const handleEnter = e => {
    e?.preventDefault();
    let ticketBinName = search?.value?.trim();
    if(ticketBinName){
      let exists = data?.findIndex(d => d.ticketBinName?.toLowerCase() === ticketBinName?.toLowerCase());
      if(exists === -1){
        let item = { ticketBinName, siteID: 0, rowStatus: 'I', ticketBinID: -1};//InvtID, MerchantID
        setData(old => [...old, item]);
        setSearch({ value: '' });
        setEdited && setEdited(true);
      } else setSearch({ value: search?.value?.trim(), error: t('orders.variant_error') });
    }
  }

  const width = size?.width >= 720 ? 720 : size?.width;
  const maxHeight = 'calc(100vh - var(--header-height) - var(--page-padding) * 4 - 150px - var(--pg-height))';
  const defaultColumn = { Cell: EditableCell };
  const tableInstance = useTable({ columns, data, defaultColumn, autoResetPage: false, initialState: { pageIndex: 0, pageSize: 25 },
    updateMyData, onClickDelete, disabled }, useSortBy, usePagination, useRowSelect);
  const tableProps = { tableInstance };
  const addProps = { value: search, setValue: setSearch, placeholder: t('orders.add_location'), handleEnter, inRow: true, length: 300 };
  const id = size?.width > 480 ? 'mo_large' : 'mo_small';
  const siteProps = { value: site, setValue: changeSite, data: sites, s_value: 'siteId', s_descr: 'name',
    className: 'do_select' };
  const btnProps = { onClickCancel, onClickSave };

  return (
    <div className='mo_container' style={{ width, paddingBottom: 0 }}>
      <div className='ih_header' id={id}>
              <p className='do_title'>{t('system_menu.order_location')}</p>
              <PlainSelect {...siteProps} />
      </div>
      <div id='paging' style={{overflowY: 'scroll', maxHeight}}>
        <Table {...tableProps} />
      </div>
      <div style={{padding: 2}} />
      <Input {...addProps} />
      <div style={{padding: 5}} />
      <PaginationTable {...tableProps} />
      <ButtonRow {...btnProps} />
    </div>
  );
}