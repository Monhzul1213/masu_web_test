import React, { useState, useEffect } from 'react';
import { useTable, usePagination, useRowSelect, useSortBy } from 'react-table';
import { useTranslation } from 'react-i18next';

import { ExportExcel } from '../../../../helpers';
import { PaginationTable, Table, DynamicMDIcon , Money } from '../../../../components/all';
import { IconDropdown } from '../../all/all_m';

export function List(props){
  const { data, excelName, size } = props;
  const { t, i18n } = useTranslation();
  const [columns, setColumns] = useState([]);
  const [columns1, setColumns1] = useState([]);
  const [maxHeight, setMaxHeight] = useState('300px');

  useEffect(() => {
    changeColumns(['totalSalesAmt','totalReturnAmt', 'totalNetSalesAmt',  'totalProfitAmt', 'taxes' ]);
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [i18n?.language]);

  const changeColumns = value => {
    let columns = [ { Header: t('report.category'), accessor: 'categoryName', exLabel: t('report.category') } ];
    setColumns1(value);
    t('report.columns')?.forEach(item => {
      let exists = value?.findIndex(val => val === item?.value) !== -1;
      if(exists){
        columns.push({
          Header: <div style={{textAlign: 'right'}}>{item?.label}</div>, accessor: item?.value, exLabel: item?.label,
          Cell: props => (
            <div style={{textAlign: 'right', paddingRight: 15}}>
              {item?.value === 'margin' ? (+(props?.value)?.toFixed(2) + '%')  : 
              (item?.value === 'qty' ? props?.value : 
              (item?.value === 'totalReturnQty' ? props?.value : <Money value={props?.value} fontSize={14} />))}
            </div>)
        });
      }
    });
    setColumns(columns);
  }

  useEffect(() => {
    if(size?.width >= 920) setMaxHeight('calc(100vh - var(--header-height) - var(--page-padding) * 6 - 37px - 90px)');
    else if(size?.width < 920 && size?.width >= 720)
      setMaxHeight('calc(100vh - var(--header-height) - var(--page-padding) * 6 - 83px - 70px)');
    else if(size?.width < 720)
      setMaxHeight('calc(100vh - var(--header-height) - var(--page-padding) * 4 - 38px - 137px)');
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [size?.width]);

  const columnProps = { value: columns1, setValue: changeColumns, data: t('report.columns'), className: 'rp_list_drop',
    Icon: () => <DynamicMDIcon name='MdOutlineViewColumn' className='rp_list_drop_icon' />,
    dropdownStyle: { minWidth: 200 }, dropdownAlign: { offset: [-165, 5] } };
  // const maxHeight = 'calc(100vh - var(--header-height) - var(--page-padding) * 4 - 36px - 10px - var(--pg-height) - 5px)';
  const tableInstance = useTable({ columns,data,  autoResetPage: false, autoResetSortBy: false,
    initialState: { pageIndex: 0, pageSize: 25, sortBy: [{ id: 'beginTime', desc: true }] },
      }, useSortBy, usePagination, useRowSelect);
  const tableProps = { tableInstance , hasTotal: true , total: data?.length };

  return (
    <div>
      <div className='rp_list_filter_z'>
        <ExportExcel text={t('page.export')} columns={columns} excelData={data} fileName={excelName} />
        <IconDropdown {...columnProps} />
      </div>
      <div style={{overflowX: 'scroll'}}>
        <div className='table_scroll' id='paging' style={{marginTop: 10, overflow: 'scroll', maxHeight, minWidth: 720}}>
          <Table {...tableProps} />
        </div>
      </div>
      <PaginationTable {...tableProps} />
    </div>
  );
}