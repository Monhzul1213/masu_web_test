import React, { useEffect, useState } from 'react';
import { usePagination, useSortBy, useTable } from 'react-table';
import { Table } from '../../all';
import { PaginationTable } from '../../all/PaginationTable';
import { ExportExcel, formatNumber } from '../../../helpers';
import { useTranslation } from 'react-i18next';
// import { Money } from '../../all/Money1';
import { Money } from '../../all';

export function Figure(props) {
  const { data } = props;
  const [columns, setColumns] = useState([]);
  const { t } = useTranslation();

  useEffect(() => {
    setColumns([
      { Header: <div >Харилцагч</div>, accessor: 'custName', exLabel: 'Харилцагч'},

      { Header: <div style={{textAlign: 'right'}}> {t('page.amount_beg')} </div>, accessor: 'beginArAmount', exLabel: 'Эхний үлдэгдэл', 
      Cell: (props)=> <div style={{textAlign: 'right', paddingRight: '7px'}}> <Money value = {props?.value}/> </div> },
      { Header: <div style={{textAlign: 'right'}}> {t('receive.amount_receive_crea')} </div>, accessor: 'addAmount',exLabel: 'Авлага үүсгэсэн дүн',
      Cell: (props)=> <div style={{textAlign: 'right', paddingRight: '7px'}}> <Money value = {props?.value}/></div>  },
      { Header: <div style={{textAlign: 'right'}}> {t('receive.amount_receive_clos')} </div>, accessor: 'closeAmount',exLabel: 'Авлага хаасан дүн',
      Cell: (props)=> <div style={{textAlign: 'right', paddingRight: '7px'}}> <Money value = {props?.value}/></div>  },
      { Header: <div style={{textAlign: 'right'}}> {t('receive.amount_final')} </div>, accessor: 'endArAmount',exLabel: 'Эцсийн үлдэгдэл',
      Cell: (props)=> <div style={{textAlign: 'right', paddingRight: '7px'}}> <Money value = {props?.value}/></div>  }
    ]);

    return () => {};
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
  const ExportExcelProps = { excelData: data, columns,  fileName:t('receive.acc_receive_report'), text:t('page.export')};

  return (
    <>
    <div className="figure_list">
      <ExportExcel {...ExportExcelProps} />
        <div className='table_scroll' style={{paddingRight: 10, overflowX: 'scroll' }}>
          <div id='paging'
            style={{ paddingLeft: 12, overflowX: 'scroll',  minWidth: 720, maxHeight: 500 }}>
            <Table {...tableProps} />
          </div>
        </div>
        <PaginationTable {...tableProps} />
      </div>
    </>
  );
}