import React, { useState, useEffect } from 'react';
import { useTable, usePagination, useRowSelect, useSortBy } from 'react-table';
import { useTranslation } from 'react-i18next';
import { formatNumber } from '../../../../helpers';
import { Button, PaginationTable, Table, IconSelect, DynamicMDIcon } from '../../../components/all/all_m';
export function List(props){
  const { data} = props;
  const { t, i18n } = useTranslation();
  const [columns, setColumns] = useState([]);
  const [columns1, setColumns1] = useState([]);

  useEffect(() => {
    changeColumns(['totalSalesAmt','totalReturnAmt', 'totalNetSalesAmt',  'totalProfitAmt', 'taxes' ]);
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [i18n?.language]);

  const changeColumns = value => {
    let columns = [ { Header: t('report.category'), accessor: 'categoryName',} ];
    setColumns1(value);
    t('report.columns')?.forEach(item => {
      let exists = value?.findIndex(val => val === item?.value) !== -1;
      if(exists){
        columns.push({
          Header: <div style={{textAlign: 'right'}}>{item?.label}</div>, accessor: item?.value,
          Cell: props => (
            <div style={{textAlign: 'right', paddingRight: 15}}>
              {item?.value === 'margin' ? (+(props?.value)?.toFixed(2) + '%')  : 
              (item?.value === 'qty' ? formatNumber(props?.value) : 
              (item?.value === 'totalReturnQty' ? formatNumber(props?.value) : ('₮' + formatNumber(props?.value))))}
            </div>)
        });
      }
    });
    setColumns(columns);
  }

  const exportProps = { className: 'rp_list_select', text: t('page.export'), disabled: true };
  const columnProps = { value: columns1, setValue: changeColumns, data: t('report.columns'), className: 'rp_list_drop',
    Icon: () => <DynamicMDIcon name='MdOutlineViewColumn' className='rp_list_drop_icon' />,
    dropdownStyle: { minWidth: 200 }, dropdownAlign: { offset: [-165, 5] } };
  const maxHeight = 'calc(100vh - var(--header-height) - var(--page-padding) * 4 - 36px - 10px - var(--pg-height) - 5px)';
  const tableInstance = useTable({ columns,data,  autoResetPage: false, autoResetSortBy: false,
    initialState: { pageIndex: 0, pageSize: 25, sortBy: [{ id: 'beginTime', desc: true }] },
      }, useSortBy, usePagination, useRowSelect);
  const tableProps = { tableInstance };

  return (
    <div>
      <div className='rp_list_filter'>
        <Button {...exportProps} />
        <IconSelect {...columnProps} />
      </div>
      <div style={{overflowX: 'scroll'}}>
        <div id='paging' style={{marginTop: 10, overflowY: 'scroll', maxHeight, minWidth: 720}}>
          <Table {...tableProps} />
        </div>
      </div>
      <PaginationTable {...tableProps} />
    </div>
  );
}