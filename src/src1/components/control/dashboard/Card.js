import React, { useEffect, useState } from 'react';
import { Progress } from 'antd';
import { FaRegMoneyBillAlt, FaRegCreditCard, FaShoppingBasket } from 'react-icons/fa';
import { useSelector, useDispatch} from 'react-redux';

import { getColor } from '../../../../helpers';
import { DynamicBSIcon, Money } from '../../../components/all/all_m';
import { DynamicAIIcon } from '../../../../components/all';
import { Detail } from '../../../../components/report/review/Detail';
import { getList } from '../../../../services';

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
      <div className='dash_card' key={index} style={{ width }} >
        <div className='dash_card_row'>
          <p className='dash_card_name'>{item?.siteName}</p>
        </div>
        <div className='dash_card_row2' style={{margin: '10px 0'}}>
          <Progress className='dash_card_progress' percent={+item?.salesPercent?.toFixed(1)} width={70}
              strokeWidth={8} strokeColor={color} type="circle" format={(percent) => `${percent}%`} />  
          <div className='dash_card_col'>
            <div className='dash_card_type'>
              <FaRegMoneyBillAlt className='dash_card_icon' style={{ color }} />
              <p className='dash_card_cash'><Money value={item?.cashAmount} fontSize={11} /> </p>
            </div>
            <div className='dash_card_type'>
              <FaRegCreditCard className='dash_card_icon' style={{ color }} />
              <p className='dash_card_cash'><Money value={item?.nonCashAmount} fontSize={11} /> </p>
            </div>
            <div className='dash_card_type1'>
              <DynamicBSIcon name='BsCardList' className='dash_card_icon' style={{ color }} />
              <p className='dash_card_cash'>{item?.handQty ?? 0}</p> 
              <p className='dash_card_cash'>|</p>
              <p className='dash_card_cash'><Money value={item?.totalCost} fontSize={11} /> </p>
            </div>
          </div>
        </div>
        <div className='dash_card_row'>
          <div className='dash_card_row2'>
            <div className='dash_card_row3'>
                <FaShoppingBasket className='dash_card_basket' />
                <p className='dash_card_count'> {item?.salesCount}</p>
            </div> 
            <p className='dash_card_amt'><Money value={item?.salesAmount} fontSize={14} /></p>
          </div>
          <DynamicAIIcon name='AiFillRightCircle' onClick ={onClick} className='dash_card_icon1'/>
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