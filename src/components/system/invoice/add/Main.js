import React from 'react';
import { useTranslation } from 'react-i18next';
import { withSize } from 'react-sizeme';
import moment from 'moment';

import { CheckBox, Field } from '../../../all';

function Card(props){
  const { size, setEdited, invoice, approved1, setApproved1, approved2, setApproved2, editable1, editable2  } = props;
  const { t } = useTranslation();

  const onChange1 = value => {
    setEdited && setEdited(true);
    setApproved1(value);
  }

  const onChange2 = value => {
    setEdited && setEdited(true);
    setApproved2(value);
  }

  const id = size?.width > 480 ? 'im_large' : 'im_small';
  const idRow = size?.width > 445 ? 'im_input_row_large' : 'im_input_row_small';
  const custProps = { value: invoice?.label1, label: t('tax.customer'), inRow: true, disabled: true };
  const invProps = { value: invoice?.invoiceNo, label: t('invoice.invoice'), inRow: true, disabled: true };
  const typeProps = { value: invoice?.invoiceType, label: t('invoice.type'), inRow: true, disabled: true };
  const dateProps = { value: moment(invoice?.invoiceDate).format('yyyy.MM.DD HH:mm:ss'), label: t('page.date'),
    inRow: true, disabled: true };
  const timeProps = { value: invoice?.invoiceTime, label: t('invoice.time'), inRow: true, disabled: true };
  const statProps = { value: invoice?.statusName, label: t('order.status'), inRow: true, disabled: true };
  const beginProps = { value: invoice?.beginDate, label: t('invoice.begin'), inRow: true, disabled: true };
  const endProps = { value: invoice?.endDate, label: t('invoice.end'), inRow: true, disabled: true };
  const app1Props = { checked: approved1, setChecked: onChange1, label: 'invoice.approve1', style: { marginTop: 10, flex: 1 }, disabled: !editable1 };
  const app2Props = { checked: approved2, setChecked: onChange2, label: 'invoice.approve2', style: { marginTop: 10, flex: 1 }, disabled: !editable2 };
  const style = size?.width > 445 ? { marginBottom: 10 } : { flexFlow: 'column', marginBottom: 10 }

  return (
    <div className='add_back' id={id}>
      <div id={idRow} style={{ marginTop: 0 }}>
        <Field {...custProps} />
        <div className='im_gap' />
        <Field {...invProps} />
      </div>
      <div id={idRow} style={style}>
        <Field {...dateProps} />
        <div className='im_gap' />
        <Field {...typeProps} />
      </div>
      <div id={idRow} style={style}>
        <Field {...timeProps} />
        <div className='im_gap' />
        <Field {...statProps} />
      </div>
      <div id={idRow} style={style}>
        <Field {...beginProps} />
        <div className='im_gap' />
        <Field {...endProps} />
      </div>
      <div id={idRow} style={style}>
        <CheckBox {...app1Props} />
        <div className='im_gap' />
        <CheckBox {...app2Props} />
      </div>
    </div>
  );
}

const withSizeHOC = withSize();
export const Main = withSizeHOC(Card);