import React, { useState, useEffect } from 'react';
import { useNavigate, createSearchParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { message } from 'antd';

import '../../css/invt.css';
import { deleteMultiRequest, getList, sendRequest } from '../../services';
import { Confirm, Empty, Empty1, Error1, Overlay } from '../../components/all';

export function Employee(){
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState([]);
  const [show, setShow] = useState(false);
  const [checked, setChecked] = useState(false);
  const [filtering, setFiltering] = useState(false);
  const [open, setOpen] = useState(false);
  const [filter, setFilter] = useState([]);
  const { user, token }  = useSelector(state => state.login);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    // getData();
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onClickAdd = row => {
    // if(row) navigate({ pathname: 'invt_add', search: createSearchParams({ invtId: row?.invtId }).toString() });
    // else
    // navigate('emp_add');
  }
  const emptyProps = { icon: 'MdOutlinePersonOutline', type: 'employee', onClickAdd, noDescr: true };
  // const headerProps = { onClickAdd, onClickDelete, show, setError, onSearch };
  // const listProps = { data, setData, onClickAdd, setShow, checked, setChecked, updateInventory };
  // const confirmProps = { open, text: t('page.delete_confirm'), confirm };

  return (
    <div className='s_container_i'>
      {/* {open && <Confirm {...confirmProps} />} */}
      <Overlay loading={loading}>
        {error && <Error1 error={error} />}
        <Empty {...emptyProps} />
        {/* {!data?.length && !filtering ? <Empty {...emptyProps} /> :
          <div className='i_list_cont' id='invt_list'>
            <Header {...headerProps} />
            {!data?.length ? <Empty1 {...emptyProps} /> : <List {...listProps} />}
          </div>
        } */}
      </Overlay>
    </div>
  )
}