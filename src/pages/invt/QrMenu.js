import React, { useEffect, useState } from 'react';
import { SizeMe } from 'react-sizeme';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import moment from 'moment';

import '../../css/invt.css';
import { getList } from '../../services';
import { Empty1, Error1, Overlay } from '../../components/all';
import { Filter, List } from '../../components/invt/QrMenu/list/index';


export function QrMenu() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState([]);
  const { user, token } = useSelector(state => state.login);
  const maxWidth = useSelector(state => state.temp.maxWidth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
   if(user?.msRole?.webManageItem !== 'Y') navigate({ pathname: '/' });
       else {
         let query = '?BeginDate=' + moment()?.startOf('month')?.format('yyyy.MM.DD') + '&EndDate=' + moment()?.format('yyyy.MM.DD');
         onSearch(query);
       }
       return () => {};
       // eslint-disable-next-line react-hooks/exhaustive-deps
     }, []);

   const onSearch = async query => {
      setError(null);
      setLoading(true);
      let api = 'Integration/GetQrMenu' + query ?? '';
      const response = await dispatch(getList(user, token, api));
      if(response?.error) setError(response?.error);
      else {
        response?.data?.menuitem?.forEach(item=> {
          item.date = moment(item?.beginDate)?.format('yyyy.MM.DD') + '-' + moment(item?.endDate)?.format('yyyy.MM.DD')
        })
        setData(response?.data?.menu);
      }
      setLoading(false);  
    }

  const onClickAdd = () => navigate('/qrmenu/qrmenu/qrmenuadd');


  const filterProps = { onSearch, onClickAdd, setError };
  const listProps = { data, onClickAdd };

  return (
    <div className="s_container_i" style={{ maxWidth }}>
      <Overlay loading={loading}>
        {error && <Error1 error={error} />}
        <SizeMe>
          {({ size }) => (
            <div className="i_list_cont" id="invt_list">
              <Filter {...filterProps} size={size} />
              {!data?.length ? <Empty1 icon="MdQrCode" /> : <List {...listProps} size={size} />}
            </div>
          )}
        </SizeMe>
      </Overlay>
      {/* <Help videoData={videoData} />   */}
    </div>
  );
}


