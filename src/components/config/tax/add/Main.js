import React from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';
import { withSize } from 'react-sizeme';

import { getList } from '../../../../services';
import { Input, Button, CheckBox, DescrInput } from '../../../all';

function Card(props){
  const { size, setError, setEdited, setLoading, regNo, setRegNo, name, setName, checked, setChecked, notes, setNotes, request  } = props;
  const { t } = useTranslation();
  const { user, token } = useSelector(state => state.login);
  const dispatch = useDispatch();
  const disabled = request ? true : false;

  const changeNo = value => {
    setRegNo(value);
    setName({ value: '' });
    setChecked(false);
  }

  const handleEnter = async e => {
    e?.preventDefault();
    if(regNo?.value){
      setLoading(true);
      setError(null);
      const response = await dispatch(getList(user, token, 'Merchant/Info?regno=' + regNo?.value));
      if(response?.error) setError(response?.error);
      else if(response?.data?.found){
        setName({ value: response?.data?.name });
        setChecked(response?.data?.vatpayer);
      } else {
        setError(t('tax.error'));
        setName({ value: '' });
        setChecked(false);
      }
      setLoading(false);
    } else setRegNo({ value: '', error: t('error.not_empty') });
  }

  const id = size?.width > 480 ? 'im_large' : 'im_small';
  const idRow = size?.width > 445 ? 'im_input_row_large' : 'im_input_row_small';
  const noProps = { value: regNo, setValue: changeNo, label: t('tax.reg_no'), placeholder: t('tax.reg_no'), setError, setEdited, handleEnter,
    inRow: true, noBlur: true, disabled };
  const btnProps = { className: 'co_check_btn', text: t('tax.check'), onClick: handleEnter };
  const nameProps = { value: name, setValue: setName, label: t('tax.name'), placeholder: t('tax.name'), inRow: true, disabled: true };
  const checkProps = { checked, setChecked, label: 'tax.checked', style: { marginTop: 0 }, disabled: true };
  const descrProps = { value: notes, setValue: setNotes, label: t('tax.note'), placeholder: t('tax.note'), disabled: true, inRow: true };
  
  return (
    <div className='add_back' id={id}>
      <div id={idRow} style={{marginTop: 0, flexFlow: 'row', alignItems: 'flex-end'}}>
        <Input {...noProps} />
        {!disabled && <div className='im_gap' />}
        {!disabled && <Button {...btnProps} />}
      </div>
      <div id={idRow} style={{flexFlow: 'column', marginTop: 15, marginBottom: 10}}>
        <Input {...nameProps} />
        <div className='im_gap' />
        <CheckBox {...checkProps} />
      </div>
      <DescrInput {...descrProps} />
    </div>
  );
}

const withSizeHOC = withSize();
export const Main = withSizeHOC(Card);