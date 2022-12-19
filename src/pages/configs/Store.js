import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useTable, usePagination, useRowSelect, useSortBy } from 'react-table';
import { useTranslation } from 'react-i18next';
import { withSize } from 'react-sizeme';

import { getList } from '../../services';
import { ButtonRowAdd, Empty, Error1, Overlay, PaginationTable, Table } from '../../components/all';
import { Add } from '../../components/config/store';

function Card(props){
  const { size } = props;
  const { t, i18n } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState([]);
  const [visible, setVisible] = useState(false);
  const [item, setItem] = useState(null);
  const [columns, setColumns] = useState([]);
  const { user, token }  = useSelector(state => state.login);
  const dispatch = useDispatch();

  useEffect(() => {
    getData();
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setColumns([
      { Header: t('shop.t_name'), accessor: 'name' },
      {
        Header: t('shop.t_addr'), accessor: 'address',
        Cell: props => <div>{props?.row?.original?.descr} {props.value}</div>
      },
      {
        Header: <div style={{textAlign: 'right'}}>{t('shop.t_pqty')}</div>, accessor: 'posQty',
        Cell: props => <div style={{textAlign: 'right', paddingRight: 15}}>{props.value}</div>
      },
    ]);
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [i18n?.language]);

  const getData = async () => {
    setError(null);
    setLoading(true);
    const response = await dispatch(getList(user, token, 'Site/GetSite'));
    if(response?.error) setError(response?.error);
    else setData(response?.data);
    setLoading(false);
  }

  const onClickAdd = row => {
    setVisible(true);
    setItem(row?.original);
  }

  const closeModal = toGet => {
    setVisible(false);
    setItem(null);
    if(toGet) getData();
  }

  const width = size?.width >= 720 ? 720 : size?.width;
  
  const emptyProps = { icon: 'MdStorefront', type: 'shop', noDescr: true, onClickAdd };
  const modalProps = { visible, closeModal, selected: item };
  const addProps = { type: 'shop', onClickAdd };
  const maxHeight = 'calc(100vh - var(--header-height) - var(--page-padding) * 4 - 36px - 10px - var(--pg-height) - 5px)';
  const tableInstance = useTable( { columns, data, autoResetPage: false, initialState: { pageIndex: 0, pageSize: 25 }},
    useSortBy, usePagination, useRowSelect);
  const tableProps = { tableInstance, onRowClick: onClickAdd };

  // return (
  //   <div style={{flex: 1}}>
  //     <Overlay loading={loading}>
  //       {error && <Error1 error={error} />}
  //       {!data?.length ? <Empty {...emptyProps} /> :
  //         <div className='store_tab'>
  //           <ButtonRowAdd {...addProps} />
  //           <div id='paging' style={{marginTop: 10, overflow: 'scroll', maxHeight}}>
  //             <Table {...tableProps} />
  //           </div>
  //           <PaginationTable {...tableProps} />
  //         </div>
  //       }
  //     </Overlay>
  //   </div>
  // )

  return (
    <div className='store_tab' style={{flex: 1}}>
      {visible && <Add {...modalProps} />}
      <Overlay loading={loading}>
      {!data?.length ? <div style={{ width }}><Empty {...emptyProps} /></div> :
        <div className='mo_container' style={{ width }}>
          {/* <ButtonRowAddConfirm {...addProps} /> */}
          {/* <List {...listProps} /> */}
        </div>
        }
      </Overlay>
    </div>
  );

  /**
   * return (
    <div className='s_container_i'>
        {error && <Error1 error={error} />}
        {!data?.length ? <Empty {...emptyProps} /> :
          <div className='mo_container' style={{ width }}>
            <ButtonRowAddConfirm {...addProps} />
            <List {...listProps} />
          </div>
        }
    </div>
  );
   */
}

const withSizeHOC = withSize();
export const Store = withSizeHOC(Card);

/**
 * import React, { useState, useEffect } from 'react';
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

  const emptyProps = { icon: 'MdOutlineSupervisorAccount', type: 'role', onClickAdd, noDescr: true };
  const addProps = { type: 'role', onClickAdd, show, onClickDelete };
  const listProps = { data, setData, onClickAdd, setShow, checked, setChecked };

  
}

 */