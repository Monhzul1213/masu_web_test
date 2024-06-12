import React from 'react';
import { useTranslation } from 'react-i18next';

import { Money } from '../../../all';

export function PDF1(props){
  const { order, items, adds } = props;
  const { t } = useTranslation();

  const Field = ({ label, value }) => {
    return (
      <div className='po_pdf_row'>
        <p className='po_pdf_label'>{t('order.' + label)} : </p>
        <p className='po_pdf_value'>{value}</p>
      </div>
    )
  }

  return (
    <div style={{height: 0, width: 0, overflow: 'hidden'}}>
      <div className='a4_back' id='order_pdf'>
        <p className='po_pdf_title'>{t('order.title')} {order?.orderNo}</p>
        <Field label='date' value={order?.orderDate} />
        {order?.reqDate ? <Field label='req' value={order?.reqDate} /> : null}
        <Field label='created' value={order?.createdUserName} />
        <div className='po_pdf_col_back'>
          <div className='po_pdf_col'>
            <p className='po_pdf_label'>{t('order.vend')}:</p>
            <p className='po_pdf_value'>{order?.vendName}</p>
            {order?.vendAddress ? <p className='po_pdf_value'>{order?.vendAddress}</p>: null}
            {order?.vendPhone ? <p className='po_pdf_value'>{order?.vendPhone}</p>: null}
            {order?.vendEmail ? <p className='po_pdf_value'>{order?.vendEmail}</p>: null}
          </div>
          <div className='po_pdf_col_gap' />
          <div className='po_pdf_col'>
            <p className='po_pdf_label'>{t('order.site')}:</p>
            <p className='po_pdf_value'>{order?.siteName}</p>
            {order?.siteAddress ? <p className='po_pdf_value'>{order?.siteAddress}</p>: null}
            {order?.sitePhone ? <p className='po_pdf_value'>{order?.sitePhone}</p>: null}
          </div>
        </div>
        <div className='po_pdf_table_header'>
          <p className='po_pdf_table_header_text' style={{width: '40%', textAlign: 'left'}}>{t('inventory.title')}</p>
          <p className='po_pdf_table_header_text' style={{width: '15%'}}>{t('order.t_qty1')}</p>
          <p className='po_pdf_table_header_text' style={{width: '20%'}}>{t('order.t_cost')}</p>
          <p className='po_pdf_table_header_text' style={{width: '25%'}}>{t('order.t_total')}</p>
        </div>
        {items?.map((item, index) => {
          return (
          <div key={'i' + index} className='po_pdf_table_row'>
              <p className='po_pdf_table_row_text' style={{width: '40%', textAlign: 'left'}}>{item?.invtName}</p>
              <p className='po_pdf_table_row_text' style={{width: '15%'}}>{item?.orderTotalQty}</p>
              <p className='po_pdf_table_row_text' style={{width: '20%'}}><Money value={item?.cost} fontSize={14} /> </p>
              <p className='po_pdf_table_row_text' style={{width: '25%'}}><Money value={item?.totalCost} fontSize={14} /></p>
            </div>
          );
        })}
        {adds?.map((item, index) => {
          return (
          <div key={'a' + index} className='po_pdf_table_row'>
              <p className='po_pdf_table_row_text' style={{width: '40%', textAlign: 'left'}}>{item?.addCostName}</p>
              <p className='po_pdf_table_row_text' style={{width: '15%'}}>1</p>
              <p className='po_pdf_table_row_text' style={{width: '20%'}}><Money value={item?.addCostAmount} fontSize={14} /> </p>
              <p className='po_pdf_table_row_text' style={{width: '25%'}}><Money value={item?.addCostAmount} fontSize={14} /></p>
            </div>
          );
        })}
        <div className='po_pdf_table_footer'>
          <p className='po_pdf_table_header_text' style={{width: '40%', textAlign: 'left'}}></p>
          <p className='po_pdf_table_header_text' style={{width: '15%'}}></p>
          <p className='po_pdf_table_header_text' style={{width: '20%'}}>{t('order.f_total')}</p>
          <p className='po_pdf_table_header_text' style={{width: '25%'}}><Money value={order?.total} fontSize={14} /></p>
        </div>
      </div>
    </div>
  )
}