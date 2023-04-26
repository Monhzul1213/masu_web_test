import React, { useState, useEffect } from 'react';
import { message } from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { withSize } from 'react-sizeme';
import { getList, sendRequest } from '../../../services';
import { Confirm, Empty, Overlay, Prompt } from '../../../components/all';
import { CardVariant , Message } from '../../components/config';
import { Error1 } from '../../components/all/all_m';

function Card(props){
  const { size } = props;
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [sites, setSites] = useState([]);
  const [site, setSite] = useState(null);
  const [edited, setEdited] = useState(false);
  const [open, setOpen] = useState(false)
  const { user, token }  = useSelector(state => state.login);
  const [variants, setVariants] = useState([]);
  const [dvariants, setDVariants] = useState([]);
  const [checked, setChecked] = useState([]);
  const [searchV, setSearchV] = useState({ value: '' });
  const [disabledV, setDisabledV] = useState(false);
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

  const getConfig = async () => {
    const response = await dispatch(getList(user, token, 'Merchant/GetConfig'));
    if(response?.error) setError(response?.error);
    else setChecked(response?.data?.useOpenTicket === 'Y')
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
    const response = await dispatch(getList(user, token, 'Site/GetTicketBin?SiteID=' + siteID));
    if(response?.error){
      setError(response?.error);
      setVariants(null);
    } else {
      // response?.data?.forEach(item => item.rowStatus = 'U');
      setVariants(response?.data);
      getConfig();
    }
  }

  const onClickSave = async () => {
    let data = []
    if(variants?.length ){
      variants.forEach(item => {
        data.push({...item, siteID : item?.siteId ? item?.siteId : site, 
          ticketBinID: item?.ticketBinId ? item?.ticketBinId: -1, rowStatus : item?.ticketBinId ? 'U': 'I'} ) 
      })
      dvariants?.forEach(it => data?.push({...it, rowStatus: 'D'}));
    } 
    // if(searchV?.value !== ''){
    //     setError(t('orders.error'))
    // } else 
    if (data){   
    setError(null);
    setLoading(true);
    const response = await dispatch(sendRequest(user, token, 'Site/ModTicketBin', data));
    setLoading(false);
    if(response?.error) setError(response?.error);
    else {
      setEdited(false);
      message.success(t('orders.success_msg'));
      getBill(site);
    }
  }
  }
 

  const onClickCancel = () => getData()

  const emptyProps = { icon: 'MdOutlineReceiptLong', type: 'orders', onClickAdd: onClickShop };
  const msgProps = { icon: 'BsGear', type: 'orders' };
  const confirmProps = { open: open ? true : false, text: 'page.back_confirm', confirm };
  const variantProps = { data: variants, setData: setVariants, setEdited, setDVariants,
    search: searchV, setSearch: setSearchV, disabled: disabledV, setDisabled: setDisabledV, 
    size , site , changeSite , sites , onClickCancel, onClickSave };

  return (
      <div className='store_tab' style={{flex: 1}}>
        <Confirm {...confirmProps} />
        <Prompt edited={edited} />
        {checked ?
        <Overlay loading={loading}>
          {error && <Error1 error={error} />}
            {!sites?.length ? <Empty {...emptyProps} /> : <CardVariant {...variantProps} /> }
        </Overlay>
        : <Message {...msgProps} />}
      </div> 
  );
}

const withSizeHOC = withSize();
export const Order = withSizeHOC(Card);