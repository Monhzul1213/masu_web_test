import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';
import { withSize } from 'react-sizeme';

import { getConstants } from '../../../../services';
import { Input, CheckBox, Select, DescrInput } from '../../../all';
import { UploadImage } from './Upload';

function Card(props){
  const { size, setError, setEdited, regNo, name, checked, status, setStatus, notes, setNotes, disabled, image } = props;
  const { t } = useTranslation();
  const [states, setStates] = useState([]);
  const [loading, setLoading] = useState(false);
  const { user, token } = useSelector(state => state.login);
  const dispatch = useDispatch();

  useEffect(() => {
    onFocusStatus();
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onFocusStatus = async () => {
    if(!states?.length){
      setLoading(true);
      const response = await dispatch(getConstants(user, token, 'msVATrequest_Status'));
      if(response?.error) setError && setError(response?.error);
      else setStates(response?.data?.sort((a, b) => a.valueNum - b.valueNum));
      setLoading(null);
    }
  }
  
  const id = size?.width > 480 ? 'im_large' : 'im_small';
  const idRow = size?.width > 445 ? 'im_input_row_large' : 'im_input_row_small';
  const noProps = { value: regNo, label: t('tax.reg_no'), placeholder: t('tax.reg_no'), inRow: true, disabled: true };
  const nameProps = { value: name, label: t('tax.name'), placeholder: t('tax.name'), inRow: true, disabled: true };
  const checkProps = { checked, label: 'tax.checked', style: { marginTop: 10, flex: 1 }, disabled: true };
  const statusProps = { value: status, setValue: setStatus, label: t('order.status'), data: states, setError, setEdited, s_value: 'valueNum',
    s_descr: 'valueStr1', onFocus: onFocusStatus, loading, inRow: true, disabled };
  const descrProps = { value: notes, setValue: setNotes, label: t('tax.note'), placeholder: t('tax.note'), inRow: true, disabled };
  const style = size?.width > 445 ? { marginBottom: 10 } : { flexFlow: 'column-reverse', marginBottom: 10 }
  const imageProps = { image, setEdited, setError, size };

  return (
    <div className='add_back' id={id}>
      <div className='ia_image_row'>
        <div style={{flex: 1}}>
          <div id={idRow} style={{ marginTop: 0 }}>
            <Input {...noProps} />
            <div className='im_gap' />
            <Input {...nameProps} />
          </div>
          <div id={idRow} style={style}>
            <Select {...statusProps} />
            <div className='im_gap' />
            <CheckBox {...checkProps} />
          </div>
          <DescrInput {...descrProps} />
        </div>
      <div className='add_image'>
          <p className='select_lbl_z'>{t('tax.label')}</p>
          <UploadImage {...imageProps} />
      </div>
      </div>
    </div>
  );
}

const withSizeHOC = withSize();
export const Main = withSizeHOC(Card);