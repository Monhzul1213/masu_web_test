import React, { useState, useEffect } from 'react';
import { message } from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { withSize } from 'react-sizeme';
import mime from 'mime';

import { getList, sendRequest } from '../../services';
import { urlToFile } from '../../helpers';
import { ButtonRow, CheckBox, Confirm, DescrInput, Empty, Error1, Input, Overlay, PlainSelect, Prompt, UploadImage
  } from '../../components/all';
import { Help } from '../../components/invt/inventory/list';

function Card(props){
  const { size } = props;
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [sites, setSites] = useState([]);
  const [site, setSite] = useState(null);
  const [bill, setBill] = useState(null);
  const [image, setImage] = useState(null);
  const [image64, setImage64] = useState('');
  const [imageType, setImageType] = useState('');
  const [header, setHeader] = useState({ value: '' });
  const [footer, setFooter] = useState({ value: '' });
  const [edited, setEdited] = useState(false);
  const [open, setOpen] = useState(false);
  const [isPrint, setIsPrint] = useState(false);
  const [isDescr, setIsDescr] = useState(false);
  const { user, token }  = useSelector(state => state.login);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    getData();
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getData = async () => {
    setError(null);
    setLoading(true);
    const res1 = await getSites();
    if(res1 || res1 === 0) await getBill(res1);
    setLoading(false);
  }

  const getSites = async () => {
    const response = await dispatch(getList(user, token, 'Site/GetSite'));
    if(response?.error) {
      setError(response?.error);
      return false;
    } else {
      setSites(response?.data);
      let first = response?.data && response?.data[0];
      let siteID = first ? first?.siteId : false;
      return siteID;
    }
  }

  const onClickShop = () => navigate('/config/store');

  const changeSite = siteID => {
    if(edited) setOpen(siteID);
    else getBill(siteID);
  }

  const confirm = sure => {
    if(sure){
      setEdited(false);
      getBill(open);
    }
    setOpen(false);
  }

  const getBill = async siteID => {
    setSite(siteID);
    const response = await dispatch(getList(user, token, 'Site/GetBill?SiteID=' + siteID));
    if(response?.error){
      setError(response?.error);
      setBill(null);
      setData(null);
    } else {
      setData(response?.data && response?.data[0]);
    }
  }

  const setData = data => {
    setBill(data);
    getImage(data);
    setHeader({ value: data?.header ?? '' });
    setFooter({ value: data?.footer ?? '' });
    setIsPrint(data?.isPrintBarCode === 'Y');
    setIsDescr(data?.isAddDescr === 'Y');
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
    } else {
      setImage(null);
      setImage64(null);
      setImageType(null);
    }
  }

  const onClickSave = async () => {
    setError(null);
    setLoading(true);
    let data = {
      siteId: site,
      image: '',
      header: header?.value,
      footer: footer?.value,
      fileRaw: { FileData: image64 ?? '', FileType: imageType ?? '' },
      rowStatus: bill ? 'U' : 'I',
      isPrintBarCode: isPrint ? 'Y' : 'N',
      isAddDescr: isDescr ? 'Y' : 'N'
    }
    const response = await dispatch(sendRequest(user, token, 'Site/AddBill', data));
    setLoading(false);
    if(response?.error) setError(response?.error);
    else {
      setEdited(false);
      message.success(t('document.success_msg'));
      getBill(site);
    }
  }

  const onClickCancel = () => setData(bill);

  const width = size?.width >= 720 ? 720 : size?.width;
  const id = size?.width > 480 ? 'mo_large' : 'mo_small';
  const scroll = size?.width > 480 ? 'do_large' : 'do_small';
  const emptyProps = { icon: 'MdOutlineReceiptLong', type: 'document', onClickAdd: onClickShop };
  const siteProps = { value: site, setValue: changeSite, data: sites, s_value: 'siteId', s_descr: 'name',
    className: 'do_select' };
  const logoProps = { image, setImage, setImage64, setImageType, setEdited, setError };
  const headerProps = { value: header, setValue: setHeader, label: t('document.header'),
    placeholder: t('document.header'), setEdited, setError, length: 100 };
  const footerProps = { value: footer, setValue: setFooter, label: t('document.footer'),
    placeholder: t('document.footer'), setEdited, setError, length: 100, id: 'doc_input'};
  const btnProps = { onClickCancel, onClickSave };
  const confirmProps = { open: open ? true : false, text: 'page.back_confirm', confirm };
  const printProps = { label: t('document.isPrint'), checked: isPrint, setChecked: setIsPrint };
  const descrProps = { label: t('document.isDescr'), checked: isDescr, setChecked: setIsDescr };
  const videoData = [{id: "EosOGez0VVE"}]

  return (
    <div className='store_tab' style={{flex: 1}}>
      <Confirm {...confirmProps} />
      <Prompt edited={edited} />
      <Overlay loading={loading}>
        {error && <Error1 error={error} />}
        {!sites?.length ? <Empty {...emptyProps} /> :
          <div className='mo_container' style={{ width, paddingBottom: 0 }}>
            <div className='ih_header' id={id}>
              <p className='do_title'>{t('document.title')}</p>
              <PlainSelect {...siteProps} />
            </div>
            <div className='gap' />
            <div id={scroll}>
              <p className='select_lbl'>{t('document.logo')}</p>
              <UploadImage {...logoProps} />
              <Input {...headerProps} />
              <DescrInput {...footerProps} />
              <div className='row'>
                <CheckBox {...printProps}/>
                <CheckBox {...descrProps} style={{marginLeft: 50}}/>
              </div>
            </div>
            <ButtonRow {...btnProps} />
          </div>
      }
      </Overlay>
      <Help videoData={videoData}/>
    </div>
  );
}

const withSizeHOC = withSize();
export const Document = withSizeHOC(Card);