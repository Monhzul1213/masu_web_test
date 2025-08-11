import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { message } from 'antd';
import  moment  from 'moment';
import '../../css/system.css';
import '../../../css/config.css';
import { getList, sendRequest } from '../../../services';
import { ButtonRowConfirm, Error1, Overlay, Prompt } from '../../components/all/all_m';
import { Main , CardInvt} from '../../components/system/notification/add';

export function NotiAdd(){
  const { t } = useTranslation();
  const [subject, setSubject] = useState({ value: '' });
  const [text, setText] = useState({ value: '' });
  const [beginDate, setBeginDate] = useState({ value: moment() });
  const [endDate, setEndDate] = useState({ value: moment() });
  const [status, setStatus] = useState({ value: 1 });
  const [type, setType] = useState({ value: "ALL" });
  const [error, setError] = useState(null);
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  const [edited, setEdited] = useState(false);
  const { user, token }  = useSelector(state => state.login);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [selected, setSelected ] = useState(null);
  const [searchParams] = useSearchParams();
  const [kits, setKits] = useState([]);
  const [searchI, setSearchI] = useState({ value: null });
  const [dkits, setDKits] = useState([]);
  const [isSendMail, setIsSendMail] = useState(false);


  useEffect(() => {
    user?.isAdmin ? getData() : navigate({ pathname: '/' });
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if(saved) onClickCancel();
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [saved]);



  const getData = async () => {
    let notifcationId = searchParams?.get('notifcationId');
    if(notifcationId || notifcationId === 0) {GetNoti(notifcationId)} ;
  }

  const GetNoti = async (notificationId ) => {
    setError(null);
    setLoading(true);
    let api = '?notificationId=' + notificationId;
    let response = await dispatch(getList(user, token, 'System/GetNotification' + api,   ));
    setLoading(false);
    if(response?.error) setError(response?.error)
    else {    
      let notif = response?.data && response?.data?.header && response?.data?.header[0] ;
      let ads1 = response?.data && response?.data?.item ;
      setSelected(notif)
      setItem(response?.data);
      setType({ value : notif?.notifcationType })
      setSubject({ value: notif?.subject ?? '' });
      setBeginDate ({ value: moment(notif?.beginDate, 'yyyy.MM.DD') })
      setEndDate ({ value: moment(notif?.endDate, 'yyyy.MM.DD') })
      setText({ value: notif?.text ?? ''}); 
      setStatus({ value: notif?.status ?? 0  })
      setIsSendMail(notif?.isSendMail === 'Y' )
      getKits(ads1)
    }
  }


  const getKits = item => {
    setKits(item)
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
    setSaved(true);
    setLoading(false);
  }
 
  const onClickCancel = () =>  navigate('/system/notification');
 
  const checkValid = () => {
    let notifItem = [];
    if( subject?.value?.trim() && text?.value?.trim()   ){
      if(type?.value === "MERCHANT"){
        if(kits?.length){
          kits?.forEach(item => {
            notifItem.push({ merchantID: item?.merchantId,
            showDate: item?.createdDate , isShow: 'N', 
            rowStatus: item?.notifcationId ? 'U' : 'I'});
          });
          dkits?.forEach(it => notifItem?.push({...it, rowStatus: 'D'}));
        } else {
          setSearchI({ value: searchI?.value, error: t('noti.kit_error') });
          return false;
        }
      } else {
        notifItem.push({merchantID: 135, showDate: '1900-01-01T00:00:00' , isShow: 'N' , rowStatus: item?.notifcationId  ? 'U' : 'I'})
      }
      let data = [{
        notificationID: selected ? selected?.notifcationId : -1,
        notificationType: type?.value,
        beginDate: beginDate?.value?.format('yyyy.MM.DD'),
        endDate: endDate?.value?.format('yyyy.MM.DD'),
        subject: subject?.value,
        text: text?.value,
        status: status?.value,
        rowStatus: selected ? 'U' : 'I',
        isSendMail: isSendMail ? 'Y' : 'N',
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

  const onClickDelete = async () => {
    onLoad();
    let data = [{notificationID: selected?.notifcationId ,
      notificationType: type?.value,
      beginDate: beginDate?.value?.format('yyyy.MM.DD'),
      endDate: endDate?.value?.format('yyyy.MM.DD'),
      subject: subject?.value,
      text: text?.value,
      status: status?.value,
      rowStatus:'D',
      isSendMail: isSendMail ? 'Y' : 'N',
      notifItem: [] }]; 
    const response = await dispatch(sendRequest(user, token, 'System/ModNotification', data));
    if(response?.error) onError(response?.error, true);
    else onSuccess(t('noti.delete_success'), true);
  }
  
  const mainProps = { setError, subject, setSubject, setText, text , beginDate, setBeginDate, endDate, setEndDate, 
    status, setStatus, type, setType , isSendMail, setIsSendMail};
  const btnProps = { onClickCancel, onClickSave, onClickDelete, type: 'submit', show: item ? true:  false , id: 'btn_supp' };
  const invtProps = { data: kits, setData: setKits, setError, setEdited,
    search: searchI, setSearch: setSearchI , setDKits };

  return (
    <Overlay className='i_container' loading={loading}>
      <Prompt edited={edited} />
      {error && <Error1 error={error} />}
      <div className='i_scroll'>
        <from>
            <Main {...mainProps} />
            <div className='gap_z' />
            {type?.value === "ALL" ? '' : <CardInvt {...invtProps} />}
        </from>
      </div>
      <ButtonRowConfirm {...btnProps} />
    </Overlay>
  );
}