import React, { useState, useEffect } from 'react';
import { Modal, message } from 'antd';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';

import { getConstants, sendRequest, deleteRequest, setCategoryColors } from '../../../services';
import { ButtonRow, DynamicAIIcon, Error, Input, ModalTitle, Overlay, Confirm } from '../../all';

export function Add(props){
  const { visible, closeModal, selected } = props;
  const { t } = useTranslation();
  const [name, setName] = useState({ value: '' });
  const [color, setColor] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const { user, token }  = useSelector(state => state.login);
  const colors = useSelector(state => state.temp.categoryColors);
  const dispatch = useDispatch();

  useEffect(() => {
    getData();
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getData = async () => {
    if(!colors?.length){
      setLoading(true);
      const response = await dispatch(getConstants(user, token, 'msCategory_Color', setCategoryColors));
      if(response?.error) setError(response?.error);
      else setColor(selected?.color ?? (response?.data && response?.data[0] && response?.data[0].valueNum));
      setLoading(false);
    } else
      setColor(selected?.color ?? colors[0].valueNum);
    setName({ value: selected?.categoryName ?? '' });
  }

  const onClickSave = async e => {
    e?.preventDefault();
    setError(null);
    if(name?.value?.trim() && color !== null){
      setLoading(true);
      let data = selected
        ? { categoryId: selected?.categoryId, categoryName: name?.value?.trim(), color }
        : { merchantID: user?.merchantId, categoryName: name?.value?.trim(), color };
      let api = selected ? ('Inventory/UpdateCategory/' + selected?.categoryId) : 'Inventory/AddCategory';
      const response = await dispatch(sendRequest(user, token, api, data));
      console.log(response);
      if(response?.error) setError(response?.error);
      else {
        closeModal(true);
        message.success(t('category.add_success'));
      }
      setLoading(false);
    } else {
      if(!name?.value?.trim()) setName({ value: '', error: t('error.not_empty') });
      if(color === null) setError(t('category.color') + '' + t('error.not_empty'))
    }
  }

  const onClickDelete = () => setOpen(true);

  const onDelete = async sure => {
    setError(null);
    setOpen(false);
    if(sure){
      setLoading(true);
      const response = await dispatch(deleteRequest(user, token, 'Inventory/DeleteCategory/' + selected?.categoryId));
      console.log(response);
      if(response?.error) setError(response?.error);
      else {
        closeModal(true);
        message.success(t('category.delete_success'));
      }
    }
  }

  const renderItem = (item, index) => {
    const selected = item?.valueNum === color;
    return (
      <div key={index} className='color_btn' style={{backgroundColor: item?.constKey}} onClick={() => setColor(item?.valueNum)}>
        {selected && <DynamicAIIcon className='color_icon' name='AiOutlineCheck' />}
      </div>
    )
  }
  
  const confirmProps = { open, text: t('page.delete_confirm'), confirm: onDelete };
  const nameProps = { value: name, setValue: setName, label: t('category.name'), placeholder: t('category.name'), setError };
  const btnProps = { onClickCancel: () => closeModal(), onClickSave, type: 'submit', show: selected ? true : false, onClickDelete };
  
  return (
    <Modal title={null} footer={null} closable={false} open={visible} centered={true} width={400}>
      {open && <Confirm {...confirmProps} />}
      <Overlay loading={loading}>
        <div className='m_back'>
          <ModalTitle icon='MdOutlineCategory' title={t(selected ? 'category.edit' : 'category.add')} isMD={true} />
          <Input {...nameProps} />
          <div className='color_back'>
            {colors?.map(renderItem)}
          </div>
          {error && <Error error={error} id='m_error' />}
        </div>
        <ButtonRow {...btnProps} />
      </Overlay>
    </Modal>
  )
}