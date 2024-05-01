import React, { useEffect, useState } from 'react';
import { withSize } from 'react-sizeme';
import { MdOutlineReceiptLong } from 'react-icons/md';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';

import '../../css/invt.css';
import '../../css/report.css';
import { Filter } from '../../components/report/review/Filter';
import { List } from '../../components/report/review/List';
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
    let api = 'Sales/GetSalesByConsumer' + (query ?? '') + (query1 ?? '');
    let headers = { merchantid: user?.merchantId };
    const response = await dispatch(getList(user, token, api, null, headers));
    console.log(response?.data);
    if (response?.error) setError(response?.error);
    else {
      setData(response?.data?.sales);
    }
    setLoading(false);
  };

  return (
    <div className='s_container_r'>
        <Filter onSearch= {getData}  />
          {data?.length ? <List data = {data}/>
          :
          <div className={'empty_back1'}>
            <div className={'empty_icon_back'}>
              <MdOutlineReceiptLong className='empty_icon'/>
            </div>
              <p className={'empty_descr'}>
                {t('page.no_filter')}
              </p>
          </div>
        }
    </div>
  );
}

const withSizeHOC = withSize();
export const Review = withSizeHOC(Screen);
