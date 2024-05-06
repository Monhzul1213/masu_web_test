import React, { useEffect, useState } from 'react';
import { withSize } from 'react-sizeme';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import {Empty} from 'antd';
import '../../css/invt.css';
import '../../css/report.css';
import { Filter } from '../../components/report/review/Filter';
import { Figure } from '../../components/report/review/Figure';
import { getList } from '../../services';
import moment from 'moment';

function Screen(props) {
  const dispatch = useDispatch();
  const { user, token } = useSelector(state => state.login);
  const { t } = useTranslation();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    let query = '?BeginDate=' + moment()?.format('yyyy.MM.DD') + '&EndDate=' + moment()?.format('yyyy.MM.DD'); 
    getData(query);
  }, []);

  const getData = async (query, query1, dates) => {
    setError(null);
    setLoading(true);
    let api = 'Txn/GetArReport' + (query ?? '') + (query1 ?? '');
    let headers = { merchantid: user?.merchantId };
    const response = await dispatch(getList(user, token, api, null, headers));
    console.log(api);
    if (response?.error) setError(response?.error);
    else {
      setData(response?.data?.msCustomer);
    }
    setLoading(false);
  };

  return (
    <div className='s_container_r'>
        <Filter onSearch={getData}/>
          {data?.length ? 
            <Figure  data={data} />
            :
    <div class="no_data">
          <Empty class="no_data_icon" description={false} />
          <p>Сонгосон шүүлтүүрт тохирох мэдээлэл байхгүй байна</p>
          </div>
      }
    </div>
  );
}
const withSizeHOC = withSize();
export const Review = withSizeHOC(Screen);
