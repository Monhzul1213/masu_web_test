import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { SizeMe } from 'react-sizeme';
import { useTranslation } from 'react-i18next';
import { message } from 'antd';
import { useNavigate } from 'react-router-dom';

import { Overlay, Error1 , Confirm } from '../../components/all/all_m';
import { Add, List } from '../../components/customer/customer';
import { getList , getServiceBar, sendRequest } from '../../../services';
import '../../css/customer.css'
import { Subscription } from '../../../components/management/adjust/list/Subscription';
import { Help } from '../../../components/invt/inventory/list';
import { Empty2 } from '../../../components/all';

export function Customer(props){
  const { t } = useTranslation();
  const [visible, setVisible] = useState(false);
  const [visible1, setVisible1] = useState(false);
  const [data, setData] = useState([]);
  const [excelName, setExcelName] = useState('');
  const [loaded, setLoaded] = useState(0);
  const [item, setItem] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [show, setShow] = useState(false);
  const [branch, setBranch] = useState([]);
  const [allBranch, setAllBranch] = useState([]);
  const [filtering, setFiltering] = useState(false);
  const [filter,  setFilter] =   useState('');
  const [checked, setChecked] = useState(false);
  const [requestTime, setRequestTime] = useState(null);
  const [responseTime, setResponseTime] = useState(null);
  const [hideTime, setHideTime] = useState(false);
  const { user, token }  = useSelector(state => state.login);
  const maxWidth = useSelector(state => state.temp.maxWidth);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    if (
      user?.merchantId === 383 ||
      user?.merchantId === 270
      )
      setHideTime(false);
    else
      setHideTime(true);
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => {
    getBranchs();
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  
  useEffect(() => {
    if (branch.length > 0 && user?.msRole?.webManageItem === 'Y') {
      getData();
    }
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [branch]);
  

  const getBranchs = async () => {
    setError(null);
    setLoading(true);
    const response = await dispatch(getServiceBar('getBranchInfo'));
    if(response?.error) setError(response?.error);
    else {
      let data = [];
      response?.data?.data?.forEach(item => {
        let index = data?.findIndex(list => item.branchCode === list.branchCode )
        if(index === -1 ) data.push(item)
      })
      setBranch(data?.sort((a, b)=> a?.branchCode - b?.branchCode));
      setAllBranch(response?.data?.data);
    }
    setLoading(false);
  }

  const getData = async (query) => {
    setFilter(query);
    setError(null);
    setLoading(true);
    setRequestTime(new Date()); // илгээсэн цаг тэмдэглэх

    let headers = {CustID: -1};
    let api = 'Site/GetCustomer/Filter' + query ?? '';
    let response = query
      ? await dispatch(getList(user, token, api ))
      : await dispatch(getList(user, token, 'Site/GetCustomer',null,  headers));
    if(response?.code === 1000){
      // comment
      // isNew or isExpired
      // || response?.code === 1001
      setVisible1(true);
    }
    if(query){
      response?.data?.forEach(item => {
        branch?.forEach(li => {
          if(li?.branchCode?.includes(item?.branchCode)){
            item.branchName = li?.branchName
          }
        })
        allBranch?.forEach(li => {
          if(li?.branchCode?.includes(item?.branchCode)){
            if(li?.subBranchCode === item?.subBranchCode ){
              item.subBranchName = li?.subBranchName
            }
          }
        })
      })
    } else {
      response?.data?.customers?.forEach(item => {
        branch?.forEach(li => {
          if(li?.branchCode?.includes(item?.branchCode)){
            item.branchName = li?.branchName
          }
        })
        allBranch?.forEach(li => {
          if(li?.branchCode?.includes(item?.branchCode)){
            if(li?.subBranchCode === item?.subBranchCode ){
              item.subBranchName = li?.subBranchName
            }
          }
        })
      })
    }
    if(response?.error) setError(response?.error);
    else {
      setData(response?.data?.customers ?? response?.data)
      setExcelName(t('header./customer'));
    }
    setLoaded(loaded + 1);
    setLoading(false);
    setShow(false)
    setChecked(false)
    setFiltering(query ? true : false);
    setResponseTime(new Date()); // авсан цаг тэмдэглэх

  }

  const onClickDelete = () => setOpen(true);

  const confirm = async sure => {
    setOpen(false);
    if(sure){
      let toDelete = [];
      data?.forEach(item => {
        if(item.checked){
          item.rowStatus = 'D';
          toDelete.push(item);
        }
      });
      setLoading(true);
      setError(null);
      let response = await dispatch(sendRequest(user, token, 'Site/Customer', toDelete));
      setLoading(false);
      setShow(false);
      if(response?.error) setError(response?.error);
      else {
        message.success(t('customer.delete_success'))
        getData(filter)
      }
    }
  };

  const onClickAdd = row => {
    setVisible(true);
    setItem(row?.original);
  }

  const closeModal = toGet => {
    setVisible(false);
    setItem(null);
    if(toGet) getData();
  }

  const onDone = async () => {
    setVisible1(false);
  }

  const onClickImport = () => navigate('/customer/customer_import');

  const emptyProps = { icon: 'MdSupervisorAccount', type: 'customer', noDescr: true, onClickAdd , isMd : true, onClickImport};
  const modalProps = { visible, closeModal, selected: item, onSearch: getData, filter, data, branch, allBranch, getBranchs };
  const confirmProps = { open, text: t('page.delete_confirm'), confirm };
  const listProps = { data,  onClickAdd, setData , loaded, setShow, checked, setChecked, excelName , onClickDelete, show, setError, onSearch: getData};
  const subProps = { visible: visible1, setVisible: setVisible1, onDone };
  const videoData = [{id: "v_Up6Wi08PQ"}]

  return (
    <div className='s_container_i' style={{maxWidth, display: 'flex', flexFlow: 'row'}}>
      {visible1 && <Subscription {...subProps} />}
      {visible && <Add {...modalProps} />}
      <div style={{flex: '0 0 85%'}}>
      <Overlay loading={loading}>
        {open && <Confirm {...confirmProps} />}
        {error && <Error1 error={error} />}
        {!data?.length && !filtering ? <Empty2 {...emptyProps} /> :
          <SizeMe>{({ size }) => 
            <div className='i_list_cont_z' id='solve_list2'>
              <List {...listProps} size={size} />
            </div>}
          </SizeMe>
        }      
      </Overlay>
      </div>
      <Help videoData={videoData}/>
      {hideTime ? null : <div style={{ padding: '8px', fontSize: '12px', color: '#666',}}>
          {requestTime && <p>Илгээсэн цаг: {requestTime.toLocaleTimeString()}</p>}
          {responseTime && <p>Хүлээн авсан цаг: {responseTime.toLocaleTimeString()}</p>}
          {requestTime && responseTime && (
            <p>Хугацаа: {(responseTime - requestTime) / 1000} секунд</p>
          )}
      </div>}
    </div>
  );
}