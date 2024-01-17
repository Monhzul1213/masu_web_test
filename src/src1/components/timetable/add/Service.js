import React, { useState, useEffect } from "react";
import { Modal, message } from "antd";
import { useTranslation } from "react-i18next";
import { useSelector, useDispatch } from 'react-redux';

import { ButtonRow, Overlay, Error, Confirm, MonthRange, PlainSelect1 } from "../../all/all_m";
import { getList, sendRequest } from "../../../../services";
import { AddList } from "./AddList";
import moment from "moment";

export function Service(props) {
  const { visible, selected, closeModal, day, site, sites, date, setDate, repeatType } = props;
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [open, setOpen] = useState(false);
  const [checked, setChecked] = useState([]);
  const [repeat, setRepeat] = useState(false);
  const [dates, setDates] = useState([]);
  // const [date, setDate] = useState([moment(), moment().add(7, "days")]);
  const [emp, setEmp] = useState({value: null});
  const [emps, setEmps] = useState([]);
  const [invt, setInvt] = useState({value: null});
  const [invts, setInvts] = useState();
  const { user, token }  = useSelector(state => state.login);
  const dispatch = useDispatch();

  useEffect(() => { 
    onFocusEmp()
    onFocusInvt()
    daysBetween(date[0].format("YYYY-MM-DD"), date[1].format("YYYY-MM-DD"));
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const checkValid = () => {
    if(invt?.value && emp?.value){
      return true;
    } else {
      if(!invt?.value) setInvt({ value: null, error: t('profile.select') });
      if(!emp?.value) setEmp({ value: null, error: t('profile.select') });
    }
  }

  const onClickSave = async e => {
    e?.preventDefault();
    if(checkValid()){
    setError(null);
    // setLoading(true);
    let data = [];
    if( site === -1 ){
        sites?.forEach(list=> {
          if(list?.siteId !== -1){
            dates?.forEach(item=>{
               if(item?.checked) data.push({ scheduleID: selected ? selected?.scheduleID : -1, siteID: list?.siteId, descr: "", scheduleType: 0,
                status: 0, serviceID: invt?.value, employeeID: emp?.value, serviceTime: 0,
                schdDate: item?.date.format("YYYY-MM-DD dddd"),
                beginTime: item?.beginTime ? item?.beginTime?.replace(/-/g, '0') : '09:00', endTime: item?.endTime ? item?.endTime?.replace(/-/g, '0') : '18:00',
                isRepeat: repeat ? 1 : 0, repeatType: repeat ? repeatType : '', rowStatus: selected ? 'U' : 'I'
              })
            })
          }
        })
    } else {
      dates?.forEach(item=>{
         if(item?.checked) data.push({ scheduleID: selected ? selected?.scheduleID : -1, siteID: site, descr: "",  scheduleType: 0,
          status: 0, serviceID: invt?.value, employeeID: emp?.value, serviceTime: 0,
          schdDate: item?.date.format("YYYY-MM-DD dddd"),
          beginTime: item?.beginTime ? item?.beginTime?.replace(/-/g, '0') : '09:00',
          endTime: item?.endTime ? item?.endTime?.replace(/-/g, '0') : '18:00', isRepeat: repeat ? 1 : 0, repeatType: repeat ? repeatType : '', rowStatus: selected ? 'U' : 'I'
        })
      })
    }
    if(data?.length){ 
      const response = await dispatch(sendRequest(user, token, 'Txn/ModSchedule',  data));
      setLoading(false);
      if(response?.error) setError(response?.error);
      else {
        closeModal(true);
        message.success(t('timetable.add_success'));
      }
    } else setError(t('timetable.schedule_error'))
    }
  }

  const onClickDelete = () => setOpen(true);

  const onDelete = async (sure) => {
    setError(null);
    setOpen(false);
  };

  const onFocusEmp = async () => {
    if(!emps?.length){
      setError && setError(null);
      setLoading('emps');
      const response = await dispatch(getList(user, token, 'Employee/GetEmployees'));
      if(response?.error) setError && setError(response?.error);
      else {
        setEmps(response?.data);
      }
      setLoading(false);
    }
  }
  
  const onFocusInvt = async () => {
    if(!invts?.length){
      setError && setError(null);
      setLoading('invts');
      const response = await dispatch(getList(user, token, 'Inventory/GetInventory'));
      if(response?.error) setError && setError(response?.error);
      else {
        let invts = [];
        response?.data?.inventoryies?.forEach(item => {
          if(item?.msInventory?.isService === 'Y') {
            invts.push(item?.msInventory)}})
        setInvts(invts)
      }
      setLoading(false);
    }
  }

  const onHide = () => {
    daysBetween(date[0].format("YYYY-MM-DD"), date[1].format("YYYY-MM-DD"));
  };

  const daysBetween = (startDate, endDate) => {
    const diffTime = Math.abs(moment(new Date(endDate)) - moment(new Date(startDate)));
    const diffDays = 0 | (diffTime / 864e5);
    const arr = [];

    for (let i = 0; i <= diffDays; i++) {
      const newdate = moment(new Date(moment(new Date(startDate).getTime()) + i * 864e5));
      arr.push({date: newdate});
    }
    setDates(arr);
  };

  const onChangeEmp = value => {
    setEmp(value)
  }
  const onChangeInvt = value => {
    setInvt(value)
  }

  const maxheight = "calc(90vh - 105px )";
  const classBack = 'tm_select_back1', className = 'tm_select_add';
  const btnProps = { onClickCancel: () => closeModal(), onClickSave, type: "submit", show: selected ? true : false, onClickDelete, check : true, 
                    label: t("timetable.repeat"), checked: repeat, setChecked: setRepeat};
  const confirmProps = { open, text: t("page.delete_confirm"), confirm: onDelete, };
  const dateProps = { value: date, setValue: setDate, classBack: "tm_date_back", className: "rp_date", onHide, id: 'tm_btn1', id1: 'tm_btn2', className1: 'tm_btn'  };
  const tableProps = { setData: setDates, setChecked, data: dates, checked, day };
  const empProps = { value: emp, setValue: onChangeEmp, data: emps, s_value: 'empCode', s_descr: 'empName', onHide, setError,
  classBack, className, onFocus: onFocusEmp, loading: loading === 'emps', placeholder: t('employee.add') , label: t('employee.title') };
  const invtProps = { value: invt, setValue: onChangeInvt, data: invts, s_value: 'invtId', s_descr: 'name', onHide, setError,
  classBack, className, onFocus: onFocusInvt, loading: loading === 'emps', placeholder: t('timetable.service_add'), label: t('report.invtName') };

  return (
    <Modal title={null} footer={null} closable={false} open={visible} centered={true} width={550}>
      {open && <Confirm {...confirmProps} />}
      <Overlay loading={loading}>
        <div className="m_back">
          <div className="tm_title_row">
            <p className="tm_title">{t("timetable.service_date")}</p>
          </div>
          <MonthRange {...dateProps} />
          <div className="form_back" id="list_scroll" style={{ overflowY: "scroll", maxHeight: maxheight }}>
            <form onSubmit={onClickSave}>
              <AddList {...tableProps}/>
            </form>
          </div>
          <div className="tm_add_back">
            <PlainSelect1 {...invtProps}/>
            <PlainSelect1 {...empProps}/>
          </div>
          {error && <Error error={error} id="m_error" />}
        </div>
        <ButtonRow {...btnProps} />
      </Overlay>
    </Modal>
  );
}
