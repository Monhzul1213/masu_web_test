import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useTable, usePagination, useRowSelect, useSortBy } from 'react-table';
import { withSize } from 'react-sizeme';

import { PaginationTable, Table, DynamicBSIcon, IconButton, Money } from '../../../all';
import { EditableCell } from '../../../invt/inventory/add/EditableCell';

function Card(props){
  const { adds, setAdds, setDAdds, setEdited, total1, total2, setTotal, size } = props;
  const { t, i18n } = useTranslation();
  const [columns, setColumns] = useState([]);

  useEffect(() => {
    const width = size?.width >= 840 ? 670 : (size?.width - 170);
    setColumns([
      { Header: t('order.t_name'), accessor: 'addCostName', customStyle: { width, paddingRight: 18 }, width: width - 20, length: 40 },
      {
        Header: <div style={{textAlign: 'right'}}>{t('order.t_amt')}</div>, accessor: 'addCostAmount', isMoney: true,// autoFocus: true,
        customStyle: { width: 100, paddingRight: 18 }, width: 80
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
  }, [i18n?.language, size?.width]);

  const updateMyData = (rowIndex, columnId, value, e) => {
    e?.preventDefault();
    let total = 0;
    setAdds(old => old.map((row, index) => {
      if(index === rowIndex){
        let newValue = columnId === 'addCostAmount' ? parseFloat(value ? value : 0) : value;
        let addCostAmount = columnId === 'addCostAmount' ? newValue : old[rowIndex]?.addCostAmount;
        total += addCostAmount;
        return { ...old[rowIndex], [columnId]: newValue, error: null };
      } else {
        total += row.addCostAmount;
        return row;
      }
    }));
    setTotal(total);
    setEdited && setEdited(true);
  }

  const onClickDelete = row => {
    if(row?.original?.orderAdditionalId !== -1) setDAdds(old => [...old, row?.original]);
    let newTotal = total2 - (row?.original?.addCostAmount ?? 0);
    setTotal(newTotal);
    setAdds(adds?.filter((item, index) => index !== row?.index));
  }
  
  const onClick = () => {
    setAdds(old => [...old, { addCostName: '', addCostAmount: 0, orderAdditionalId: -1, rowStatus: 'I' }]);
  }

  const classPage = size?.width > 510 ? 'ii_page_row_large' : 'ii_page_row_small';
  const maxHeight = 'calc(100vh - var(--header-height) - var(--page-padding) * 4 - 150px - var(--pg-height))';

  const defaultColumn = { Cell: EditableCell };
  const tableInstance = useTable({ columns, data: adds, defaultColumn, autoResetPage: false, initialState: { pageIndex: 0, pageSize: 25 },
    updateMyData, onClickDelete }, useSortBy, usePagination, useRowSelect);
  const tableProps = { tableInstance };
  const addProps = { className: 'po_add_btn', text: t('order.add_cost'), onClick, icon: <DynamicBSIcon name='BsPlusLg' className='po_add_icon' /> };

  return (
    <div className='po_back_invt2'>
      <div id='paging' style={{overflowY: 'scroll', maxHeight}}>
        {adds?.length ? <Table {...tableProps} /> : null}
      </div>
      <IconButton {...addProps} />
      <div style={{height: 5, width: 5}} />
      <div className={classPage}>
        {adds?.length ? <PaginationTable {...tableProps} /> : <div />}
        <p className='ac_page_total'>{t('inventory.total_cost')} : <Money value={total1 + total2} fontSize={13} /></p>
      </div>
    </div>
  );
}

const withSizeHOC = withSize();
export const Additional = withSizeHOC(Card);