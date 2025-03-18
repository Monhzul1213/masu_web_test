import React, { useEffect, useState } from 'react';
import { Progress } from 'antd';
import { FaRegMoneyBillAlt, FaRegCreditCard, FaShoppingBasket } from 'react-icons/fa';
import { useSelector, useDispatch} from 'react-redux';
import { BsCardChecklist } from 'react-icons/bs';

import { getColor } from '../../../helpers';
import { DynamicBSIcon, Money } from '../../all';
import { Detail } from './Detail';
import { getList } from '../../../services';

export function Card(props){
  const { data, size } = props;
  const [width, setWidth] = useState(210);
  const [visible, setVisible] = useState(false);
  const [detail, setDetail] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { user, token }  = useSelector(state => state.login);
  const dispatch = useDispatch();

  useEffect(() => {
    let width = 250;
    if(size?.width >= 1290) width = calcWidth(1290, 5);
    else if(size?.width < 1290 && size?.width >= 1000) width = calcWidth(size?.width, 4);
    else if(size?.width < 1000 && size?.width >= 750) width = calcWidth(size?.width, 3);
    else if(size?.width < 750 && size?.width >= 500) width = calcWidth(size?.width, 2);
    else if(size?.width < 500) width = calcWidth(size?.width, 1);
    setWidth(width);
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [size?.width]);

  const calcWidth = (wid, num) => {
    return (wid - 30 - (num - 1) * 10) / num;
  }

  console.log(data);

  const renderCard = (item, index) => {

    const onClick = async () => {
      setVisible(true);
      setLoading(true);
      let query = item?.siteID ? '?SiteID=' + item?.siteID  : '';
      let api = 'Txn/GetHandQtyDtl' + (query);
      let headers = { merchantid: user?.merchantId };
      const response = await dispatch(getList(user, token, api, null, headers));
      if(response?.error) setError(response?.error);
      setDetail(response?.data?.dtl);
      setLoading(false);
    };

    let color = getColor(1 - (index / data?.length))
    return (
      <div className='rw_card' key={index} style={{ width }} onClick={onClick}>
        <div className='rw_card_row'>
          <p className='rw_card_name'>{item?.siteName}</p>
          <div className='rw_card_row2'>
            <FaShoppingBasket className='rw_card_basket' style={{ color }} />
            <p className='rw_card_count' style={{ color }}> {item?.salesCount}</p>
          </div>
        </div>
        <p className='rw_card_amt'><Money value={item?.salesAmount} fontSize={18} /></p>
        <div className='rw_card_row2'>
          <div className='rw_card_col'>
            <div className='rw_card_type'>
              <FaRegMoneyBillAlt className='rw_card_icon' style={{ color }} />
              <p className='rw_card_cash'><Money value={item?.cashAmount} fontSize={11} /> </p>
            </div>
            <div className='rw_card_type'>
              <FaRegCreditCard className='rw_card_icon' style={{ color }} />
              <p className='rw_card_cash'><Money value={item?.nonCashAmount} fontSize={11} /> </p>
            </div>
            <div className='rw_card_type1'>
              <DynamicBSIcon name='BsCardList' className='rw_card_icon' style={{ color }} />
              <p className='rw_card_cash'>{item?.handQty ?? 0}</p> 
              <p className='rw_card_cash'>|</p>
              <p className='rw_card_cash'><Money value={item?.totalCost} fontSize={11} /> </p>
            </div>
          </div>
          <Progress className='rw_card_progress' percent={+item?.salesPercent?.toFixed(1)} width={55}
            strokeWidth={8} strokeColor={color} type="circle" format={(percent) => `${percent}%`} />
        </div>
      </div>
    );
  }

  const closeModal = () => {
    setVisible(false);
  }

  const detailProps = { data : detail, visible, closeModal, loading, error, size};

  return (
    <>    
      {visible && <Detail {...detailProps} />}
      <div className='rw_card_back'>
        {data?.map(renderCard)}
      </div>
    </>

  );
}