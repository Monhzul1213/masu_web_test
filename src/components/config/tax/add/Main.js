import React from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';
import { withSize } from 'react-sizeme';

import { getList, getServiceBar } from '../../../../services';
import { Input, Button, CheckBox, DescrInput, UploadImage } from '../../../all';

function Card(props){
  const { size, setError, setEdited, setLoading, regNo, setRegNo, name, setName, checked, setChecked, notes,
          setNotes, request, image, setImage, setImage64, setImageType, nomer, setNomer  } = props;
  const { t } = useTranslation();
  const { user, token } = useSelector(state => state.login);
  const dispatch = useDispatch();
  const disabled = request ? true : false;

  const changeNo = value => {
    setRegNo(value);
    setName({ value: '' });
    setNomer({ value: '' });
    setChecked(false);
  }

  const handleEnter = async e => {
    e?.preventDefault();
    if(regNo?.value){
      setLoading(true);
      setError(null);
      const response = await dispatch(getList(user, token, 'Merchant/Info?regno=' + regNo?.value));
      const response1 = await dispatch(getServiceBar('getTinInfo?regNo=' + regNo?.value));
      if(response?.error) setError(response?.error);
      else if(response?.data?.found){
        setName({ value: response?.data?.name });
        setNomer({ value: response1?.data?.data });
        setChecked(response?.data?.vatpayer);
      } else {
        setError(t('tax.error'));
        setName({ value: '' });
        setNomer({ value: '' });
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
  const imageProps = { image, setImage, setImage64, setImageType, setEdited, setError, className: 'im_image' };
  const nomerProps = { value: nomer, setValue: setNomer, label: t('tax.t_no'), placeholder: t('tax.t_no'), inRow: true, disabled: true };

  return (
    <div className='add_back' id={id}>
      <div className='ia_image_row'>
      <div style={{flex: 1}}>
        <div id={idRow} style={{marginTop: 0, flexFlow: 'row', alignItems: 'flex-end'}}>
          <Input {...noProps} />
          {!disabled && <div className='im_gap' />}
          {!disabled && <Button {...btnProps} />}
        </div>
        <div id={idRow} style={{flexFlow: 'column', marginTop: 15, marginBottom: 10}}>
          <Input {...nameProps} />
          <div className='im_gap' />
          <Input {...nomerProps} />
          <div className='im_gap' />
          <CheckBox {...checkProps} />
        </div>
        <DescrInput {...descrProps} />
        </div>
        <div>
          <p className='select_lbl_z'>{t('tax.label')}</p>
          <UploadImage {...imageProps}/>
        </div>
      </div>
    </div>
  );
}

const withSizeHOC = withSize();
export const Main = withSizeHOC(Card);