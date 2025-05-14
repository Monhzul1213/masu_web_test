import React, { useState, useEffect } from 'react';
import { message } from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { withSize } from 'react-sizeme';
import mime from 'mime';

import { getList, sendRequest } from '../../../services';
import { urlToFile } from '../../../helpers';
import { ButtonRowAdd, Check, CheckBox, Confirm, DescrInput, Error1, Input, Overlay, PlainSelect, Prompt, UploadImage} from '../../../components/all';
import { Account, Bill, InvoicePrint } from '../../components/control';
import { ButtonRow } from '../../components/control/billComp';

function Card(){
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [sites, setSites] = useState([]);
  const [site, setSite] = useState(null);
  const [site1, setSite1] = useState(null);
  const [bill, setBill] = useState(null);
  const [invoice, setInvoice] = useState(null);
  const [image, setImage] = useState(null);
  const [image64, setImage64] = useState('');
  const [imageType, setImageType] = useState('');
  const [image1, setImage1] = useState(null);
  const [image164, setImage164] = useState('');
  const [imageType1, setImageType1] = useState('');
  const [header, setHeader] = useState({ value: '' });
  const [footer, setFooter] = useState({ value: '' });
  const [edited, setEdited] = useState(false);
  const [open, setOpen] = useState(false);
  const [isPrint, setIsPrint] = useState(false);
  const [isDescr, setIsDescr] = useState(false);
  const [date, setDate] = useState({ value: 0 });
  const [visible, setVisible] = useState(false);
  const [accounts, setAccounts] = useState([]);

  const { user, token }  = useSelector(state => state.login);
  const dispatch = useDispatch();

  useEffect(() => {
    getData();
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getData = async () => {
    setError(null);
    setLoading(true);
    const res1 = await getSites();
    if(res1 || res1 === 0) {
      await getBill(res1) 
      await getInvoice(res1)
    };
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

  const changeSite = siteID => {
    if(edited) setOpen(siteID);
    else getBill(siteID);
  }

  const changeSite1 = siteID => {
    if(edited) setOpen(siteID);
    else getInvoice(siteID);
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

  const getInvoice = async siteID => {
    setSite1(siteID);
    const response = await dispatch(getList(user, token, 'Site/GeInvoiceDesign?SiteID=' + siteID));
    if(response?.error){
      setError(response?.error);
      setInvoice(null);
      setData1(null);
    } else {
      setData1(response?.data && response?.data?.invoicedesign[0]);
      response?.data?.invoicedesigndtl?.forEach(item=> {
        item.checked = true
      })
      setAccounts(response?.data && response?.data?.invoicedesigndtl)
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

  const setData1 = data => {
    setInvoice(data);
    getImage1(data);
    setDate({ value: data?.invoiceDays ?? '' });
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
    } else {
      setImage1(null);
      setImage164(null);
      setImageType1(null);
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

  const onClickInvoiceSave = async () => {
    setError(null);
    setLoading(true);
    let invoiceDtls = [];
    accounts?.forEach(item => {
      if(item?.checked ){
        item.rowStatus = item?.merchantId ? 'U': 'I';
        invoiceDtls.push(item);
      } 
      else {
        item.rowStatus = 'D';
        invoiceDtls.push(item);
      }
    })
    let data = {
      siteId: site1,
      image: '',
      invoiceDays: date?.value,
      fileRaw: { FileData: image164 ?? '', FileType: imageType1 ?? '' },
      rowStatus: invoice ? 'U' : 'I',
      isPrintBarCode: isPrint ? 'Y' : 'N', invoiceDtls
    }
    const response = await dispatch(sendRequest(user, token, 'Site/ModInvoice', data));
    setLoading(false);
    if(response?.error) setError(response?.error);
    else {
      setEdited(false);
      message.success(t('document.success_msg'));
      getInvoice(site1);
    }
  }

  const onClickAdd = () => {
    setVisible(true)
  };

  const closeModal = () => setVisible(false);

  const onClickCancel = () => setData(bill);

  const onClickInvoiceCancel = () => setData1(invoice);

  const toggleAccount = index => {
    const updated = [...accounts];
    updated[index].checked = !updated[index].checked;
    setAccounts(updated);
  };

  const selectedAccounts = accounts.filter(acc => acc.checked);

  const siteProps = { value: site, setValue: changeSite, data: sites, s_value: 'siteId', s_descr: 'name',
    className: 'co_select' };
  const site1Props = { value: site1, setValue: changeSite1, data: sites, s_value: 'siteId', s_descr: 'name',
  className: 'co_select' };
  const logoProps = { image, setImage, setImage64, setImageType, setEdited, setError, className: 'co_image' };
  const logo1Props = { image: image1, setImage: setImage1, setImage64: setImage164, setImageType: setImageType1, setEdited, setError, className: 'co_image' };
  const headerProps = { value: header, setValue: setHeader, label: t('document.header'),
    placeholder: t('document.header'), setEdited, setError, length: 100, classBack: 'co_select_back', className: 'co_input' };
  const footerProps = { value: footer, setValue: setFooter, label: t('document.footer'),
    placeholder: t('document.footer'), setEdited, setError, length: 100, id: 'doc_input', classBack: 'co_select_back', className: 'co_input'};
  const btnProps = { onClickCancel, onClickSave };
  const confirmProps = { open: open ? true : false, text: 'page.back_confirm', confirm };
  const printProps = { label: t('document.isPrint'), checked: isPrint, setChecked: setIsPrint, id: 'co_check1' };
  const descrProps = { label: t('document.isDescr'), checked: isDescr, setChecked: setIsDescr };
  const dateProps = { value: date, setValue: setDate, label: t('bill.invoice_enddate'), placeholder: t('bill.invoice_enddate'), classBack: 'co_select_back', className: 'co_input'};
  const billProps = { header, footer, site, isPrint, image64, image164, date, accounts: selectedAccounts};
  const addProps = { type: 'account', onClickAdd };
  const modalProps = { visible, closeModal, setData: setAccounts };
  const invoicebtnProps = { onClickCancel: onClickInvoiceCancel, onClickSave: onClickInvoiceSave };

  return (
    <div className='store_tab' style={{flex: 1}}>
      <Account {...modalProps}/>
      <Confirm {...confirmProps} />
      <Prompt edited={edited} />
      <Overlay loading={loading}>
        {error && <Error1 error={error} />}
        <div className='row'>
          <div style={{ width: 600, paddingBottom: 0 }}>
            <div className='co_s_container' >
              <div>
                <p className='co_title'>{t('document.title')}</p>
                <PlainSelect {...siteProps} />
                <div className='gap' />
                <p className='select_lbl'>{t('document.logo')}</p>
                <UploadImage {...logoProps} />
                <Input {...headerProps} />
                <DescrInput {...footerProps} />
                <div className='col'>
                  <CheckBox {...printProps} />
                  <CheckBox {...descrProps}/>
                </div>
              </div>
              <Bill {...billProps}/>
            </div>
            <ButtonRow {...btnProps} />
          </div>
          <div
            style={{
              width: "1px",
              background: "#d4d3d3",
              margin: "1% 2px",
            }}
          />
          <div style={{ width: 850, paddingBottom: 0 }}>
            <div className='co_s_container' >
              <div>
                <p className='co_title'>{t('document.invoice_design')}</p>
                <PlainSelect {...site1Props} />
                <div className='gap' />
                <p className='select_lbl'>{t('document.logo')}</p>
                <UploadImage {...logo1Props} />
                <Input {...dateProps}/>
                {/* <Date {...dateProps}/> */}
                {/* <p>{t('account.title')}</p> */}
                {accounts?.length > 0 && (
                  <div style={{ marginTop: 10 }}>
                    <p className='select_lbl'>{t('account.title')}</p>
                      {accounts.map((acc, index) => (
                        <div style={{display: 'flex', flexFlow: 'row', alignItems: 'center'}}>
                          <Check checked={acc.checked} onClick={() => toggleAccount(index)}/>
                          <div className='gap' />
                          <p key={index} style={{margin: 0}}>{acc.account}</p>
                        </div>
                      ))}
                  </div>
                )}
                <div className='gap' />
                <ButtonRowAdd {...addProps}/>
              </div>
              <InvoicePrint {...billProps}/>
            </div>
            <ButtonRow {...invoicebtnProps} />
          </div>
        </div>
      </Overlay>
    </div>
  );
}

const withSizeHOC = withSize();
export const Document = withSizeHOC(Card);