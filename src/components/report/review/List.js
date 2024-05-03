import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { usePagination, useSortBy, useTable } from 'react-table';
import { FooterTable } from '../../all';
import { PaginationTable } from '../../all/PaginationTable';
import { ExportExcel, formatNumber } from '../../../helpers';

export function List(props){
   
    const { t } = useTranslation();
    const { data } = props;
    const [columns, setColumns] = useState([]);
    
    useEffect(() => { 
        setColumns([
        { Header: <div style={{textAlign: 'left'}}>{t('profile.customer')}</div>, 
            accessor: 'consumerName', exLabel: t('profile.customer'), width: 140, minWidth: 110, Cell: props => <div style={{textAlign: 'left', paddingRight: 15}}>{String(props?.value)}</div>, 
            Footer: <div style={{textAlign: 'left'}}>{t('profile.sum')}</div>},
        { Header: <div style={{textAlign: 'right'}}>{t('profile.sale_sum')}</div>, 
            accessor: 'salesAmount', exLabel: t('profile.sale_sum'), width: 140, minWidth: 110, Cell: props => <div style={{textAlign: 'right', paddingRight: 15}}>{formatNumber(props?.value)}₮</div>,  
            Footer: info => { const total = React.useMemo(() =>
                info.rows.reduce((sum, row) => row.values.salesAmount + sum, 0), [info.rows]  )
                return <><div style={{textAlign: 'right', paddingRight: 15}}>{formatNumber(total)}₮ </div></>} },  
        { Header: <div style={{textAlign: 'right'}}>{t('profile.return_sum')}</div>, 
            accessor: 'returnAmount', exLabel: t('profile.return_sum'), width: 140, minWidth: 110, Cell: props => <div style={{textAlign: 'right', paddingRight: 15}}>{formatNumber(props?.value)}₮</div>,
            Footer: info => { const total = React.useMemo(() =>
                info.rows.reduce((sum, row) => row.values.returnAmount + sum, 0), [info.rows]  )
                return <><div style={{textAlign: 'right', paddingRight: 15}}>{formatNumber(total)} ₮ </div></>} },
        { Header: <div style={{textAlign: 'right'}}>{t('profile.purchase_number')}</div>, 
            accessor: 'column4', exLabel: t('profile.purchase_number'), width: 140, minWidth: 110, Cell: props => <div style={{textAlign: 'right', paddingRight: 15}}>{formatNumber(props?.value)}</div>, },
        { Header: <div style={{textAlign: 'right'}}>{t('profile.discount_amount')}</div>, 
            accessor: 'discountAmount', exLabel: t('profile.discount_amount'), width: 140, minWidth: 110, Cell: props => <div style={{textAlign: 'right', paddingRight: 15}}>{formatNumber(props?.value)}₮</div>,
            Footer: info => { const total = React.useMemo(() =>
                info.rows.reduce((sum, row) => row.values.discountAmount + sum, 0), [info.rows]  );
                return <><div style={{textAlign: 'right', paddingRight: 15}}>{formatNumber(total)}₮ </div></>} },
        { Header: <div style={{textAlign: 'right'}}>{t('profile.vaucher_amount')}</div>, 
            accessor: 'column6', exLabel: t('profile.vaucher_amount'), width: 140, minWidth: 110, Cell: props => <div style={{textAlign: 'right', paddingRight: 15}}>{formatNumber(props?.value)}</div>,},
        { Header: <div style={{textAlign: 'right'}}>{t('profile.cupon_amount')}</div>, 
            accessor: 'couponAmount ', exLabel: t('profile.cupon_amount'), width: 140, minWidth: 110, Cell: props => <div style={{textAlign: 'right', paddingRight: 15}}>{formatNumber(props?.value)}</div>, },
        { Header: <div style={{textAlign: 'right'}}>{t('profile.bonus_amount')}</div>, 
            accessor: 'salesCount', exLabel: t('profile.bonus_amount'), width: 140, minWidth: 110, Cell: props => <div style={{textAlign: 'right', paddingRight: 15}}>{formatNumber(props?.value)}</div>, },
        { Header: <div style={{textAlign: 'right'}}>{t('profile.sale_profits')}</div>, 
            accessor: 'rewardAmount', exLabel: t('profile.sale_profits'), width: 140, minWidth: 110, Cell: props => <div style={{textAlign: 'right', paddingRight: 15}}>{formatNumber(props?.value)} ₮ </div>, 
            Footer: info => { const total = React.useMemo(() =>
                info.rows.reduce((sum, row) => row.values.rewardAmount + sum, 0), [info.rows]  )
                return <><div style={{textAlign: 'right', paddingRight: 15}}>{formatNumber(total)} ₮ </div></>} },
        { Header: <div style={{textAlign: 'right'}}>{t('profile.discount_percentage')}</div>, 
            accessor: 'returnCount', exLabel: t('profile.discount_percentage'), width: 140, minWidth: 110, Cell: props => <div style={{textAlign: 'right', paddingRight: 15}}>{formatNumber(props?.value)}</div>, },
        ]);
        return () => {};
    }, []);

    const tableInstance = useTable({ columns, data, 
        autoResetPage: false,
        autoResetSortBy: false,
        initialState: { pageIndex:0, pageSize: 25, sortBy: [{ id:'consumerName', desc: true }] }},
        useSortBy, usePagination);

    const tableProps = { tableInstance };
    const exportExcelProps = { excelData: data, columns, fileName: 'exported_data', text: t('page.export') };

    return (

        <div className={'rp_list'}>
            <div>
                <div className={'ih_btn_row_z'}>
                    <ExportExcel {...exportExcelProps} />
                </div>
                <div style={{overflowX:'scroll'}}>
                    <div className='table_scroll' id='paging' style={{marginTop:10, overflowX:'scroll',minWidth:720,maxHeight:500 }}>
                        <FooterTable {...tableProps}/>
                    </div>
                </div>
                    <PaginationTable {...tableProps}/>
            </div>
        </div>
    );
}