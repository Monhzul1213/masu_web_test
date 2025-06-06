import React, { useState, useEffect } from 'react';
import { Modal, message } from 'antd';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';

import { deleteRequest, getList, sendRequest } from '../../../services'
import { ButtonRow, ModalTitle, Overlay, Input, Error, Confirm, Select, IconInput, UploadImage, CheckBox } from '../../all';
import { cityList, districtList, urlToFile } from '../../../helpers';
import { Location } from './Location';
import mime from 'mime';

export function Add(props){
  const { visible, selected, closeModal } = props;
  const { t } = useTranslation();
  const [name, setName] = useState({ value: '' });
  const [address, setAddress] = useState({ value: '' });
  const [location, setLocation] = useState(null);
  const [phone, setPhone] = useState({ value: '' });
  const [descr, setDescr] = useState({ value: null });
  const [descr1, setDescr1] = useState({ value: null });
  const [descr2, setDescr2] = useState({ value: null });
  const [subDescr, setSubDescr] = useState({ value: null });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [city, setCity] = useState(null);
  const [open, setOpen] = useState(false);
  const [list, setList] = useState([]);
  const [select, setSelect] = useState(false);
  const [lat, setLat] = useState(null);
  const [lng, setLng] = useState(null);
  const [checked, setChecked] = useState(false);
  const [useDiningOption, setUseDiningOption] = useState(false);
  const [image, setImage] = useState(null);
  const [image64, setImage64] = useState('');
  const [imageType, setImageType] = useState('');
  const [image1, setImage1] = useState(null);
  const [image164, setImage164] = useState('');
  const [imageType1, setImageType1] = useState('');
  const [image2, setImage2] = useState(null);
  const [image264, setImage264] = useState('');
  const [imageType2, setImageType2] = useState('');
  const { user, token }  = useSelector(state => state.login);
  const dispatch = useDispatch();

  useEffect(() => {
    getConfig();
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if(selected){
      setName({ value: selected?.name ?? '' });
      setAddress({ value: selected?.address ?? '' });
      setPhone({ value: selected?.phone ?? '' });
      setDescr({ value: selected?.descr ? selected?.descr : null });
      setLat( selected?.latitudes ? selected?.latitudes : 47.91452468522501 );
      setLng(selected?.longitudes ? selected?.longitudes : 106.91007001230763 );
      setLocation({ value : selected?.latitudes ? selected?.latitudes + '\n' + selected?.longitudes : ''})
      setSubDescr({ value: selected?.subDescr ? selected?.subDescr : null });
      setChecked(selected?.useKds === 'Y')
      setList(districtList?.filter(item => item?.parent?.includes(selected?.descr)));
      getImages(selected?.siteId)
    }
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getConfig = async () => {
    const response = await dispatch(getList(user, token, 'Merchant/GetConfig'));
    setUseDiningOption(response?.data?.useDiningOption === 'Y')
  }

  const getImages = async SiteID => {
    const response = await dispatch(getList(user, token, 'Site/GetSitePics?SiteID=' + SiteID));
    response?.data?.forEach(item => {
      if(item?.viewPriority === 1) getImage(item)
      else if(item?.viewPriority === 2) getImage1(item)
      else if(item?.viewPriority === 3) getImage2(item)
    })
  }

  const getImage = async data => {
    if(data?.fileRaw?.fileData){
      let type = data?.fileRaw?.fileType?.replace('.', '');
      setImageType(type ?? '');
      let mimeType = mime.getType(type);
      let dataPrefix = `data:` + mimeType + `;base64,`;
      let attach64 = `${dataPrefix}${data?.fileRaw?.fileData}`;
      let attachFile = await urlToFile(attach64, mimeType);
      setImage64(attach64);
      setImage(attachFile);
    }
  }

  const getImage1 = async data => {
    if(data?.fileRaw?.fileData){
      let type = data?.fileRaw?.fileType?.replace('.', '');
      setImageType1(type ?? '');
      let mimeType = mime.getType(type);
      let dataPrefix = `data:` + mimeType + `;base64,`;
      let attach64 = `${dataPrefix}${data?.fileRaw?.fileData}`;
      let attachFile = await urlToFile(attach64, mimeType);
      setImage164(attach64);
      setImage1(attachFile);
    }
  }
  const getImage2 = async data => {
    if(data?.fileRaw?.fileData){
      let type = data?.fileRaw?.fileType?.replace('.', '');
      setImageType2(type ?? '');
      let mimeType = mime.getType(type);
      let dataPrefix = `data:` + mimeType + `;base64,`;
      let attach64 = `${dataPrefix}${data?.fileRaw?.fileData}`;
      let attachFile = await urlToFile(attach64, mimeType);
      setImage264(attach64);
      setImage2(attachFile);
    }
  }

  const checkValid = () => {
    let nameLength = 2, addressLength = 8, phoneLength = 8;
    let isNameValid = name?.value && name?.value?.length >= nameLength;
    let isAddressValid = !address?.value || address?.value?.length >= addressLength;
    let isPhoneValid = !phone?.value || phone?.value?.length >= phoneLength;
    if(isNameValid && isAddressValid && isPhoneValid && descr?.value && subDescr?.value){
      return true;
    } else {
      if(!name?.value) setName({ value: '', error: t('error.not_empty') });
      else if(!isNameValid) setName({ value: name?.value, error: ' ' + nameLength + t('error.longer_than') });
      if(!isAddressValid) setAddress({ value: address?.value, error: ' ' + addressLength + t('error.longer_than') });
      if(!isPhoneValid) setPhone({ value: phone?.value, error: ' ' + phoneLength + t('error.longer_than') });
      if(!descr?.value) setDescr({ value: null, error: t('error.not_empty') });
      if(!subDescr?.value) setSubDescr({ value: null, error: t('error.not_empty') });
      return false;
    }
  }

  const saveRequest = async sitePictures => {
    // e?.preventDefault();
    setError(null);
    if(checkValid()){
      let districtCode = cityList?.filter(ct => ct.value === descr?.value)[0]?.districtCode;
      setLoading(true);
      let data = { name: name?.value, address: address?.value, phone: phone?.value?.trim(), descr: descr?.value,
        subDescr: subDescr?.value, districtCode, latitudes: lat, longtitudes: lng, sitePictures, useKds: checked ? 'Y' : 'N' };
      if(selected) data.siteID = selected.siteId;
      else data.merchantID = user?.merchantId;
      let api = selected ? 'Site/UpdateSite' : 'Site/AddSite';
      const response = await dispatch(sendRequest(user, token, api, data));
      if(response?.error) setError(response?.error);
      else {
        closeModal(true);
        message.success(t('shop.add_success'));
      }
      setLoading(false);
    }
  }

  const onClickSave = async e => {
    e.preventDefault();
    // checkValid().then(res => {
    //   if(res){
        // setLoading('saving');
        setError(null);
        let sitePictures = [];
        if(image64){
          sitePictures.push({ viewPriority: 1, isVideo: "", videoURL: "", rowStatus: selected ? 'U' : 'I', files: { FileData: image64 ?? '', FileType: imageType ?? ''} });
        }
        if(image164){
          sitePictures.push({ viewPriority: 2, isVideo: "", videoURL: "", rowStatus: selected ? 'U' : 'I', files: { FileData: image164 ?? '', FileType: imageType1 ?? ''} });
        }
        if(image264){
          sitePictures.push({ viewPriority: 3, isVideo: "", videoURL: "", rowStatus: selected ? 'U' : 'I', files: { FileData: image264 ?? '', FileType: imageType2 ?? ''} });
        }
        saveRequest(sitePictures);
    //   }
    // });
  }

  const onClickDelete = () => setOpen(true);

  const onDelete = async sure => {
    setError(null);
    setOpen(false);
    if(sure){
      setLoading(true);
      const response = await dispatch(deleteRequest(user, token, 'Site/DeleteSite/' + selected?.siteId));
      if(response?.error) setError(response?.error);
      else {
        closeModal(true);
        message.success(t('shop.delete_success'));
      }
      setLoading(false);
    }
  }

  const onChangeDescr = value => {
    setDescr(value);
    setSubDescr({ value: null });
    setList(districtList?.filter(item => item?.parent?.includes(value?.value)));
    cityList?.forEach(item => {
      if(item?.label?.includes(value?.value)){
        setDescr1({value: item?.lan})
        setDescr2({value: item?.lng})
        setCity(item?.city)
    }});
  }

  const changePhone = value => {
    let text = value?.value?.replace(/[^0-9]/g, '');
    setPhone({ value: text });
  }

  const onClickLocation = row => {
    if(!descr?.value) {
      setDescr({ value: null, error: t('profile.select') });
      setSelect(false);
    } else setSelect(true);
  }


  const closeLocation = (hasLocation, y, x) => {
    setSelect(false);
    if(hasLocation){
      let coordinate = y + '\n' + x;
      setLocation({value: coordinate})
      setLat(y)
      setLng(x)
      setError && setError(null);
    }
  }

  const nameProps = { value: name, setValue: setName, label: t('shop.name'), placeholder: t('shop.name1'), setError, length: 40 };
  const cityProps = { value: descr, setValue: onChangeDescr, label: t('shop.city'), placeholder: t('shop.location1'), setError,
    data: cityList};
  const districtProps = { value: subDescr, setValue: setSubDescr, label: t('shop.district'), placeholder: t('shop.location1'), setError,
    data: list };
  const addrProps = { value: address, setValue: setAddress, label: t('shop.addr'), placeholder: t('shop.addr1'), setError, length: 250 };
  const locProps = { value: location, setValue: setLocation, label: t('tax.location'), placeholder: t('tax.location'), setError, length: 250, 
                    onClick: onClickLocation, disabled: true, className: 'store_descr' };
  const phoneProps = { value: phone, setValue: changePhone, label: t('shop.phone'), placeholder: t('shop.phone1'), setError, length: 20,
    handleEnter: onClickSave };
  const btnProps = { onClickCancel: () => closeModal(), onClickSave, type: 'submit', show: selected ? true : false, onClickDelete };
  const confirmProps = { open, text: t('page.delete_confirm'), confirm: onDelete };
  const mapProps = { visible: select, closeModal: closeLocation, setLat, lat, lng, setLng, descr1, descr2, city };
  const imageProps = { image, setImage, setImage64, setImageType, setError, className: 'im_image' };
  const image1Props = { image: image1, setImage: setImage1, setImage64: setImage164, setImageType: setImageType1, setError, className: 'im_image' };
  const image2Props = { image: image2, setImage: setImage2, setImage64: setImage264, setImageType: setImageType2, setError, className: 'im_image' };
  const checkProps = { checked, setChecked, label: 'shop.checked'};

  return (
    <Modal title={null} footer={null} closable={false} open={visible} centered={true} width={400}>
      {open && <Confirm {...confirmProps} />}
      <Location {...mapProps} />
      <Overlay loading={loading}>
        <div className='m_back'>
          <ModalTitle icon='MdStorefront' title={t(selected ? 'shop.edit' : 'shop.new')} isMD={true} />
          <div className='m_scroll'>
            <form onSubmit={onClickSave}>
              <Input {...nameProps} />
              <Select {...cityProps} />
              <Select {...districtProps} />
              <Input {...addrProps} />
              <IconInput {...locProps} />
              <Input {...phoneProps} />
              {useDiningOption && <CheckBox {...checkProps} />}
              {user?.useAppointment && <div>
                <p className='image_lbl'>{t('shop.image')}</p>
                <div className='store_image_back'>
                  <UploadImage {...imageProps}/>
                  <UploadImage {...image1Props}/>
                  <UploadImage {...image2Props}/>
                </div>
              </div>}
            </form>
            {error && <Error error={error} id='m_error' />}
          </div>
        </div>
        <ButtonRow {...btnProps} />
      </Overlay>
    </Modal>
  )
}