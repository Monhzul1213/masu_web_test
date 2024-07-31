import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { usePagination, useSortBy, useTable, useRowSelect } from 'react-table';

import { PaginationTable, Money, Table } from '../../../src1/components/all/all_m';
import { Header } from '../../../src1/components/report/employee';

export function List(props) {
    const { data, excelName } = props;
    const { t, i18n } = useTranslation();
    const [columns, setColumns] = useState([]);

    useEffect(() => { 
        setColumns([
            { Header: <div >{t('customer.title')}</div>, accessor: 'custName', exLabel: t('customer.title')},
            { Header: <div style={{textAlign: 'right'}}> {t('receive.amount_beg')} </div>, accessor: 'beginArAmount', exLabel: 'Эхний үлдэгдэл', 
            Cell: (props)=> <div style={{textAlign: 'right', paddingRight: '7px'}}> <Money value = {props?.value}/> </div> },
            { Header: <div style={{textAlign: 'right'}}> {t('receive.amount_receive_crea')} </div>, accessor: 'addAmount',exLabel: 'Авлага үүсгэсэн дүн',
            Cell: (props)=> <div style={{textAlign: 'right', paddingRight: '7px'}}> <Money value = {props?.value}/></div>  },
            { Header: <div style={{textAlign: 'right'}}> {t('receive.amount_receive_clos')} </div>, accessor: 'closeAmount',exLabel: 'Авлага хаасан дүн',
            Cell: (props)=> <div style={{textAlign: 'right', paddingRight: '7px'}}> <Money value = {props?.value}/></div>  },
            { Header: <div style={{textAlign: 'right'}}> {t('receive.amount_final')} </div>, accessor: 'endArAmount',exLabel: 'Эцсийн үлдэгдэл',
            Cell: (props)=> <div style={{textAlign: 'right', paddingRight: '7px'}}> <Money value = {props?.value}/></div>  }
          ]);
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [i18n?.language]); 

    const tableInstance = useTable({
        columns,
        data,
        autoResetPage: false,
        autoResetSortBy: false,
        initialState: { pageIndex: 0, pageSize: 25, sortBy: [{ id: 'salesTime', desc: true }] }
    }, useSortBy, usePagination, useRowSelect );

    const tableProps = { tableInstance };
    const exportExcelProps = {data, columns, excelName };

    return (
        <div className="rp_list">
            <Header {...exportExcelProps}/>
            <div className="table_scroll" style={{ overflowX: 'auto' }}>
                <div id="padding" style={{ marginTop: 10, minWidth: 720, maxHeight: 500 }}>
                    <Table {...tableProps} />
                </div>
            </div>
            <PaginationTable {...tableProps} />
        </div>
    );    
}
