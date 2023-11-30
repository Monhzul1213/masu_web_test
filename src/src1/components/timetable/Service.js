import React, { useState, useEffect } from 'react';
import { Modal, message } from 'antd';
import { useTranslation } from 'react-i18next';
// import { useSelector, useDispatch } from 'react-redux';
import { Icon } from '@iconify/react';
import moment from 'moment';

import { ButtonRow, Overlay, Error, Confirm, SelectTime } from '../all/all_m';
import { Button, DynamicAIIcon, Input, MonthRange } from '../../../components/all';
import { CheckBox } from './Checkbox';

export function Service(props){
  const { visible, selected, closeModal } = props;
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [open, setOpen] = useState(false);
  const [dates, setDates] = useState([]);
  const [date, setDate] = useState([moment(), moment().add(7, 'days')]);
  // const { user, token }  = useSelector(state => state.login);
  // const dispatch = useDispatch();
  const [time, setTime] = useState(['00:00' , '01:00']);

  useEffect(() => {
    daysBetween(date[0].format('YYYY-MM-DD'), date[1].format('YYYY-MM-DD'))
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onClickSave = async e => {
    e?.preventDefault();
    setError(null);
  }
 

  const onClickDelete = () => setOpen(true);

  const onDelete = async sure => {
    setError(null);
    setOpen(false);
  }
 

  const renderItem = item => {
    // console.log(item)
    return (
      <CheckBox label={item.toLocaleDateString("mn-MN", { weekday: 'long', year: 'numeric', month: '2-digit' , day: '2-digit'})} value={time} setValue={setTime}/>
    )
  }
  const onHide = () => {
    let query = '?BeginDate=' + date[0]?.format('yyyy.MM.DD') + '&EndDate=' + date[1]?.format('yyyy.MM.DD');
    // onSearch && onSearch(query, filter1, date);
  }
  const onChangeDate = value => {
    setDate(value)
    daysBetween(date[0].format('YYYY-MM-DD'), date[1].format('YYYY-MM-DD'))
  }

  const daysBetween = (startDate, endDate ) => {
    const diffTime = Math.abs(new Date(endDate) - new Date(startDate));
    const diffDays = 0|diffTime/864e5; 
    const arr = [];
    
    for(let i = 0; i <= diffDays; i++){
      const newdate = new Date(new Date(startDate).getTime()+(i*864e5));
      arr.push(newdate);
    }
    setDates(arr);
  }

  const maxheight= 'calc(90vh - 105px )';
  const btnProps = { onClickCancel: () => closeModal(), onClickSave, type: 'submit', show: selected ? true : false, onClickDelete };
  const confirmProps = { open, text: t('page.delete_confirm'), confirm: onDelete };
  const dateProps = { value: date, setValue: onChangeDate, classBack: 'tm_date_back', className: 'rp_date', onHide };

  return (
    <Modal title={null} footer={null} closable={false} open={visible} centered={true} width={500}>
      {open && <Confirm {...confirmProps} />}
      <Overlay loading={loading}>
        <div className='m_back'>
          <div className='m_title_row'>
            <Icon icon="mdi:timetable" className='tm_title_icon' />
            <p className='tm_title'>{t('timetable.service_date')}</p>
          </div> 
          <div>
            <MonthRange {...dateProps} />
          </div>         
          <div style={{ overflowY: 'scroll', maxHeight: maxheight }}>
            <form onSubmit={onClickSave}>
              {/* <CheckBox/> */}
              <div className='' >
                {dates?.map(renderItem)
                }
              </div>
            </form>
          </div>
          {error && <Error error={error} id = 'm_error' />}
        </div>
        <ButtonRow {...btnProps} />
      </Overlay>
    </Modal>
  )
}