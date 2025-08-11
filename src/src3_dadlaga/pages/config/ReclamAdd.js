import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { message } from 'antd';
import moment from 'moment';
import mime from 'mime';

import '../../../css/invt.css';
import '../../../css/config.css';
import { getList, sendRequest } from '../../../services';
import { ButtonRowConfirm, Error1, Prompt } from '../../../components/all';
import { Main } from '../../components/config/reclam/add';
import { CardSite } from '../../components/config/reclam/add';
import { urlToFile } from '../../../helpers';
import { withSize } from 'react-sizeme';

function Screen() {
  const [name, setName] = useState({ value: '' });
  const [link, setLink] = useState({ value: '' });
  const [image, setImage] = useState(null);
  const [image64, setImage64] = useState('');
  const [imageType, setImageType] = useState('');
  const [beginDate, setBeginDate] = useState({ value: moment() });
  const [endDate, setEndDate] = useState({ value: moment() });
  const [status, setStatus] = useState({ value: 1 });
  const [type, setType] = useState({ value: null });
  const [sites, setSites] = useState([]);
  const [error, setError] = useState(null);
  const [saved, setSaved] = useState(false);
  const [edited, setEdited] = useState(false);
  const [checked, setChecked] = useState(null);
  const [selected, setSelected] = useState(null);
  const { user, token } = useSelector(state => state.login);
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    if (saved) onClickCancel();
    getData();
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getData = async () => {
    let adsId = searchParams.get('adsId');
    let response = await getSites();
    if (response && (adsId || adsId === 0)) await GetAdv(adsId, response);
  };

  const GetAdv = async (adsId, site) => {
    setError(null);
    let api = '?AdsId=' + adsId;
    let response = await dispatch(getList(user, token, 'Site/GetAdvertisement' + api));
    if (response?.error) setError(response?.error);
    else {
      let ads = response?.data?.ads;
      setSelected(ads);
      setName({ value: ads?.adsName ?? '' });
      setBeginDate({ value: moment(ads?.beginDate, 'yyyy.MM.DD') });
      setEndDate({ value: moment(ads?.endDate, 'yyyy.MM.DD') });
      setLink({ value: ads?.imageLink ?? '' });
      setStatus({ value: ads?.status ?? 0 });
      setType({ value: ads?.adsType });
      getImage(ads);
      site?.forEach(item => {
        let exists = response?.data?.adssite?.filter(si => si.siteId === item.siteId)[0];
        item.checked = exists;
      });
      setSites(site);
    }
  };

  const getImage = async image => {
    if (image?.file?.fileData) {
      let type = image?.file?.fileType?.replace('');
      setImageType(type ?? '');
      let mimeType = mime.getType(type);
      let dataPrefix = `data:` + mimeType + `;base64,`;
      let attach64 = `${dataPrefix}${image?.file?.fileData}`;
      let attachFile = await urlToFile(attach64, mimeType);
      setImage64(attach64);
      setImage(attachFile);
    }
  };

  const getSites = async () => {
    setError(null);
    const response = await dispatch(getList(user, token, 'Site/GetSite'));
    if (response?.error) {
      setError(response?.error);
      return false;
    } else {
      response?.data?.forEach(item => {
        item.checked = true;
        item.rowStatus = 'I';
      });
      setSites(response?.data);
      return response?.data;
    }
  };

  const onLoad = () => {
    setError(null);
    setEdited(false);
  };

  const onError = err => {
    setError('Зураг оруулна уу!');
  };

  const onSuccess = msg => {
    message.success(msg);
    setSaved(true);
  };

  const onClickCancel = () => navigate('/config/reclam');

  const checkValid = () => {
    let nameLength = 2;
    let isNameValid = !name?.value?.trim() || name?.value?.length >= nameLength;
    if (isNameValid) {
      return true;
    } else {
      if (!name?.value?.trim()) setName({ value: '', error: t('error.not_empty') });
      if (!isNameValid) setName({ value: name?.value, error: ' ' + nameLength + t('error.longer_than') });
    }
  };

  const onClickSave = async e => {
    e?.preventDefault();
    if (checkValid()) {
      onLoad();

      let siteIDs = [];
      sites?.forEach(item => {
        if (item?.checked) {
          siteIDs.push(item?.siteId);
        }
      });

      let data = [{
        adsID: selected ? selected?.adsId : -1,
        adsName: name?.value,
        siteIDs,
        merchantType: 1,
        merchantID: user?.msMerchant?.merchantId,
        beginDate: beginDate?.value?.format('yyyy.MM.DD'),
        endDate: endDate?.value?.format('yyyy.MM.DD'),
        image: { FileData: image64 ?? '', FileType: imageType ?? '' },
        imageLink: link?.value,
        adsType: type?.value,
        status: status?.value,
        rowStatus: selected ? 'U' : 'I'
      }];
      const response = await dispatch(sendRequest(user, token, 'Site/ModAdvertisement', data));
      if (response?.error) {
        onError(response?.error);
      } else {
        onSuccess(t('reclam.add_success'));
        navigate('/config/reclam');
      }
    }
  };

  const onClickDelete = async () => {
    onLoad();
    let data = [{ ...selected, rowStatus: 'D', image: {} }];
    const response = await dispatch(sendRequest(user, token, 'Site/ModAdvertisement', data));
    if (response?.error) onError(response?.error, true);
    else onSuccess(t('reclam.delete_success'), true);
  };

  const mainProps = {
    setError, name, setName, setLink, link, beginDate, setBeginDate, endDate, setEndDate,
    image, setImage, setImage64, image64, setImageType, status, setStatus, type, setType
  };
  const siteProps = { data: sites, setData: setSites, setEdited, checked, setChecked, id: 'ma_back' };
  const btnProps = { onClickCancel, onClickSave, onClickDelete, type: 'submit', show: true, id: 'btn_supp' };

  return (
    <div className='add_tab' style={{ flex: 1 }}>
      <Prompt edited={edited} />
      {error && <Error1 error={error} />}
      <div className='i_scroll'>
        <Main {...mainProps} />
        <form>
          <div className='gap' />
          {sites?.length > 0 && <CardSite {...siteProps} />}
        </form>
      </div>
      <ButtonRowConfirm {...btnProps} />
    </div>
  );
}

const withSizeHOC = withSize();
export const ReclamAdd = withSizeHOC(Screen);
