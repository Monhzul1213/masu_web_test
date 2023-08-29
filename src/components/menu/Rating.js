import React, { useState } from 'react';
import { Modal, Rate } from 'antd';
import { useTranslation } from 'react-i18next';

import { DescrInput, DynamicAIIcon, Button } from '../all';

export function Rating(props){
  const { review, setReview } = props;
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [rating, setRating] = useState(5);
  const [descr, setDescr] = useState({ value: '' });
  const [height, setHeight] = useState(0);
  const open = review ? true : false;

  const onChangeRating = value => {
    setRating(value);
    setHeight(value === 5 ? 0 : 100);
  }

  const onClickCancel = () => setReview(false);

  const onClickSave = async () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 600);
  }

  const style = { overflow: 'hidden', transition: 'height 0.2s ease-in', height };
  const disabled = rating !== 5 && !descr?.value?.trim();

  return (
    <Modal title={null} footer={null} closable={false} open={open} centered={true} width={360}>
      <div className='m_back'>
        {/* <DynamicAIIcon className='m_rate_close' name='AiOutlineClose' onClick={onClickCancel} /> */}
        <p className='m_title' id='m_rating'>{review?.text}</p>
        <div className='m_rate_back'>
          <p className='select_lbl'>{t('rating.rate')}</p>
          <Rate
            allowHalf={true}
            defaultValue={5}
            value={rating}
            onChange={onChangeRating} />
        </div>
        <div style={style}>
          <DescrInput
            id='rate_input'
            value={descr}
            setValue={setDescr}
            label={t('rating.descr')}
            placeholder={t('rating.descr')}
            length={300} />
        </div>
      </div>
      <Button loading={loading} className='rate_btn' text={t('rating.send')} disabled={disabled} onClick={onClickSave} />
      <div className='gap' />
    </Modal>
  );
}