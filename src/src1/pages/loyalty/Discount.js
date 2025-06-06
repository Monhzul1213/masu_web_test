import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Empty, Empty1, Error1, Overlay } from '../../components/all/all_m';
import { List, Header } from '../../components/loyalty/discount/list';
import { useDispatch, useSelector } from 'react-redux';
import { getList, sendRequest } from '../../../services';
import { message } from 'antd';
import { withSize } from 'react-sizeme';
import { Subscription } from '../../../components/management/adjust/list/Subscription';
import { Help } from '../../../components/invt/inventory/list';

 function Screen(props){
  const { size } = props;

  const { t } = useTranslation();
  const [loading, setLoading] = useState(null);
  const [error, setError] = useState(null);
  const [data, setData] = useState([]);
  const [show, setShow] = useState(false);
  const [checked, setChecked] = useState(false);
  const [filtering, setFiltering] = useState(false);
  const [visible, setVisible] = useState(false);
  const [filter,  setFilter] =   useState('');
  const dispatch = useDispatch()
  const navigate = useNavigate();
  const { user , token }  = useSelector(state => state.login);

  useEffect(() => {
    user?.msRole?.webManageItem !== 'Y' ? navigate({ pathname: '/' }) : getData();
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

 

  const getData = async query => {
    setError(null);
    setLoading(true);
    let api = 'Site/GetDiscount' +( query ?? '') ;
    const response = await dispatch(getList(user, token, api));
    if(response?.code === 1000){
      // comment
      // isNew or isExpired
      // || response?.code === 1001
      setVisible(true);
    }
    if(response?.error) setError(response?.error);
    else setData(response?.data);
    setLoading(false);
    setShow(false);
    setChecked(false);
    setFiltering(query ? true : false);
    setFilter(query);
  }


  const onClickAdd = () => navigate('disc_add');

  const onClickDelete = async () => {
    let toDelete = [];
    data?.forEach(item => {
      if(item.checked) toDelete.push({...item, rowStatus: 'D', discountSite: [] });
    });
    setError(null);
    setLoading(true);
    let response = await dispatch(sendRequest(user, token, 'Site/AddDiscount', toDelete));
    setLoading(false);
    if(response?.error) setError(response?.error);
    else {
      message.success(t('discount.delete_success'));
      getData(filter);
    }
  }
  const width = size?.width >= 560 ? 560 : size?.width;

  const onDone = async () => {
    setVisible(false);
  }

  const listProps = { data, setData, setShow, checked, setChecked };
  const emptyProps = { icon: 'BsTag', type: 'discount', onClickAdd , isMd: false  };
  const headerProps = { onClickAdd, onClickDelete, show, setError, onSearch: getData, size };
  const subProps = { visible, setVisible, onDone };
  const videoData = [{id: "hJZz3ZmFHWM"}, {id: 'O2Ov2-N5Xuk'}];

  return (
    <div className='s_container_di'>
      {visible && <Subscription {...subProps} />}
      <Overlay loading={loading === 'loading'}>
        {error && <Error1 error={error} />}
        {!data?.length  && !filtering  ? <Empty {...emptyProps} /> :
          <div className='di_container' style={{ width }}>
            <Header {...headerProps}/>
            {!data?.length ? <Empty1 {...emptyProps} /> :<List {...listProps} />}
          </div>
        }
      </Overlay>
      <Help videoData={videoData}/>
    </div>
      
  )
}
const withSizeHOC = withSize();
export const Discount = withSizeHOC(Screen);