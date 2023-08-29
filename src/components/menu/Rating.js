import React, { useState } from 'react';
import { message, Modal, Rate } from 'antd';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';

import { sendRequest } from '../../services';
import { DescrInput, DynamicAIIcon, Button, Error } from '../all';

export function Rating(props){
  const { review, setReview } = props;
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [rating, setRating] = useState(0);
  const [descr, setDescr] = useState({ value: '' });
  const [height, setHeight] = useState(110);
  const [error, setError] = useState(null);
  const { user, token } = useSelector(state => state.login);
  const dispatch = useDispatch();
  const open = review ? true : false;

  const onChangeRating = value => {
    setRating(value);
    setHeight(value === 5 ? 0 : 110);
  }

  const onClickCancel = () => setReview(false);

  const onClickSave = async e => {
    e?.preventDefault();
    setError(null);
    setLoading(true);
    let ratingText = rating === 5 ? '' : (descr?.value ?? '');
    let data = { reviewID: review?.reviewId, rating, ratingText };
    let response = await dispatch(sendRequest(user, token, 'Merchant/ModReviewItem', data));
    if(response?.error) setError(response?.error);
    else {
      onClickCancel();
      message.success(t('rating.success'));
    }
    setLoading(false);
  }

  const style = { overflow: 'hidden', transition: 'height 0.2s ease-in', height };
  const disabled = rating !== 5 && !descr?.value?.trim();

  return (
    <Modal title={null} footer={null} closable={false} open={open} centered={true} width={360}>
      <div className='m_back'>
        {/* <DynamicAIIcon className='m_rate_close' name='AiOutlineClose' onClick={onClickCancel} /> */}
        <p className='m_title' id='m_rating'>{review?.text}</p>
        <div className='m_rate_back'>
          <Rate
            allowHalf={false}
            defaultValue={0}
            value={rating}
            style={{fontSize: 27}}
            onChange={onChangeRating} />
        </div>
        <div style={style}>
          <DescrInput
            id_back='rate_back'
            id='rate_input'
            value={descr}
            setValue={setDescr}
            placeholder={t('rating.descr')}
            length={200} />
          <p className='rate_length'>{descr?.value?.length}/200</p>
        </div>
        {error && <Error error={error} id='m_error' />}
      </div>
      <Button loading={loading} className='rate_btn' text={t('rating.send')} disabled={disabled} onClick={onClickSave} />
      <div className='gap' />
    </Modal>
  );
}