import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useTable, usePagination, useRowSelect, useSortBy } from 'react-table';

import { Table, PaginationTable, Input, DynamicBSIcon , PlainSelect , ButtonRow } from '../../../../components/all';
import { DynamicAIIcon } from '../../all/all_m';
import { EditableCell } from './EditableCell';
import { QR } from './QR';
import { config, encrypt } from '../../../../helpers';

export function CardVariant(props){
  const { data, setData, setEdited, search, setSearch, disabled, setDisabled, setDVariants , size , site, changeSite , sites , onClickCancel , onClickSave} = props;
  const { t, i18n } = useTranslation();
  const [columns, setColumns] = useState([]);
  const [visible, setVisible] = useState(false);
  const [qrData, setQRData] = useState(null);

  useEffect(() => {
    // const width = size?.width >= 400 ? 550 : (size?.width -20 );
    setColumns([
      { Header: t('orders.location'), accessor: 'ticketBinName', width: '95%', length: 50 },
      { id: 'qr', noSort: true, Header: '', customStyle: { width: 40 },
        Cell: ({ row }) => {
          const item = row?.original;
          return item?.ticketBinId ? (
            <div className='ac_delete_back'>
              <DynamicBSIcon name='BsQrCode' className='ac_qr' onClick={() => handleQRClick(item)}/>
            </div>
          ) : null;
        },
      },
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

  const handleQRClick = row => {
    let msg = row?.merchantId + '-' + row?.siteId + '-' + row?.ticketBinId;
    let code = encrypt(msg);
    let url = config?.domain + '/QRMenu?qr=' + encodeURIComponent(code);
    setQRData({url, ticketBinName: row?.ticketBinName, siteName: row?.siteName});
    setVisible(true)
  }

  const closeModal = () => {
    setQRData(null);
    setVisible(false)
  };

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
      setData(data?.filter((item, index) => row?.index !== index));
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
        let item = { ticketBinName};
        setData(old => [...old, item]);
        setSearch({ value: '' });
        setEdited && setEdited(true);
      } else setSearch({ value: search?.value?.trim(), error: t('orders.variant_error') });
    }
  }

  // const width = size?.width >= 420 ? 620 : size?.width;
  const maxHeight = 'calc(100vh - var(--header-height) - var(--page-padding) * 4 - 150px - var(--pg-height) - 90px)';
  const defaultColumn = { Cell: EditableCell };
  const tableInstance = useTable({ columns, data, defaultColumn, autoResetPage: false, initialState: { pageIndex: 0, pageSize: 25 },
    updateMyData, onClickDelete, disabled, handleQRClick }, useSortBy, usePagination, useRowSelect);
  const tableProps = { tableInstance };
  const addProps = { value: search, setValue: setSearch, placeholder: t('orders.add_location'), handleEnter, inRow: true, length: 300 };
  const id = size?.width > 480 ? 'mo_large' : 'mo_small';
  const siteProps = { value: site, setValue: changeSite, data: sites, s_value: 'siteId', s_descr: 'name',
    className: 'do_select' };
  const btnProps = { onClickCancel, onClickSave };

  return (
    <div>
      {visible && <QR visible={visible} closeModal={closeModal} qrData={qrData}/>}
      <div className='mo_container' style={{ paddingBottom: 0 }}>
        <div className='ih_header' id={id}>
                <p className='do_title'>{t('orders.title')}</p>
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
      <div  className='order_sub' style={{maxWidth: '100%'}}>
        <DynamicAIIcon name='AiOutlineInfoCircle' className='order_info'  />
        <p className='z_item_sub_title'>{t('orders.error')}</p>
      </div>      
    </div>

  );
}