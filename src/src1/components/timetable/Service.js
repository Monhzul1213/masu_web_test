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
  const { visible, selected, closeModal, date , setDate} = props;
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [open, setOpen] = useState(false);
  const [dates, setDates] = useState([]);
  // const { user, token }  = useSelector(state => state.login);
  // const dispatch = useDispatch();
  const [time, setTime] = useState(['00:00' , '01:00']);

  useEffect(() => {
    // let dates = [];
    // let start = date[0].add(1, 'days')
    // while( date[0].format('YYYY-MM-DD') !== date[1].format('YYYY-MM-DD')){
    //     console.log(date)
    //     dates.push(start?.toDate())
    //     start = start.add(1, 'days');

    // }
    // let ifDate = date[0].format('YYYY-MM-DD') === date[1].format('YYYY-MM-DD')
    // console.log(dates)
    const start = new Date(date[0].format('YYYY-MM-DD'));
    const end = new Date(date[1].format('YYYY-MM-DD'));

    const daysBetween = (end.getTime() - start.getTime()) / (1000 * 3600 * 24);
    const arr = [];

    for (let i = 0; i <= daysBetween; i++) {
      const temp = new Date();
      temp.setDate(start.getDate() + i)
      arr.push(temp);
    }
    
    setDates(arr);
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
    console.log(item)
    
    return (
      <CheckBox label={item?.format('YYYY.MM.DD')} value={time} setValue={setTime}/>
    )
  }

  const maxheight= 'calc(90vh - 105px )';
  const btnProps = { onClickCancel: () => closeModal(), onClickSave, type: 'submit', show: selected ? true : false, onClickDelete };
  const confirmProps = { open, text: t('page.delete_confirm'), confirm: onDelete };
  const dateProps = { value: date, setValue: setDate, classBack: 'tm_date_back', className: 'rp_date' };

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