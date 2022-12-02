import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { getList, } from '../../../services';
import { Empty1, Error1, Overlay } from '../../../components/all';
import { SizeMe } from 'react-sizeme';
import '../../css/time.css'
import { Header, List } from '../../components/emp/timelist';
import moment from 'moment';
export function TimeList(){
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState([]);
  // const [filter, setFilter] = useState('');
  const [sites, setSites] = useState([]);
  const [emps, setEmps] = useState([]);
  const { user, token }  = useSelector(state => state.login);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if(user?.msRole?.webManageEmployy !== 'Y') navigate({ pathname: '/' });
    else {
      let query = '?BeginDate=' + moment()?.startOf('month')?.format('yyyy.MM.DD') + '&EndDate=' + moment()?.format('yyyy.MM.DD');
      getData(query);
    }
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getData = async query => {
    setError(null);
    setLoading(true);
    let api = 'Employee/TimeCard/GetTimeCard' + (query ?? '');
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
          grpData[index].siteCount +=  (grpData[index].siteId=== element.siteId) ? 0 :  1 ;
          grpData[index].siteName = grpData[index].siteCount=== 1 ? grpData[index].siteName :  grpData[index].siteCount + ' дэлгүүр' 
        
        }
      })
      setData(grpData);
    }
    setLoading(false);
    // setFilter(query);
  }

  const emptyProps = { icon: 'MdSchedule', type: 'time', noDescr: true };
  const headerProps = {  setError, onSearch: getData, sites, setSites, emps, setEmps };
  const listProps = { data, };

  return (
    <div className='s_container_i'>
      <Overlay loading={loading}>
        {error && <Error1 error={error} />}
          <SizeMe>{({ size }) => 
              <div className='i_list_cont_zz' id='invt_list_z'>
                <Header {...headerProps} size={size} />
                {!data?.length ? <Empty1 {...emptyProps} /> : <List {...listProps} size={size} />}
              </div>
          }</SizeMe>
      </Overlay>
    </div>
  );
}