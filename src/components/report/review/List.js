import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { usePagination, useSortBy, useTable } from 'react-table';
import { Button , Table, FooterTable} from '../../all'; // Assuming Table and FooterTable are imported from elsewhere
import { FiColumns } from "react-icons/fi";
import { PaginationTable } from '../../all/PaginationTable';
import { formatNumber } from '../../../helpers';

export function List(props) {
    const { t } = useTranslation();
    const { data } = props;
    const [columns, setColumns] = useState([]);

    useEffect(() => { setColumns([
            { 
                Header: <div style={{textAlign: 'left'}}>{t('profile.branch')}</div>, 
                accessor: 'column1', exLabel: t('profile.branch'), width: 140, minWidth: 110, 
                Cell: props => <div style={{ textAlign: 'left', paddingRight: 15 }}>{String(props?.value)}</div>,
            },
            { 
                Header: <div style={{textAlign: 'left'}}>{t('profile.time')}</div>, 
                accessor: 'column2', exLabel: t('profile.time'), width: 140, minWidth: 110, 
                Cell: props => <div style={{ textAlign: 'right', paddingRight: 15 }}>{String(props?.value)}</div>,
            },
            { 
                Header: <div style={{textAlign: 'right'}}>{t('profile.sales_num')}</div>, 
                accessor: 'column3',exLabel: t('profile.sales_num'), width: 140, minWidth: 110, 
                Cell: props => <div style={{ textAlign: 'right', paddingRight: 15 }}>{String(props?.value)}</div>, 
                Footer:info=> {const total = React.useMemo (() =>
                    info.rows.reduce((sum, row) => sum + parseFloat(row.values.column3), 0), [info.rows]);
                    return <div style={{ textAlign: 'right', paddingRight: 15 }}>{formatNumber(total)}</div>;}
            },
            { 
                Header: <div style={{textAlign: 'right'}}>{t('profile.sales_amount')}</div>, 
                accessor: 'column4',exLabel: t('profile.sales_amount'), width: 140, minWidth: 110, 
                Cell: props => <div style={{ textAlign: 'right', paddingRight: 15 }}>{String(props?.value)}</div>, 
                Footer:info=> {const total = React.useMemo (() =>
                    info.rows.reduce((sum, row) => sum + parseFloat(row.values.column4), 0), [info.rows]);
                    return <div style={{ textAlign: 'right', paddingRight: 15 }}>{formatNumber(total)}₮</div>;}
            },
            { 
                Header: <div style={{textAlign: 'right'}}>{t('profile.return_num')}</div>,
                accessor: 'column5',exLabel: t('profile.return_num'), width: 140, minWidth: 110, 
                Cell: props => <div style={{ textAlign: 'right', paddingRight: 15 }}>{String(props?.value)}</div>, 
                Footer:info=> {const total = React.useMemo (() =>
                    info.rows.reduce((sum, row) => sum + parseFloat(row.values.column5), 0), [info.rows]);
                    return <div style={{ textAlign: 'right', paddingRight: 15 }}>{formatNumber(total)}</div>;}
            },
            { 
                Header: <div style={{textAlign: 'right'}}>{t('profile.return_amount')}</div>, 
                accessor: 'column6',exLabel: t('profile.return_amount'), width: 140, minWidth: 110, 
                Cell: props => <div style={{ textAlign: 'right', paddingRight: 15 }}>{String(props?.value)}</div>, 
                Footer:info=> {const total = React.useMemo (() =>
                    info.rows.reduce((sum, row) => sum + parseFloat(row.values.column6), 0), [info.rows]);
                    return <div style={{ textAlign: 'right', paddingRight: 15 }}>{formatNumber(total)}₮</div>;}
            },
            { 
                Header: <div style={{textAlign: 'right'}}>{t('profile.sales_net')}</div>,
                accessor: 'column7', exLabel: t('profile.sales-net'), width: 140, minWidth: 110,
                Cell: props => <div style={{ textAlign: 'right', paddingRight: 15 }}>{String(props?.value)}</div>,
                Footer: info => {const total = React.useMemo(() =>
                    info.rows.reduce((sum, row) => sum + parseFloat(row.values.column7), 0), [info.rows]);
                    return <div style={{ textAlign: 'right', paddingRight: 15 }}>{formatNumber(total)}₮</div>;}
            }]);
    }, [t]); // Added t as dependency

    const tableInstance = useTable({
        columns,
        data,
        autoResetPage: false,
        autoResetSortBy: false,
        initialState: { pageIndex: 0, pageSize: 20, sortBy: [{ id: 'column1', desc: true }] }
    },
        useSortBy,
        usePagination
    );

    const tableProps = { tableInstance };

    const handleExportClick = () => {
        
    };

    return (
        <div className="rp_list">
            <h3>{t('page.export')}</h3>
            <div>
                <div className="ih_btn_row_z">
                    <Button className="rp_list_select" onClick={handleExportClick}>
                        <h3>{t('page.export')}</h3>
                    </Button>
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
