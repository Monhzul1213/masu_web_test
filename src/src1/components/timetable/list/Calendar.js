import React, { useEffect, useState } from 'react';
import {Calendar, momentLocalizer} from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { ImCheckboxChecked } from 'react-icons/im';
import moment from 'moment';

import { Day } from './Day';
import { Drawer } from './Drawer';
import { Filter } from './Filter';
import { weekCheck } from '../../../../helpers';

export function BigCalendar(props){
  // const { t } = useTranslation();
  const { view, handleViewChange, datas, onSearch, size, data, setError, filter } = props;
  const [selected, setSelected] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [open, setOpen] = useState(false);
  const [sDate, setSDate] = useState(moment());
  const [date, setDate] = useState([moment().startOf('week'), moment().endOf('week')]);
  const [classH, setClassH] = useState('tm_cal_back1');
  const [font, setFont] = useState('event_icon');
  const [day, setDay] = useState("7 хоног");

  useEffect(() => {
    if(size?.width >= 850) setClassH('tm_cal_back1');
    else if(size?.width < 850 && size?.width >= 410) setClassH('tm_cal_back2');
    else setClassH('tm_cal_back3');
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [size?.width]);

  useEffect(() => {
    if(view === 'day') setFont('event_label');
    else if(view === 'week') setFont('event_label1');
    else if(view === 'work_week') setFont('event_label1');
    else setFont('event_label3');
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [view]);


  moment.locale('ko', { week: { dow: 1, doy: 1}});
  const localizer = momentLocalizer(moment);

  const customFormats = {
    dayFormat: (date, culture, localizer) => weekCheck(localizer.format(date, 'ddd', culture)) + localizer.format(date, 'MM/DD', culture),
    timeGutterFormat: 'HH:mm',
    dayHeaderFormat: (date, culture, localizer) => weekCheck(localizer.format(date, 'ddd', culture)) + localizer.format(date, 'MM/DD', culture)  
  };

  const customMonthHeader = ({ label }) => {
    return (
        <span>{label === 'Mon' ? 'Даваа' : label === 'Tue' ? 'Мягмар' : label === 'Wed' ? 'Лхагва' : label === 'Thu' ? 'Пүрэв'
              : label === 'Fri' ? 'Баасан': label === 'Sat' ? 'Бямба': label === 'Sun' ? 'Ням' : ''}
        </span>
    )};

  const customToolbar = (toolbar) => {
      const { label } = toolbar;
      return (
        <div className="custom-toolbar">{view === 'day' ?  <span>{label}</span>: null}</div>
  )};

  const navigateContants = {
    PREVIOUS: 'PREV',
    NEXT: 'NEXT',
    TODAY: 'TODAY',
    DATE: 'DATE'
  };

  const CustomEvent = ({ event }) => (
    <>
    {view !== 'month' ? 
      <div style={{padding: 5}} >
        <div className='row'>
          <ImCheckboxChecked className='event_icon'/>
          <div className='row'>
            <p className={font}>
              {event?.item?.beginTime.split(':')[0] + ':' + event?.item?.beginTime.split(':')[1]}{'-'}
              {event?.item?.endTime.split(':')[0] + ':' + event?.item?.endTime.split(':')[1]}
            </p>
          </div>
        </div> 
        <p className={font}>{event?.item?.empName}{event?.item?.siteId}</p>
        <div className={font}>{event.title}</div> 
        {/* <div>{'Zahialagch: '} {event?.item?.employeeId}</div> */}
      </div>
      : 
      <div className='row'>
        <ImCheckboxChecked className='event_icon'/>
        <p className={font}>{event?.item?.beginTime.split(':')[0] + ':' + event?.item?.beginTime.split(':')[1]}</p>
        <p className={font}>{event?.item?.empName}</p>
      </div> 
    }
    </>
    
  );

  const components = {
    month: { header: customMonthHeader },
    toolbar: customToolbar,
    event: CustomEvent
  };

  const handleSelectEvent = (event, target) =>{
    setSelected(event);
    setOpen(true);
  }


  const onNavigate = (date, view) =>{
    setOpen(false)
    setDate([moment(date), moment(date)])
    setSelectedDate(date);  
    setSDate(moment(date));
    if(view === 'day' || view === 'month' || view === 'week' || view === 'work_week') setDay('Өдөр');
    else setDay(view);
  } 


  const dayProps = { onNavigate, value: sDate, setValue: setSDate, onSearch}
  const drawerProps = { selected, open, setOpen };
  let filterProps = { onSearch, size, setError, data, handleViewChange, day, setDay, navigateContants, onNavigate, date, setDate, setSDate, filter};

  return (
    <div >
      <Filter {...filterProps} />
      <Drawer {...drawerProps}/>
      <div className={classH}>
        {view === 'day' && <Day {...dayProps}/>}
        <Calendar localizer={localizer} 
            min={new Date().setHours(8, 0, 0)} 
            className='tm_calendar'
            view={view} 
            events={datas}
            startAccessor="start"
            endAccessor="end"
            timeslots={4}
            step={15}
            customDayHeader={2}
            views={['month', 'week', 'work_week', 'day']}
            onView={ handleViewChange}
            date={selectedDate}
            onNavigate={onNavigate}
            formats={customFormats}
            components={components}
            onSelectEvent={handleSelectEvent}
        />
      </div>
    </div>
    
  );
}