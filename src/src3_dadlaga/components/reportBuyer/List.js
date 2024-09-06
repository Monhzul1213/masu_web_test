import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { usePagination, useSortBy, useTable, useBlockLayout, useResizeColumns, useRowSelect } from 'react-table';

import { PaginationTable, TableRowResize } from '../../../components/all';
import { formatNumber } from '../../../helpers';
import { Header } from '../../../src1/components/report/employee';

export function List(props){
    const { data, excelName } = props;
    const { t, i18n } = useTranslation();
    const [columns, setColumns] = useState([]);
    
    useEffect(() => { 
        setColumns([
        { Header: <div style={{textAlign: 'left'}}>{t('report_buyer.customer')}</div>, accessor: 'consumerName', exLabel: t('report_buyer.customer'), 
            Cell: props => <div style={{textAlign: 'left', paddingRight: 15}}>{props?.value}</div>, width: 180, minWidth: 110, 
            Footer: <div style={{textAlign: 'left'}}>{t('report_buyer.sum')}</div>},
        { Header: <div style={{textAlign: 'right'}}>{t('report_buyer.sale_sum')}</div>, accessor: 'salesAmount', exLabel: t('report_buyer.sale_sum'), width: 160, minWidth: 110, 
            Cell: props => <div style={{textAlign: 'right', paddingRight: 15}}>{formatNumber(props?.value)}₮</div>,  
            Footer: info => { const total = React.useMemo(() =>
                info.rows.reduce((sum, row) => row.values.salesAmount + sum, 0), [info.rows]  )
                return <><div style={{textAlign: 'right', paddingRight: 15}}>{formatNumber(total)}₮ </div></>} },  
        { Header: <div style={{textAlign: 'right'}}>{t('report_buyer.return_sum')}</div>, accessor: 'returnAmount', exLabel: t('report_buyer.return_sum'), width: 150, minWidth: 110, 
            Cell: props => <div style={{textAlign: 'right', paddingRight: 15}}>{formatNumber(props?.value)}₮</div>,
            Footer: info => { const total = React.useMemo(() =>
                info.rows.reduce((sum, row) => row.values.returnAmount + sum, 0), [info.rows]  )
                return <><div style={{textAlign: 'right', paddingRight: 15}}>{formatNumber(total)} ₮ </div></>} },
        { Header: <div style={{textAlign: 'right'}}>{t('report_buyer.discount_amount')}</div>, accessor: 'discountAmount', exLabel: t('report_buyer.discount_amount'), width: 150, minWidth: 110, 
            Cell: props => <div style={{textAlign: 'right', paddingRight: 15}}>{formatNumber(props?.value)}₮</div>,
            Footer: info => { const total = React.useMemo(() =>
                info.rows.reduce((sum, row) => row.values.discountAmount + sum, 0), [info.rows]  );
                return <><div style={{textAlign: 'right', paddingRight: 15}}>{formatNumber(total)}₮ </div></>} },
        { Header: <div style={{textAlign: 'right'}}>{t('report_buyer.cupon_amount')}</div>, 
            accessor: 'couponAmount ', exLabel: t('report_buyer.cupon_amount'), width: 120, minWidth: 80, 
            Cell: props => <div style={{textAlign: 'right', paddingRight: 15}}>{formatNumber(props?.value)}₮</div>, },
        { Header: <div style={{textAlign: 'right'}}>{t('report_buyer.bonus_amount')}</div>, 
            accessor: 'salesCount', exLabel: t('report_buyer.bonus_amount'), width: 160, minWidth: 110, 
            Cell: props => <div style={{textAlign: 'right', paddingRight: 15}}>{formatNumber(props?.value)}₮</div>, },
        { Header: <div style={{textAlign: 'right'}}>{t('report_buyer.sale_profits')}</div>, 
            accessor: 'rewardAmount', exLabel: t('report_buyer.sale_profits'), width: 160, minWidth: 110, 
            Cell: props => <div style={{textAlign: 'right', paddingRight: 15}}>{formatNumber(props?.value)} ₮ </div>, 
            Footer: info => { const total = React.useMemo(() =>
                info.rows.reduce((sum, row) => row.values.rewardAmount + sum, 0), [info.rows]  )
                return <><div style={{textAlign: 'right', paddingRight: 15}}>{formatNumber(total)} ₮ </div></>} },
        { Header: <div style={{textAlign: 'right'}}>{t('report_buyer.discount_percentage')}</div>, 
            accessor: 'returnCount', exLabel: t('report_buyer.discount_percentage'), width: 150, minWidth: 110, 
            Cell: props => <div style={{textAlign: 'right', paddingRight: 15}}>{props?.value}%</div>, },
        ]);
        return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [i18n?.language]);

    const tableInstance = useTable({ columns, data, 
        autoResetPage: false,
        autoResetSortBy: false,
        initialState: { pageIndex:0, pageSize: 25, sortBy: [{ id:'consumerName', desc: true }] }},
        useSortBy, usePagination, useBlockLayout, useResizeColumns, useRowSelect);

    const tableProps = { tableInstance, hasFooter: true };
    const exportProps = { data, columns, excelName};

    return (
        <div className={'rp_list'}>
            <Header {...exportProps}/>
            <div className='table_scroll' id='paging' style={{marginTop:10, overflow:'scroll',minWidth:720,maxHeight:500 }}>
                <TableRowResize {...tableProps}/>
            </div>
                <PaginationTable {...tableProps}/>
        </div>
    );
}