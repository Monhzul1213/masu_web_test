import React from 'react';
import { withSize } from 'react-sizeme';
import { useTranslation } from 'react-i18next';
import moment from 'moment';

import { DescrInput, Field } from '../../../all';

function Card(props){
  const { header, notes, setNotes, setEdited, size } = props;
  const { t } = useTranslation();

  const id = size?.width > 480 ? 'im_large' : 'im_small';
  const idRow = size?.width > 445 ? 'im_input_row_large' : 'im_input_row_small';
  const descrProps = { value: notes, setValue: setNotes, label: t('order.note'), placeholder: t('order.note'), setEdited, length: 100 };

  return (
    <div className='po_back' id={id}>
      <p className='ps_header_no'>{header?.orderNo}</p>
      <div id={idRow}>
        <Field label={t('order.vend')} value={header?.vendName} inRow={true} />
        <div className='im_gap' />
        <Field label={t('order.site')} value={header?.siteName} inRow={true} />
      </div>
      <div id={idRow}>
        <Field label={t('order.date')} value={moment(header?.orderDate, 'M/D/yyyy').format('yyyy.MM.DD')} inRow={true} />
        <div className='im_gap' />
        <Field label={t('order.req')} value={header?.reqDate} inRow={true} />
      </div>
      <DescrInput {...descrProps} />
    </div>
  );
}

const withSizeHOC = withSize();
export const Main = withSizeHOC(Card);