import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useTable, usePagination, useRowSelect, useSortBy } from 'react-table';

import { Table, Empty1} from '../../../../components/all';


export function List(props){
  const { onClickAdd, data,  setData, loaded, setShow, checked, setChecked, size} = props;
  const { t, i18n } = useTranslation();
  const [columns, setColumns] = useState([]);

  useEffect(() => {
    // const style = { display: 'flex', alignItems: 'center', justifyContent: 'center'};
    setColumns([
      // {
      //   id: 'check', noSort: true, isBtn: true,
      //   Header: <div style={style}><Check checked={checked} onClick={onClickCheckAll} /></div>,
      //   Cell: ({ row }) => <div style={style}><Check checked={row?.original?.checked} onClick={e => onClickCheck(e, row)} /></div>,
      // },
      { Header: t('customer.type'), accessor: 'typeName', customStyle: {minWidth: 200} },
      { Header: t('invoices.qty'), accessor: 'custCount', customStyle: {maxWidth: 100}  },
      { Header: t('invoice.invtQty'), accessor: 'itemCount', customStyle: {maxWidth: 60} }
    ]);
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [i18n?.language, loaded, checked]);

  const onClickCheckAll = () => {
    setShow(!checked);
    setChecked(!checked);
    setData(old => old.map((row, index) => {
      return { ...old[index], checked: !checked };
    }));
  }

  const onClickCheck = (e, item) => {
    e?.preventDefault();
    setChecked(false);
    let count = false;
    setData(old => old.map((row, index) => {
      if(index === item?.index){
        if(!row?.checked) count = true;
        return { ...old[item?.index], checked: !row?.checked };
      } else {
        if(row?.checked) count = true;
        return row;
      }
    }));
  
    setShow(count);
  }

  const onRowClick = row => onClickAdd(row?.original);


  const maxHeight = size?.width > 780
  ? 'calc(100vh - var(--header-height) - var(--page-padding) * 3 - 7px - 51px - 10px - 37px)'
  : 'calc(100vh - var(--header-height) - var(--page-padding) * 3 - 7px - 105px - 10px - 37px)';
const tableInstance = useTable( { columns, data, autoResetPage: false, initialState: { pageIndex: 0, pageSize: 250000 },
    onClickCheckAll, checked, onClickCheck}, useSortBy, usePagination, useRowSelect);
  const tableProps = { tableInstance, onRowClick };
  const emptyProps = { icon: 'MdSupervisorAccount', type: 'customer', noDescr: true , isMd : true};

  return (
    <div >
      {!data?.length ? <Empty1 {...emptyProps} /> : 
      <div style={{overflow: 'scroll'}} >
        <div className='list_scroll' id='paging' style={{marginTop: 10, overflowY: 'scroll', maxHeight, minWidth : 520}}>
              <Table {...tableProps} />
        </div>
      </div>}
      <p className='data_size_text'>{t('info.all') + data?.length}</p>
    </div>
  )
}