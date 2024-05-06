import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { usePagination, useSortBy, useTable } from 'react-table';
import { Button , Table, FooterTable} from '../../all';
import { FiColumns } from "react-icons/fi";
import { PaginationTable } from '../../all/PaginationTable';
import { formatNumber } from '../../../helpers';
import { ExportExcel } from '../../../helpers';

export function List(props) {
    const { t } = useTranslation();
    const { data } = props;
    const [columns, setColumns] = useState([]);

    useEffect(() => { setColumns([
            { 
                Header: <div style={{textAlign: 'left'}}>{t('profile.branch')}</div>, 
                accessor: 'siteName', exLabel: t('profile.branch'), width: 140, minWidth: 110, 
                Cell: props => <div style={{ textAlign: 'left', paddingRight: 15 }}>{String(props?.value)}</div>,
                Footer: <div style={{textAlign: 'left'}}>{t('profile.sum')}</div>,
            },
            { 
                Header: <div style={{textAlign: 'left'}}>{t('profile.salesTime')}</div>, 
                accessor: 'salesTime', exLabel: t('profile.salesTime'), width: 140, minWidth: 110, 
                Cell: props => <div style={{ textAlign: 'left', paddingRight: 15 }}>{String(props?.value)}:00</div>,
            },
            {
                Header: <div style={{textAlign: 'right'}}>{t('profile.sales_num')}</div>,
                accessor: 'salesCount', exLabel: t('profile.sales_num'), width: 140, minWidth: 110,
                Cell: props => <div style={{ textAlign: 'right', paddingRight: 15 }}>{String(props?.value)}</div>,
                Footer: info => {
                  const total = React.useMemo(() =>
                  info.rows.reduce((sum, row) => sum + parseFloat(row.values.salesCount), 0), [info.rows]);
                  return <div style={{ textAlign: 'right', paddingRight: 15 }}>{formatNumber(total)}</div>;}
            },
            { 
                Header: <div style={{textAlign: 'right'}}>{t('profile.sales_amount')}</div>, 
                accessor: 'salesAmount',exLabel: t('profile.sales_amount'), width: 140, minWidth: 110, 
                Cell: props => <div style={{ textAlign: 'right', paddingRight: 15 }}>{String(props?.value)}₮</div>, 
                Footer:info=> {const total = React.useMemo (() =>
                    info.rows.reduce((sum, row) => sum + parseFloat(row.values.salesAmount), 0), [info.rows]);
                    return <div style={{ textAlign: 'right', paddingRight: 15 }}>{formatNumber(total)}₮</div>;}
            },
            { 
                Header: <div style={{textAlign: 'right'}}>{t('profile.return_num')}</div>,
                accessor: 'returnCount',exLabel: t('profile.return_num'), width: 140, minWidth: 110, 
                Cell: props => <div style={{ textAlign: 'right', paddingRight: 15 }}>{String(props?.value)}</div>, 
                Footer:info=> {const total = React.useMemo (() =>
                    info.rows.reduce((sum, row) => sum + parseFloat(row.values.returnCount), 0), [info.rows]);
                    return <div style={{ textAlign: 'right', paddingRight: 15 }}>{formatNumber(total)}</div>;}
            },
            { 
                Header: <div style={{textAlign: 'right'}}>{t('profile.return_amount')}</div>, 
                accessor: 'returnAmount',exLabel: t('profile.return_amount'), width: 140, minWidth: 110, 
                Cell: props => <div style={{ textAlign: 'right', paddingRight: 15 }}>{String(props?.value)}₮</div>, 
                Footer:info=> {const total = React.useMemo (() =>
                    info.rows.reduce((sum, row) => sum + parseFloat(row.values.returnAmount), 0), [info.rows]);
                    return <div style={{ textAlign: 'right', paddingRight: 15 }}>{formatNumber(total)}₮</div>;}
            }]);
    }, [t]); 
    const tableInstance = useTable({
        columns,
        data,
        autoResetPage: false,
        autoResetSortBy: false,
        initialState: { pageIndex: 0, pageSize: 20, sortBy: [{ id: 'salesTime', desc: true }] }
    },
        useSortBy,
        usePagination
    );

    const tableProps = { tableInstance };
    const exportExcelProps = {excelData:data, columns, fileName: 'exported_data', text:t('page.export')
        
    };

    return (
        <div className="rp_list">
            <div>
                <div className="ih_btn_row">
                    <ExportExcel {...exportExcelProps} />
                </div>
                <div className="table_scroll" style={{ overflowX: 'auto' }}>
                    <div id="padding" style={{ marginTop: 10, minWidth: 720, maxHeight: 500 }}>
                        <FooterTable {...tableProps} />
                    </div>
                </div>
                <PaginationTable {...tableProps} />
            </div>
        </div>
    );    
}
