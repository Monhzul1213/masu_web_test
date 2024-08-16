import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { message } from 'antd';
import moment from 'moment';
import { withSize } from 'react-sizeme';


import '../../../css/invt.css';
import { getList, sendRequest } from '../../../services';
import { Empty1, Error1, Overlay } from '../../../components/all';
import { Header, List } from '../../components/config/reclam/list';
import { useTranslation } from 'react-i18next';

export function Card (props) {
  const { size } = props;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState();
  const [data, setData] = useState([]);
  const [show, setShow] = useState(false);
  const [checked, setChecked] = useState(false);
  const { user, token } = useSelector(state => state.login);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { t } = useTranslation();

  useEffect(() => {
    let query = '?BeginDate=' + moment()?.startOf('month')?.format('yyyy.MM.DD') + '&EndDate=' + moment()?.format('yyyy.MM.DD');
    getData(query);
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getData = async (query) => {
    setError();
    setLoading(true);
    try {
      const api = 'Site/GetAdvertisement' + query;
      const response = await dispatch(getList(user, token, api));
      if (response?.error) {
        setError(response.error);
      } else {
        setData(response.data?.ads);
      }
    } catch (err) {
      setError(err.message);
    }
    setShow(false);
    setChecked(false);
    setLoading(false);
  };

  const onClickDelete = async () => {
    let toDelete = data.filter(item => item.checked).map(item => ({ ...item, rowStatus: 'D', image: {} }));
    setError(null);
    setLoading(true);
    try {
      const response = await dispatch(sendRequest(user, token, '?', toDelete));
      if (response?.error) {
        setError(response.error);
      } else {
        message.success(t('reclam.delete_success'));
      }
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };

  const onClickAdd = () => navigate('reclam_add');

  const width = size?.width >= 720 ? 720 : size?.width;
  const headerProps = { setError, onSearch: getData, onClickAdd, show, onClickDelete };
  const emptyProps = { icon: 'MdReceipt', type: 'time', onClickAdd, noDescr: true };
  const listProps = { data, setData, onClickAdd, setShow, checked, setChecked };

  return (
    <div className='store_tab' style={{ flex: 1 }}>
      <Overlay loading={loading}>
            {error && <Error1 error={error} />}
            <div className='mo_container' style={{ width }}>
                <Header {...headerProps} size={size} />
                {!data.length ? <Empty1 {...emptyProps} /> : <List {...listProps} size={size} />}
            </div>
      </Overlay>
    </div>
  );
};

const withSizeHOC = withSize();
export const Reclam = withSizeHOC(Card);
