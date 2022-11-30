import React, { useState, useEffect } from 'react';
import { SizeMe } from 'react-sizeme';
import { Modal, message } from 'antd';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';

import { icons } from '../../../assets';
import { sendRequest, deleteRequest } from '../../../services';
import { ButtonRow, Error, Input, ModalTitle, Overlay, Confirm } from '../../all';

export function Add(props){
  const { visible, closeModal, selected } = props;
  const { t } = useTranslation();
  const [name, setName] = useState({ value: '' });
  const [icon, setIcon] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const { user, token }  = useSelector(state => state.login);
  const dispatch = useDispatch();

  useEffect(() => {
    if(visible) getData();
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible]);

  const getData = async () => {
    setName({ value: selected?.categoryName ?? '' });
    setIcon(selected?.icon ?? 1);
  }

  const onClickSave = async e => {
    e?.preventDefault();
    setError(null);
    let nameLength = 2;
    let isNameValid = name?.value?.length >= nameLength;
    if(isNameValid && icon){
      setLoading(true);
      let data = selected
        ? { categoryId: selected?.categoryId, categoryName: name?.value, color: 0, icon }
        : { merchantID: user?.merchantId, categoryName: name?.value, color: 0, icon };
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
      console.log(response);
      if(response?.error) setError(response?.error);
      else {
        closeModal(true);
        message.success(t('category.delete_success'));
      }
    }
  }

  const renderItem = (item, index, width) => {
    const selected = (index + 1) === icon;
    const height = (width - 50) / 5;
    const style = { width: height, height: height, borderColor: selected ? 'var(--icon-color)' : 'transparent' };
    return (
      <div key={index} className='color_btn' style={style} onClick={() => setIcon(index + 1)}>
        <img src={item} className={selected ? 'color_btn_active' : 'color_btn_icon'} alt={'icon' + (index + 1)} />
      </div>
    )
  }
  
  const confirmProps = { open, text: t('page.delete_confirm'), confirm: onDelete };
  const nameProps = { value: name, setValue: setName, label: t('category.name'), placeholder: t('category.name'), setError, length: 20 };
  const btnProps = { onClickCancel: () => closeModal(), onClickSave, type: 'submit', show: selected ? true : false, onClickDelete };
  
  return (
    <Modal title={null} footer={null} closable={false} open={visible} centered={true} width={400}>
      {open && <Confirm {...confirmProps} />}
      <Overlay loading={loading}>
        <div className='m_back'>
          <ModalTitle icon='MdOutlineCategory' title={t(selected ? 'category.edit' : 'category.add')} isMD={true} />
          <div className='m_scroll'>
            <Input {...nameProps} />
            <SizeMe>{({ size }) => 
              <div className='color_back'>
                {icons?.map((item, index) => renderItem(item, index, size?.width))}
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