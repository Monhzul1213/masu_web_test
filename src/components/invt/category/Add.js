import React, { useState, useEffect } from 'react';
import { Modal } from 'antd';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';

import { getConstants, sendRequest, setCategoryColors } from '../../../services';
import { ButtonRow, DynamicAIIcon, Error, Input, ModalTitle, Overlay } from '../../all';

export function Add(props){
  const { visible, closeModal } = props;
  const { t } = useTranslation();
  const [name, setName] = useState({ value: '' });
  const [color, setColor] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const { user, token }  = useSelector(state => state.login);
  const colors = useSelector(state => state.temp.categoryColors);
  const dispatch = useDispatch();

  useEffect(() => {
    getData();
    return () => {};
  }, []);

  const getData = async () => {
    if(!colors?.length){
      setLoading(true);
      const response = await dispatch(getConstants(user, token, 'msCategory_Color', setCategoryColors));
      if(response?.error) setError(response?.error);
      else setColor(response?.data && response?.data[0] && response?.data[0].valueNum);
      setLoading(false);
    } else
      setColor(colors[0].valueNum);
  }

  const onClickSave = async e => {
    e?.preventDefault();
    setError(null);
    if(name?.value?.trim() && color !== null){
      let data = { merchantID: user?.merchantId, categoryName: name?.value?.trim(), color };
      setLoading(true);
      const response = await dispatch(sendRequest(user, token, 'Inventory/AddCategory', data));
      console.log(response);
      if(response?.error) setError(response?.error);
      else {
        //close modal
        //get list again
        //show toast
      }
      setLoading(false);
    } else {
      if(!name?.value?.trim()) setName({ value: '', error: t('error.not_empty') });
      if(color === null) setError(t('category.color') + '' + t('error.not_empty'))
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
  
  const nameProps = { value: name, setValue: setName, label: t('category.name'), placeholder: t('category.name'), setError };
  
  return (
    <Modal title={null} footer={null} closable={false} open={visible} centered={true} width={400}>
      <Overlay loading={loading}>
        <div className='m_back'>
          <ModalTitle icon='MdOutlineCategory' title={t('category.add')} isMD={true} />
          <Input {...nameProps} />
          <div className='color_back'>
            {colors?.map(renderItem)}
          </div>
          {error && <Error error={error} id='m_error' />}
        </div>
        <ButtonRow onClickCancel={closeModal} onClickSave={onClickSave} type='submit' />
      </Overlay>
    </Modal>
  )
}