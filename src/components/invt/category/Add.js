import React, { useState, useEffect } from 'react';
import { Modal } from 'antd';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';

import { getConstants } from '../../../services';
import { ButtonRow, DynamicAIIcon, Error, Input, ModalTitle, Overlay } from '../../all';

export function Add(props){
  const { visible, closeModal } = props;
  const { t } = useTranslation();
  const [name, setName] = useState({ value: '' });
  const [color, setColor] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const { user }  = useSelector(state => state.login);
  const colors = useSelector(state => state.temp.categoryColors);
  const dispatch = useDispatch();

  useEffect(() => {
    console.log(colors);
    getData();
    // setColor(colors && colors[0]);
    return () => {};
  }, []);

  const getData = async () => {
    const config = {
      method: 'GET',
      url: 'http://192.168.1.224:8989/System/GetConstants',
      headers: {
        // 'Content-Type': 'application/json',
        'authorization': 'cdbb56337f40ff4ea1627cdb6bc4541d',
        'Accept': '*/*',
        'ConstType': 'msCategory_Color'
      }, 
    };
    axios(config).then(res => {
      console.log(res);
    }).catch(error => {
      console.log(error);
    });
    return;
    if(!colors?.length){
      setLoading(true);
      dispatch(getConstants());
      console.log('getcolor')
      setLoading(false);
    }
  }

  const onClickSave = e => {
    e?.preventDefault();
    setError(null);
    if(name?.value?.trim() && color !== null){
      let data = { merchantID: user?.merchantId, categoryName: name?.value?.trim(), color };
      console.log(data);
      setLoading(true);
      setLoading(false);
    } else {
      if(!name?.value?.trim()) setName({ value: '', error: t('error.not_empty') });
      if(color === null) setError(t('category.color') + '' + t('error.not_empty'))
    }
  }

  const renderItem = (item, index) => {
    const selected = item === color;
    return (
      <div key={index} className='color_btn' style={{backgroundColor: item}} onClick={() => setColor(item)}>
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