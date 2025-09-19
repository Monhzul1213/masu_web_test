import React, { useEffect, useState } from "react";
import { SizeMe } from "react-sizeme";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import moment from "moment";

import "../../../../css/order.css";
import "../../../../css/invt.css";
import { getList } from "../../../../services";
import { Empty1, Error1, Overlay } from "../../../../components/all";
import { Filter, List } from "../../../components/finance/journal/list";
import { Subscription } from "../../../../components/management/adjust/list";

export function Journal() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState([]);
  const [visible, setVisible] = useState(false);
  const [requestTime, setRequestTime] = useState(null);
  const [responseTime, setResponseTime] = useState(null);
  const [hideTime, setHideTime] = useState(false);
  const { user, token }  = useSelector(state => state.login);
  const maxWidth = useSelector(state => state.temp.maxWidth);
  const queryDate = useSelector(state => state.temp.queryDate);
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
    if (user?.msRole?.webFinance !== "Y") navigate({ pathname: "/" });
    else {
      let query = "?BeginDate=" + moment().startOf('month')?.format("yyyy.MM.DD") + "&EndDate=" + moment()?.format("yyyy.MM.DD");
      onSearch(queryDate ? queryDate : query);
    }
    return () => {};
        // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onSearch = async (query) => {
    setError(null);
    setLoading(true);
    setRequestTime(new Date()); // илгээсэн цаг тэмдэглэх

    const response = await dispatch(getList(user, token, "Txn/GetJournal" + (query ?? "")));
    if (response?.code === 1000) {
      setVisible(true);
    }
    if (response?.error) {setError(response?.error)} 
    else setData(response?.data);
    setLoading(false);
    setResponseTime(new Date()); // авсан цаг тэмдэглэх

  };

  const onDone = async () => {
    setVisible(false);
  };
  const onClickAdd = () => navigate("/finance/journal/journal_add");

  const listProps = { data, onClickAdd };
  const headerProps = { onClickAdd, setError, onSearch };
  const subProps = { visible, setVisible, onDone };

  return (
    <div className="s_container_i" style={{maxWidth, display: 'flex', flexFlow: 'row'}}>
      {visible && <Subscription {...subProps} />}
      <div style={{flex: '0 0 80%'}}>
      <Overlay loading={loading}>
        {error && <Error1 error={error} />}
        <SizeMe>
          {({ size }) => (
            <div className="i_list_cont" id="invt_list">
              <Filter {...headerProps} size={size} />
              {!data?.length ? (
                <Empty1 icon="MdOutlineArticle" />
              ) : (
                <List {...listProps} size={size} />
              )}
            </div>
          )}
        </SizeMe>
      </Overlay>
      </div>
      {hideTime ? null : <div className="time-log" style={{ padding: '8px', fontSize: '12px', color: '#666',}}>
          {requestTime && <p>Илгээсэн цаг: {requestTime.toLocaleTimeString()}</p>}
          {responseTime && <p>Хүлээн авсан цаг: {responseTime.toLocaleTimeString()}</p>}
          {requestTime && responseTime && (
            <p>Хугацаа: {(responseTime - requestTime) / 1000} секунд</p>
          )}
      </div>}
    </div>
  );
}
