import React, { useState } from 'react';
import { Dropdown } from 'antd';
import { useTranslation } from 'react-i18next';
// import { useSelector, useDispatch } from 'react-redux';

import { Button, DynamicBSIcon, IconButton } from '../../../../components/all';
import { Service } from './Service';

export function Add(props){
  const { day, site, sites, repeatType, onSearch, filter } = props;
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

  const addProps = { visible, closeModal , day, site, sites, repeatType, onSearch, filter }
  return (
    <div className='but_add_back'>
      {visible && <Service {...addProps}/>}
      <Dropdown overlay={menu} trigger='click' open={open} onOpenChange={setOpen}>
          <IconButton className='add_row_btn' text={t('timetable.' + 'add')} id='add_row_add'
          icon={<DynamicBSIcon name='BsPlusLg' className='add_row_icon' />}/>
      </Dropdown>
    </div>

  )
}