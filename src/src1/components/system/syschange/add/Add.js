import React, { useState } from 'react';
import { Modal, message } from 'antd';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';
import moment from 'moment';

import { sendRequest } from '../../../../../services';
import { ButtonRow, ModalTitle, Overlay, Error, CardHtmlNote } from '../../../all/all_m';
import { Date, Input } from '../../../../../components/all';

export function Add(props){
  const { visible, closeModal, selected, onSearch, filter} = props;
  const { t } = useTranslation();
  const [subject, setSubject] = useState({ value: '' });
  const [text, setText] = useState({ value: '' });
  const [beginDate, setBeginDate] = useState({ value: moment() });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [edited, setEdited] = useState(false);
  const { user, token }  = useSelector(state => state.login);
  const dispatch = useDispatch();

  const handleEnter = e => {
    if (e?.key?.toLowerCase() === "enter") {
      const form = e.target.form;
      const index = [...form].indexOf(e.target);
      form.elements[index + 1].focus();
      e.preventDefault();
    }
}

const onLoad = () => {
  setError(null);
  setLoading(true);
  setEdited(false);

}

const onError = err => {
  setError(err);
  setLoading(false);
  setEdited(true);

}

const onSuccess = msg => {
  message.success(msg);
  // setSaved(true);
  setLoading(false);
}

const checkValid = () => {
  let notifItem = [];
  if( subject?.value?.trim() && text?.value?.trim()   ){
    let data = [{
      beginDate: beginDate?.value?.format('yyyy.MM.DD'),
      subject: subject?.value,
      text: text?.value,
      rowStatus: selected ? 'U' : 'I',
      notifItem
    }]
    return data;
  } else {
    if(!subject?.value?.trim()) setSubject({ value: '', error: t('error.not_empty') });
    if(!text?.value?.trim()) setText({ value: '', error: t('error.not_empty') });

  }
}

const onClickSave = async e => {
  e?.preventDefault();
  let data =checkValid()
  if(data){
    onLoad();
    setLoading(true);
    const response = await dispatch(sendRequest(user, token, 'System/ModNotification', data));
    if(response?.error) onError(response?.error);
    else onSuccess(t('noti.add_success'));  
  } 
}


  const maxheight= 'calc(90vh - 105px )';
  const subProps = { value: subject, setValue: setSubject, label: t('noti.subject'), placeholder: t('noti.subject'), setError, setEdited, length:100};
  const textProps = { value: text, setValue: setText, label: t('page.more'), placeholder: t('page.more'), setError, setEdited, handleEnter};
  const beginProps = { value: beginDate, setValue: setBeginDate, label: t('page.date'), inRow: true };

  const btnProps = { onClickCancel: () => closeModal(), onClickSave, type: 'submit' };

  return (
    <Modal title={null} footer={null} closable={false} open={visible} centered={true} width={550}>
      <Overlay loading={loading}>
        <div className='m_back'>
          <ModalTitle title={t('system.add')} />
          <div style={{ overflowY: 'scroll', maxHeight: maxheight }}>
            <form onSubmit={onClickSave}>
                <Date {...beginProps} />
                <Input {...subProps}  />
                <CardHtmlNote {...textProps} />
            </form>
          </div>
          {error && <Error error={error} id = 'm_error' />}
        </div>
        <ButtonRow {...btnProps} />
      </Overlay>
    </Modal>
  )
}