import React, { useEffect, useState } from 'react';
import { usePagination, useSortBy, useTable } from 'react-table';
import { Table } from '../../all';
import { PaginationList, PaginationTable } from '../../all/PaginationTable';
import {Empty} from 'antd';

export function Figure(props) {
  const { data } = props;
  const [columns, setColumns] = useState([]);

  useEffect(() => {
    setColumns([
      { Header: 'Харилцагч', accessor: 'column1' },
      { Header: 'Эхний үлдэгдэл', accessor: 'column2' },
      { Header: 'Авлага үүсгэсэн дүн', accessor: 'column3' },
      { Header: 'Авлага хаасан дүн', accessor: 'column4' },
      { Header: 'Эцсийн үлдэгдэл', accessor: 'column5' }
    ]);

    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const tableInstance = useTable(
    {
      columns,
      data,
      autoResetPage: false,
      autoResetSortBy: false,
      initialState: {
        pageIndex: 0,
        pageSize: 25,
        sortBy: [{ id: 'column1', desc: true }]
      }
    },
    useSortBy,
    usePagination
  );

  const tableProps = { tableInstance };

  return (
    <>
    <div class="figure_list">
        <button class="rp_list_select">ЭКСПОРТ</button>
        <div className='table_scroll' style={{paddingRight: 10, overflowX: 'scroll' }}>
          <div
            id='paging'
            style={{ paddingLeft: 30, overflowX: 'scroll',  minWidth: 720, maxHeight: 500 }}>
            <Table {...tableProps} />
          </div>
        </div>
        <PaginationTable {...tableProps} />
      </div></>
  );
}
