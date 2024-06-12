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
import { Main , CardInvt} from '../../components/system/review/add';

export function ReviewAdd(){
  const { t } = useTranslation();
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
  const [rate, setRate] = useState(null);
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
    let reviewId = searchParams?.get('reviewId');
    if(reviewId || reviewId === 0) {GetRating(reviewId)} ;
  }

  const GetRating = async (reviewId ) => {
    setError(null);
    setLoading(true);
    let api = '?reviewId=' + reviewId;
    let response = await dispatch(getList(user, token, 'Merchant/GetReview' + api  ));
    setLoading(false);
    if(response?.error) setError(response?.error)
    else {    
      let review = response?.data && response?.data?.review && response?.data?.review[0] ;
      let ads1 = response?.data && response?.data?.reviewitem ;
      let ads2 = response?.data && response?.data?.summary;
      setRate(ads2)
      setSelected(review)
      setItem(response?.data);
      setType({ value : review?.reviewType })
      setBeginDate ({ value: moment(review?.beginDate, 'yyyy.MM.DD') })
      setEndDate ({ value: moment(review?.endDate, 'yyyy.MM.DD') })
      setText({ value: review?.text ?? ''}); 
      setStatus({ value: review?.status ?? 0  })
      setIsSendMail(review?.isSendMail === 'Y' )
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
 
  const onClickCancel = () =>  navigate('/system/rating');
 
  const checkValid = () => {
    let merchantIDs = [];
    if( text?.value?.trim() ){
      if(type?.value === "MERCHANT"){
        if(kits?.length){
          kits?.forEach(item => {
            merchantIDs.push(item?.merchantId);
          });
          dkits?.forEach(it => merchantIDs?.push({...it, rowStatus: 'D'}));
        } else {
          setSearchI({ value: searchI?.value, error: t('noti.kit_error') });
          return false;
        }
      } else {
        merchantIDs.push()
      }
      let data = [{
        reviewID: selected ? selected?.reviewId : -1,
        reviewType: type?.value,
        beginDate: beginDate?.value?.format('yyyy.MM.DD'),
        endDate: endDate?.value?.format('yyyy.MM.DD'),
        text: text?.value,
        status: status?.value,
        rowStatus: selected ? 'U' : 'I',
        merchantIDs
      }]
      return data;
    } else {
      if(!text?.value?.trim()) setText({ value: '', error: t('error.not_empty') });

    }
  }
  const onClickSave = async e => {
    e?.preventDefault();
    let data = checkValid()
    if(data){
      onLoad();
      setLoading(true);
      const response = await dispatch(sendRequest(user, token, 'Merchant/ModReview', data));
      if(response?.error) onError(response?.error);
      else onSuccess(t('rating.add_success'));  
    } 
  }

  const onClickDelete = async () => {
    onLoad();
    let data = [{
      reviewID: selected?.reviewId ,
      reviewType: type?.value,
      beginDate: beginDate?.value?.format('yyyy.MM.DD'),
      endDate: endDate?.value?.format('yyyy.MM.DD'),
      text: text?.value,
      status: status?.value,
      rowStatus: 'D',
      merchantIDs: [] }]; 
    const response = await dispatch(sendRequest(user, token, 'Merchant/ModReview', data));
    if(response?.error) onError(response?.error, true);
    else onSuccess(t('rating.delete_success'), true);
  }
  
  const mainProps = { setError, setText, text , beginDate, setBeginDate, endDate, setEndDate, 
    status, setStatus, type, setType , isSendMail, setIsSendMail, rate, selected};
  const btnProps = { onClickCancel, onClickSave, onClickDelete, type: 'submit', show: item ? true:  false , id: !kits?.length && type?.value !== 'MERCHANT' ? 'btn_rating' : 'btn_rating1' };
  const invtProps = { data: kits, setData: setKits, setError, setEdited, search: searchI, setSearch: setSearchI , setDKits};

  return (
    <Overlay className='i_container' loading={loading}>
      <Prompt edited={edited} />
      {error && <Error1 error={error} />}
      <div className='i_scroll'>
        <from>
            <Main {...mainProps} />
            <div className='gap_z' />
            {!kits?.length && type?.value !== 'MERCHANT' ? '' : <CardInvt {...invtProps} />}
        </from>
      </div>
      <ButtonRowConfirm {...btnProps} />
    </Overlay>
  );
}