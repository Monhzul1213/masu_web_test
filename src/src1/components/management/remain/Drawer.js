import React, { useEffect, useState } from 'react';
import { Drawer as AntDrawer } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import mime from 'mime';

import '../../../css/report.css';
import { sendRequest } from '../../../../services';
import { urlToFile } from '../../../../helpers';
import { DynamicAIIcon, Error1, Overlay } from '../../../../components/all';

export function Drawer(props){
  const { selected, open, setOpen } = props;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [image, setImage] = useState(null);
  const { user, token }  = useSelector(state => state.login);
  const dispatch = useDispatch();

  useEffect(() => {
    if(selected) getData(selected);
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selected]);

  const getData = async data => {
    setLoading(true);
    setError(null);
    let response = await dispatch(sendRequest(user, token, 'Inventory/GetInventory/Custom', [{ fieldName: 'InvtID', value: selected?.invtID }]));
    if(response?.error){
      setError(response?.error);
      setImage(null);
    } else {
      let invt = response && response?.data && response?.data[0];
      if(invt?.msInventory?.fileRaw?.fileData){
        let type = invt?.msInventory?.fileRaw?.fileType?.replace('.', '');
        let mimeType = mime.getType(type);
        let dataPrefix = `data:` + mimeType + `;base64,`;
        let attach64 = `${dataPrefix}${invt?.msInventory?.fileRaw?.fileData}`;
        let attachFile = await urlToFile(attach64, mimeType);
        // setImage(attachFile);
      } else
        setImage(null);
    }
    setLoading(false);
    
    // console.log(invt);
  }
  
  const onClose = () => setOpen(null);
  const drawerProps = { className: 'rp_drawer', placement: 'right', onClose, closable: false, open, mask: false };
  
  return (
    <AntDrawer {...drawerProps}>
      <Overlay loading={loading}>
        <div className='dr_back'>
          <DynamicAIIcon className='dr_close' name='AiFillCloseCircle' onClick={onClose} />
          <p className='dr_title'>{selected?.invtName}</p>
          {image
            ? <img src={URL.createObjectURL(image)} alt="avatar" className='upload_image' />
            : <div className='dr_image_holder' />}
          {error && <Error1 error={error} />}
        </div>
      </Overlay>
    </AntDrawer>
  );
}

/**
comment
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import moment from 'moment';

import { DynamicAIIcon, DynamicRIIcon, Money } from '../../all';
import { config, encrypt } from '../../../helpers';
import { bonus, coupon } from '../../../src1/assets'

export function Drawer(props){
  const { t } = useTranslation();
  const [pureAmount, setPureAmount] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);

  


  const renderItem = (item, index) => {
    let variant = item?.variantName ? (' (' + item?.variantName  + ')') : ''
    return (
      <div key={index} className='dr_item1'>
        <div key={index} className='dr_item_row'>
          <p className='dr_item_text1'>{item?.invtName ?? item?.invtId}{variant}</p>
          <p className='dr_item_text2'>{item?.qty}</p>
          <p className='dr_item_text3'><Money value={item?.price} fontSize={13} /></p>
          <p className='dr_item_text4'><Money value={item?.amount} fontSize={13} /></p>
        </div>
        <div className='dr_item_text_back'>
          <div className='dr_img_back'>
            {item?.couponAmount ? <img src={coupon} className='dr_img' alt='coupon'/> : ''}
            <p className='dr_item_text_z2'>{item?.couponName ? (item?.couponName) : ''}</p>
          </div>
          <p className='dr_item_text_z2'>{item?.couponAmount ? <Money value={item?.couponAmount}/> : ''}</p>
        </div>
        {item?.bonusID !== 0 ? 
          <div className='dr_item_text_back'>
            <div className='dr_img_back'>
              {<img src={bonus} className='dr_bonus_img' alt='coupon'/>}
              <p className='dr_item_text_z2'>{item?.bonusName}</p>
            </div>
            <p className='dr_item_text_z2'>{<Money value={item?.rewardAmount}/>}</p>
          </div> 
        : ''}
        <p className='dr_item_text'>{(item?.serviceCode !== 0 && item?.serviceCode !==null) ? ( t('report_receipt.t_emp')+ ': ' + item?.empName ) : ''}</p>
      </div>
    )
  }

  const renderItem1 = (item) => {
    return (
      <div className='dr_row_m'>
          <p className='dr_row_label_m'>{item?.paymentTypeName}</p>
          <p className='dr_row_value_m'><Money value={item?.paymentAmount} fontSize={13} /></p>
      </div> 
    )
  }

  const Field = props => {
    const { icon, label, value } = props;
    
    return (
      <div className='dr_field'>
        <DynamicRIIcon className='dr_field_icon' name={icon} />
        <p className='dr_field_label'>{t(label)}</p>
        <p className='dr_field_label1'>:</p>
        <p className='dr_field_value'>{value}</p>
      </div>
    )
  }

  const onClickLink = () => {
    let msg = selected?.sale?.merchantId + '-' + selected?.sale?.siteId + '-' + selected?.sale?.salesNo
    let code = encrypt(msg);
    let url = config?.domain + '/Bill?billno=' + encodeURIComponent(code);
    window.open(url);
  }


  return (
    
  );
}
 */