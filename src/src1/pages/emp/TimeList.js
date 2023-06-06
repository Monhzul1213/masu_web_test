import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { SizeMe } from 'react-sizeme';
import moment from 'moment';
import { useTranslation } from 'react-i18next';

import { getList } from '../../../services';
import { Error1, Overlay } from '../../../components/all';
import '../../css/time.css'
import { List } from '../../components/emp/timelist';


export function TimeList(){
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState([]);
  const [sites, setSites] = useState([]);
  const [emps, setEmps] = useState([]);
  const [excelName, setExcelName] = useState('');
  const { user, token }  = useSelector(state => state.login);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if(user?.msRole?.webManageEmployy !== 'Y') navigate({ pathname: '/' });
    else {
      let dates = [moment()?.startOf('month'), moment()];
      let query = '?BeginDate=' + moment()?.startOf('month')?.format('yyyy.MM.DD') + '&EndDate=' + moment()?.format('yyyy.MM.DD');
      getData(query, null , dates);
    }
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getData = async (query, query1 , dates) => {
    setError(null);
    setLoading(true);
    let api = 'Employee/TimeCard/GetTimeCard' + (query ?? '') + (query1 ?? '');
    const response = await dispatch(getList(user, token, api));
    if(response?.error) setError(response?.error);
    else {
      let grpData =[];
      response?.data.forEach((element)=>{
        let index = grpData?.findIndex(item => item.empCode === element.empCode )
        if(index === -1){
          element.siteCount = 1;
          grpData.push(element)
        }
        else {
          grpData[index].totalHours += element.totalHours 
          grpData[index].siteCount +=  (grpData[index].siteId === element.siteId) ? 0 :  1 ;
          grpData[index].siteName = grpData[index].siteCount=== 1 ? grpData[index].siteName :  grpData[index].siteCount + ' дэлгүүр' 
        
        }
      })
      setData(grpData);
      if(dates) setExcelName(t('header./employee/shift_list') + ' ' + dates[0]?.format('yyyy.MM.DD') + '-' + dates[1]?.format('yyyy.MM.DD'));
    }
    setLoading(false);  
  }

  const listProps = { data, excelName, setError, onSearch: getData, sites, setSites, emps, setEmps };

  return (
    <div className='s_container_i'>
      <Overlay loading={loading}>
        {error && <Error1 error={error} />}
          <SizeMe>{({ size }) => 
              <div className='i_list_cont_zz' id='invt_list_zz'>
                <List {...listProps} size={size} /> 
              </div>
          }</SizeMe>
      </Overlay>
    </div>
  );
}