import React, { useState, useEffect } from 'react';
import { Dropdown, Modal, message } from 'antd';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';

import { Button, DynamicBSIcon, IconButton, Input } from '../../../components/all';
import { Service } from './Service';

export function Add(props){
  const { } = props;
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [visible, setVisible] = useState(false);

  // const { user, token }  = useSelector(state => state.login);
  // const dispatch = useDispatch();

  const onClickService = row => {
    setVisible(true);
    setOpen(false)
  }

  const closeModal = toGet => {
    setVisible(false);
  }

  const menu = () => {
    return (
      <div className='tm_menu'>
        <Button className='tm_menu_btn' text={t('timetable.service_time')} onClick={onClickService} />
        <Button className='tm_menu_btn' text={t('timetable.lesson')} onClick={'onClickSignout'} disabled={true} />
        <Button className='tm_menu_btn' text={t('timetable.measure')} onClick={'onClickSignout'} disabled={true}/>
      </div>
    );
  }

  const addProps = { visible, closeModal  }
  return (
    <div>
      {visible && <Service {...addProps}/>}
      <Dropdown overlay={menu} trigger='click' open={open} onOpenChange={setOpen}>
        <div className='add_row_back'>
          <IconButton className='add_row_btn' text={t('timetable' + '.add')} id='add_row_add'
          icon={<DynamicBSIcon name='BsPlusLg' className='add_row_icon' />}  />
        </div>
      </Dropdown>
    </div>

  )
}