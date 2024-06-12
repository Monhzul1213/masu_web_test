import React, { useState, useEffect } from 'react';
import { message } from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, createSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { withSize } from 'react-sizeme';

import '../../css/invt.css';
import { getList, sendRequest } from '../../services';
import { ButtonRowAddConfirm, Empty, Error1, Overlay } from '../../components/all';
import { List } from '../../components/emp/role';

function Screen(props){
  const { size } = props;
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState([]);
  const [show, setShow] = useState(false);
  const [checked, setChecked] = useState(false);
  const { user, token }  = useSelector(state => state.login);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    user?.msRole?.webManageEmployy !== 'Y' ? navigate({ pathname: '/' }) : getData();
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getData = async () => {
    setError(null);
    setLoading(true);
    const response = await dispatch(getList(user, token, 'Employee/Role/-1'));
    if(response?.error) setError(response?.error);
    else {
      response?.data?.forEach(item => {
        item.accesses = (item?.webAccess === 'Y' ? 'Back office' : '') +
          (item?.posAccess === 'Y' && item?.webAccess === 'Y' ? ' and ' : '') + (item?.posAccess === 'Y' ? 'POS' : '')
      });
      setData(response?.data);
    }
    setLoading(false);
    setShow(false);
    setChecked(false);
  }

  const onClickAdd = row => {
    if(row) navigate({ pathname: 'access_add', search: createSearchParams({ roleId: row?.roleId }).toString() });
    else navigate('access_add');
  }

  const onClickDelete = async () => {
    let toDelete = [];
    data?.forEach(item => {
      if(item.checked) toDelete.push({...item, rowStatus: 'D', isUpdate: item?.isUpate ?? 'Y' });
    });
    setError(null);
    setLoading(true);
    let response = await dispatch(sendRequest(user, token, 'Employee/Role', toDelete));
    setLoading(false);
    if(response?.error) setError(response?.error);
    else {
      message.success(t('role.delete_success'));
      getData();
    }
  }

  const width = size?.width >= 780 ? 780 : size?.width;
  const emptyProps = { icon: 'MdOutlineSupervisorAccount', type: 'role', onClickAdd, noDescr: true };
  const addProps = { type: 'role', onClickAdd, show, onClickDelete };
  const listProps = { data, setData, onClickAdd, setShow, checked, setChecked };

  return (
    <div className='s_container_i'>
      <Overlay loading={loading}>
        {error && <Error1 error={error} />}
        {!data?.length ? <Empty {...emptyProps} /> :
          <div className='mo_container' style={{ width }}>
            <ButtonRowAddConfirm {...addProps} />
            <List {...listProps} />
          </div>
        }
      </Overlay>
    </div>
  );
}

const withSizeHOC = withSize();
export const Role = withSizeHOC(Screen);