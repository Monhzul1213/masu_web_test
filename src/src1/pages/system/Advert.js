import React, { useState, useEffect } from 'react';
import { SizeMe } from 'react-sizeme';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate} from 'react-router-dom';
import moment from 'moment';
import { message } from 'antd';
import '../../../css/invt.css';
import { getList, sendRequest} from '../../../services';
import { Empty1, Error1, Overlay } from '../../../components/all';
import { Header, List } from '../../components/system/advert/list';
import { useTranslation } from 'react-i18next';

export function Advert(){
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState([]);
  const [show, setShow] = useState(false);
  const [checked, setChecked] = useState(false);
  const { user, token }  = useSelector(state => state.login);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { t } = useTranslation();

  useEffect(() => {
    if(user?.isAdmin){
      let query = '?BeginDate=' + moment()?.startOf('month')?.format('yyyy.MM.DD') +
        '&EndDate=' + moment()?.format('yyyy.MM.DD');
      getData(query);
    } else 
      navigate({ pathname: '/' });
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getData = async query => {
    setError(null);
    setLoading(true);
    let api = 'Site/GetAdvertisement' + (query ?? '');
    const response = await dispatch(getList(user, token, api));
    if(response?.error) setError(response?.error);
    else {
      setData(response?.data);
    }
    setShow(false);
    setChecked(false);
    setLoading(false);
  }

  const onClickDelete = async () => {
    let toDelete = [];
    data?.forEach(item => {
      if(item.checked) toDelete.push({...item, rowStatus: 'D', image : {}});
    });
    setError(null);
    setLoading(true);
    let response = await dispatch(sendRequest(user, token, 'Site/ModAdvertisement', toDelete));
    setLoading(false);
    if(response?.error) setError(response?.error);
    else {
      message.success(t('advert.delete_success'));
      let query = '?BeginDate=' + moment()?.startOf('month')?.format('yyyy.MM.DD') +
      '&EndDate=' + moment()?.format('yyyy.MM.DD');
      getData(query);
    }
  }

  const onClickAdd = () => navigate('advert_add');


  const headerProps = { setError, onSearch: getData , onClickAdd , show , onClickDelete};
  const emptyProps = { icon: 'MdReceipt', type: 'time', onClickAdd, noDescr: true };
  const listProps = { data, setData, onClickAdd , setShow, checked, setChecked   };

  return (
    <div className='s_container_i'>
      <Overlay loading={loading}>
        {error && <Error1 error={error} />}
        <SizeMe>{({ size }) => 
          <div className='i_list_cont' id='solve_list'>
            <Header {...headerProps} size={size} />
            {!data?.length ? <Empty1 {...emptyProps} /> : <List {...listProps} size={size} />}
          </div>
        }</SizeMe>
      </Overlay>
    </div>
  );
}