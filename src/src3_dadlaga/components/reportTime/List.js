import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { usePagination, useSortBy, useTable, useBlockLayout, useResizeColumns, useRowSelect } from 'react-table';

import { TableResize,PaginationTable } from '../../../src1/components/all/all_m';
import { formatNumber,  } from '../../../helpers';
import { Header } from '../../../src1/components/report/employee';

export function List(props) {
    const { data, excelName } = props;
    const { t, i18n } = useTranslation();
    const [columns, setColumns] = useState([]);

    useEffect(() => { 
        setColumns([
            { Header: <div style={{textAlign: 'left'}}>{t('report_time.branch')}</div>, 
            accessor: 'siteName', exLabel: t('report_time.branch'), width: 200, minWidth: 110, 
            Cell: props => <div style={{ textAlign: 'left', paddingRight: 15 }}>{String(props?.value)}</div>,
            Footer: <div style={{textAlign: 'left'}}>{t('report_time.sum')}</div>,
            },
            { Header: <div style={{textAlign: 'left'}}>{t('report_time.salesTime')}</div>, 
            accessor: 'salesTime', exLabel: t('report_time.salesTime'), width: 100, minWidth: 50, 
            Cell: props => <div style={{ textAlign: 'left', paddingRight: 15 }}>{String(props?.value)}:00</div>,
            },
            { Header: <div style={{textAlign: 'right'}}>{t('report_time.sales_num')}</div>,
            accessor: 'salesCount', exLabel: t('report_time.sales_num'), width: 200, minWidth: 90,
            Cell: props => <div style={{ textAlign: 'right', paddingRight: 15 }}>{String(props?.value)}</div>,
            Footer: info => {
                const total = React.useMemo(() =>
                info.rows.reduce((sum, row) => sum + parseFloat(row.values.salesCount), 0), [info.rows]);
                return <div style={{ textAlign: 'right', paddingRight: 15 }}>{formatNumber(total)}</div>;}
            },
            { Header: <div style={{textAlign: 'right'}}>{t('report_time.sales_amount')}</div>, 
            accessor: 'salesAmount',exLabel: t('report_time.sales_amount'), width: 200, minWidth: 90, 
            Cell: props => <div style={{ textAlign: 'right', paddingRight: 15 }}>{String(props?.value)}₮</div>, 
            Footer:info=> {const total = React.useMemo (() =>
                info.rows.reduce((sum, row) => sum + parseFloat(row.values.salesAmount), 0), [info.rows]);
                return <div style={{ textAlign: 'right', paddingRight: 15 }}>{formatNumber(total)}₮</div>;}
            },
            { Header: <div style={{textAlign: 'right'}}>{t('report_time.return_num')}</div>,
            accessor: 'returnCount',exLabel: t('report_time.return_num'), width: 200, minWidth: 110, 
            Cell: props => <div style={{ textAlign: 'right', paddingRight: 15 }}>{String(props?.value)}</div>, 
            Footer:info=> {const total = React.useMemo (() =>
                info.rows.reduce((sum, row) => sum + parseFloat(row.values.returnCount), 0), [info.rows]);
                return <div style={{ textAlign: 'right', paddingRight: 15 }}>{formatNumber(total)}</div>;}
            },
            { Header: <div style={{textAlign: 'right'}}>{t('report_time.return_amount')}</div>, 
            accessor: 'returnAmount',exLabel: t('report_time.return_amount'), width: 200, minWidth: 110, 
            Cell: props => <div style={{ textAlign: 'right', paddingRight: 15 }}>{String(props?.value)}₮</div>, 
            Footer:info=> {const total = React.useMemo (() =>
                info.rows.reduce((sum, row) => sum + parseFloat(row.values.returnAmount), 0), [info.rows]);
                return <div style={{ textAlign: 'right', paddingRight: 15 }}>{formatNumber(total)}₮</div>;}
            }]);
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [i18n?.language]); 

    const tableInstance = useTable({
        columns,
        data,
        autoResetPage: false,
        autoResetSortBy: false,
        initialState: { pageIndex: 0, pageSize: 25, sortBy: [{ id: 'salesTime', desc: true }] }
    },
        useSortBy,
        usePagination, useBlockLayout, useResizeColumns, useRowSelect
    );

    const tableProps = { tableInstance };
    const exportExcelProps = {data, columns, excelName };

    return (
        <div className="rp_list">
            <Header {...exportExcelProps}/>
            <div className="table_scroll" style={{ overflowX: 'auto' }}>
                <div id="padding" style={{ marginTop: 10, minWidth: 720, maxHeight: 500 }}>
                    <TableResize {...tableProps} />
                </div>
            </div>
            <PaginationTable {...tableProps} />
        </div>
    );    
}
