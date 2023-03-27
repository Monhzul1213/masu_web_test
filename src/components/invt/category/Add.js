import React, { useState, useEffect } from 'react';
import { SizeMe } from 'react-sizeme';
import { Modal, message } from 'antd';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';

import { icons1 } from '../../../assets';
import { sendRequest, deleteRequest, getConstants, setCategoryClass } from '../../../services';
import { ButtonRow, Error, Input, ModalTitle, Overlay, Confirm, Select } from '../../all';

export function Add(props){
  const { visible, closeModal, selected } = props;
  const { t } = useTranslation();
  const [name, setName] = useState({ value: '' });
  const [icon, setIcon] = useState(null);
  const [class1, setClass1] = useState({ value: 1 });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const { user, token }  = useSelector(state => state.login);
  const { categoryClass }  = useSelector(state => state.temp);
  const dispatch = useDispatch();

  useEffect(() => {
    if(visible) getData();
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible]);

  const getData = async () => {
    setError(null);
    setName({ value: selected?.categoryName ?? '' });
    const hasClass = selected?.class || selected?.class === 0;
    setClass1({ value: hasClass ? selected?.class : 1 });
    setIcon(hasClass ? selected?.icon : 1);
    getClasses();
  }

  const getClasses = async () => {
    if(!categoryClass?.length){
      setError && setError(null);
      setLoading(true);
      const response = await dispatch(getConstants(user, token, 'msCategory_Class', setCategoryClass));
      if(response?.error) setError && setError(response?.error);
      setLoading(false);
    }
  }

  const onClickSave = async e => {
    e?.preventDefault();
    setError(null);
    let nameLength = 2;
    let isNameValid = name?.value?.length >= nameLength;
    if(isNameValid && icon){
      setLoading(true);
      let data = selected
        ? { categoryId: selected?.categoryId, categoryName: name?.value, color: 0, icon, class: class1?.value }
        : { merchantID: user?.merchantId, categoryName: name?.value, color: 0, icon, class: class1?.value  };
      let api = selected ? 'Inventory/UpdateCategory' : 'Inventory/AddCategory';
      const response = await dispatch(sendRequest(user, token, api, data));
      if(response?.error) setError(response?.error);
      else {
        closeModal(true);
        message.success(t('category.add_success'));
      }
      setLoading(false);
    } else {
      if(!name?.value) setName({ value: '', error: t('error.not_empty') });
      else if(!isNameValid) setName({ value: name.value, error: ' ' + nameLength + t('error.longer_than') })
      if(!icon) setError(t('category.icon') + '' + t('error.not_empty'))
    }
  }

  const onClickDelete = () => setOpen(true);

  const onDelete = async sure => {
    setError(null);
    setOpen(false);
    if(sure){
      setLoading(true);
      const response = await dispatch(deleteRequest(user, token, 'Inventory/DeleteCategory/' + selected?.categoryId));
      setLoading(false);
      console.log(response);
      if(response?.error) setError(response?.error);
      else {
        closeModal(true);
        message.success(t('category.delete_success'));
      }
    }
  }

  const onChangeClass = value => {
    setClass1(value);
    setIcon(icons1[value?.value] && icons1[value?.value][0] && icons1[value?.value][0]?.value);
  }

  const renderItem = (item, index, width) => {
    const selected = item?.value === icon;
    const height = ((width ?? 360) - 50) / 5;
    const style = { width: height, height: height, borderColor: selected ? 'var(--icon-color)' : 'transparent' };
    return (
      <div key={index} className='color_btn' style={style} onClick={() => setIcon(item?.value)}>
        <img src={item?.icon} className={selected ? 'color_btn_active' : 'color_btn_icon'} alt={'icon' + (item?.value)} />
      </div>
    )
  }
  
  const confirmProps = { open, text: t('page.delete_confirm'), confirm: onDelete };
  const nameProps = { value: name, setValue: setName, label: t('category.name'), placeholder: t('category.name'), setError, length: 20 };
  const classProps = { value: class1, setValue: onChangeClass, label: t('category.class'), placeholder: t('category.class'), setError,
    data: categoryClass, s_value: 'valueNum', s_descr: 'valueStr1' };
  const btnProps = { onClickCancel: () => closeModal(), onClickSave, type: 'submit', show: selected ? true : false, onClickDelete };
  
  return (
    <Modal title={null} footer={null} closable={false} open={visible} centered={true} width={400}>
      {open && <Confirm {...confirmProps} />}
      <Overlay loading={loading}>
        <div className='m_back'>
          <ModalTitle icon='MdOutlineCategory' title={t(selected ? 'category.edit' : 'category.add')} isMD={true} />
          <div className='m_scroll'>
            <Input {...nameProps} />
            <Select {...classProps} />
            <SizeMe>{({ size }) => 
              <div className='color_back'>
                {icons1[class1?.value]?.map((item, index) => renderItem(item, index, size?.width))}
              </div>
            }</SizeMe>
            {error && <Error error={error} id='m_error' />}
          </div>
        </div>
        <ButtonRow {...btnProps} />
      </Overlay>
    </Modal>
  )
}