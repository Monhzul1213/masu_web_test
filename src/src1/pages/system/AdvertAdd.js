import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { message } from 'antd';
import  moment  from 'moment';
import '../../../css/invt.css';
import '../../../css/config.css';
import { getList, sendRequest } from '../../../services';
import { ButtonRowConfirm, Error1, Overlay, Prompt } from '../../components/all/all_m';
import { Main } from '../../components/system/advert/add';
import { urlToFile } from '../../../helpers';
import mime from 'mime';

export function AdvertAdd(){
  const [name, setName] = useState({ value: '' });
  const [link, setLink] = useState({ value: '' });
  const [image, setImage] = useState(null);
  const [image64, setImage64] = useState('');
  const [imageType, setImageType] = useState('');
  const [beginDate, setBeginDate] = useState({ value: moment() });
  const [endDate, setEndDate] = useState({ value: moment() });
  const [status, setStatus] = useState({ value: 1 });
  const [error, setError] = useState(null);
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  const [edited, setEdited] = useState(false);
  const { user, token }  = useSelector(state => state.login);
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [selected, setSelected ] = useState(null);
  const [searchParams] = useSearchParams();

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
    let adsId = searchParams?.get('adsId');
    if(adsId || adsId === 0) {GetAdv(adsId)} ;
  }

  const GetAdv = async (adsId ) => {
    setError(null);
    setLoading(true);
    let api = '?AdsId=' + adsId;
    let response = await dispatch(getList(user, token, 'Site/GetAdvertisement' + api,   ));
    setLoading(false);
    if(response?.error) setError(response?.error)
    else {    
      let ads = response?.data ;
      setSelected(ads)
      setItem(response?.data);
      setName({ value: ads?.adsName ?? '' });
      setBeginDate ({ value: moment(ads?.beginDate, 'yyyy.MM.DD') })
      setEndDate ({ value: moment(ads?.endDate, 'yyyy.MM.DD') })
      setLink({ value: ads?.imageLink ?? ''}); 
      setStatus({ value: ads?.status ?? 0  })
      getImage(ads);
      // response?.data?.forEach(item => item.rowStatus = 'U');
    }
  }

  const getImage = async advert => {
    if(advert?.file?.fileData){
      let type = advert?.file?.fileType?.replace('.', '');
      setImageType(type ?? '');
      let mimeType = mime.getType(type);
      let dataPrefix = `data:` + mimeType + `;base64,`;
      let attach64 = `${dataPrefix}${advert?.file?.fileData}`;
      let attachFile = await urlToFile(attach64, mimeType);
      setImage64(attach64);
      setImage(attachFile);
    }
  }


  const onLoad = () => {
    setError(null);
    setLoading(true);
    setEdited(false);

  }

  const onError = err => {
    setError('Зураг оруулна уу!');
    setLoading(false);
    setEdited(true);

  }

  const onSuccess = msg => {
    message.success(msg);
    setSaved(true);
    setLoading(false);
  }
 
  const onClickCancel = () =>  navigate('/system/advert');
 
  const checkValid = () => {
    if( name?.value?.trim()  ){
      return true;
    } else {
      if(!name?.value?.trim()) setName({ value: '', error: t('error.not_empty') });
    }
  }
  const onClickSave = async e => {
    e?.preventDefault();
    if(checkValid()){
      onLoad();
      setLoading(true);
      let data = [{
        adsID: selected ? selected?.adsId : -1,
        merchantType: user?.msMerchant?.merchantType,
        adsName: name?.value,
        beginDate: beginDate?.value?.format('yyyy.MM.DD'),
        endDate: endDate?.value?.format('yyyy.MM.DD'),
        image: { FileData: image64 ?? '', FileType: imageType ?? '' },
        imageLink: link?.value,
        status: status?.value,
        rowStatus: selected ? 'U' : 'I'
      }]
      const response = await dispatch(sendRequest(user, token, 'Site/ModAdvertisement', data));
      if(response?.error) onError(response?.error);
      else onSuccess(t('advert.add_success'));  
    } 
  }

  const onClickDelete = async () => {
    onLoad();
    let data = [{...selected, rowStatus: 'D', image : {}}]; 
    const response = await dispatch(sendRequest(user, token, 'Site/ModAdvertisement', data));
    if(response?.error) onError(response?.error, true);
    else onSuccess(t('advert.delete_success'), true);
  }
  
  const mainProps = { setError, name, setName, setLink, link , beginDate, setBeginDate, endDate, setEndDate, 
    image, setImage, setImage64, image64, setImageType, status, setStatus};
  const btnProps = { onClickCancel, onClickSave, onClickDelete, type: 'submit', show: item ? true:  false , id: 'btn_supp' };

  return (
    <Overlay className='i_container' loading={loading}>
      <Prompt edited={edited} />
      {error && <Error1 error={error} />}
      <div className='i_scroll'>
        <Main {...mainProps} />
      </div>
      <ButtonRowConfirm {...btnProps} />
    </Overlay>
  );
}