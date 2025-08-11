import React, { useState, useEffect } from 'react';
import { SizeMe } from 'react-sizeme';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate} from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { message } from 'antd';

import '../../../css/invt.css';
import { getList, sendRequest} from '../../../services';
import { Empty1, Error1, Overlay } from '../../../components/all';
import { Header, List } from '../../components/system/syschange/list';
import { Add } from '../../components/system/syschange/add/Add';

export function SysChange(){
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState([]);
  const [selected, setSelected] = useState(null);
  const [show, setShow] = useState(false);
  const [checked, setChecked] = useState(false);
  const [visible, setVisible] = useState(false);
  const { user, token }  = useSelector(state => state.login);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { t } = useTranslation();

  useEffect(() => {
    if(user?.isAdmin) getData();
    else navigate({ pathname: '/' });
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getData = async () => {
    setError(null);
    setLoading(true);
    const response = await dispatch(getList(user, token, 'System/GetVersionHistory'));
    if(response?.error) setError(response?.error);
    else setData(response?.data?.versionhistory)
    setShow(false);
    setChecked(false);
    setLoading(false);
  }

  const onClickDelete = async () => {
    let toDelete = [];
    data?.forEach(item => {
      if(item.checked) toDelete.push({
        verisionDate: selected?.verisionDate?.format('yyyy.MM.DD'),
        versionTitle: selected?.versionTitle,
        versionDescr: selected?.versionDescr,
        rowStatus:'D'
      });
    });    
    setError(null);
    setLoading(true);
    let response = await dispatch(sendRequest(user, token, 'System/ModNotification', toDelete));
    setLoading(false);
    if(response?.error) setError(response?.error);
    else {
      message.success(t('noti.delete_success'));
      getData();
    }
  }

  const onClickAdd = row => {
    setVisible(true);
    setSelected(row?.original);
  };

  const closeModal = toGet => {
    setVisible(false);
    setSelected(null);
    if(toGet) getData();
  };

  const headerProps = { setError, onSearch: getData , onClickAdd , show , onClickDelete};
  const emptyProps = { icon: 'MdReceipt', type: 'time', onClickAdd, noDescr: true };
  const listProps = { data, setData, onClickAdd , setShow, checked, setChecked };
  const modalProps = { visible, closeModal, selected, onSearch: getData };

  return (
    <div className='s_container_i'>
      {visible && <Add {...modalProps} />}
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