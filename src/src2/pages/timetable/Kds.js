import React, { useState, useEffect, useRef } from 'react';
import { SizeMe } from 'react-sizeme';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';

import { Overlay, Error1 } from '../../../src1/components/all/all_m';
import { Header } from '../../../src1/components/timetable/kds/Header';
import { List } from '../../../src1/components/timetable/kds/List';

import { getList } from '../../../services';

export function Kds() {
  const navigate = useNavigate();
  const { user, token } = useSelector(state => state.login);

  const [activeTab, setActiveTab] = useState('doing');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [retdata, setData] = useState({ saleshold: [] });
  const [siteId, setSiteId] = useState(null);

  const searchParamsRef = useRef(null);
  const dispatch = useDispatch();

  const normalizeKdsData = (data, prevData) => {
    if (!data) return { saleshold: [], salesitemhold: [] };

    const prevMap = {};
    if (prevData?.saleshold) {
      prevData.saleshold.forEach(o => {
        prevMap[o.salesNo] = o.lastUpdateLocal || o.lastUpdate || o.createdDate;
      });
    }
    if (prevData?.saleshold_statustwo) {
      prevData.saleshold_statustwo.forEach(o => {
        prevMap[o.salesNo] = o.lastUpdateLocal || o.lastUpdate || o.createdDate;
      });
    }

    const normalizeOrders = (arr) =>
      (arr || []).map(o => ({
        ...o,
        kdsStatus: o.kdsStatus ?? 0,
        lastUpdateLocal: prevMap[o.salesNo] || o.lastUpdate || o.createdDate
      }));

    return {
      ...data,
      saleshold: normalizeOrders(data.saleshold),
      salesitemhold: (data.salesitemhold || []).map(item => ({
        ...item,
        itemStatus: item.itemStatus ?? 1
      })),
      saleshold_statustwo: normalizeOrders(data.saleshold_statustwo),
      salesitemhold_statustwo: (data.salesitemhold_statustwo || []).map(item => ({
        ...item,
        itemStatus: item.itemStatus ?? 1
      }))
    };
  };

  useEffect(() => {
    if (user?.msRole?.webViewItemBalance !== 'Y') navigate({ pathname: '/' });
  }, []);

  useEffect(() => {
    if (!siteId) return;
    const interval = setInterval(() => {
      if (searchParamsRef.current) {
        onSearch(searchParamsRef.current, { silent: true });
      }
    }, 5000);
    return () => clearInterval(interval);
  }, [siteId]);

  const onSearch = async (query, opts) => {
    const selectedSiteId = query?.siteId || query?.SiteID;
    if (!selectedSiteId) {
      setError('Салбар сонгоно уу!');
      setLoading(false);
      return;
    }
    if (!opts?.silent) setLoading(true);
    setError(null);

    setSiteId(selectedSiteId);
    searchParamsRef.current = query;

    let api = `Integration/GetKdsOder?SiteID=${selectedSiteId}`;
    let headers = { authorization: token };

    const response = await dispatch(getList(user, token, api, null, headers));
    const apiData = response?.data;

    if (response?.error) {
      setError(response?.error);
    } else if (response?.rettype !== undefined && response?.rettype !== 0) {
      setError(response?.retdesc || "");
    } else if (apiData) {
      const merged = normalizeKdsData(apiData, retdata);
      setData(merged);
    }

    if (!opts?.silent) setLoading(false);
  };

  const onItemStatusChange = (order, item) => {
    const invtID = item.invtID || item.invtId;
    const siteID = order.siteID || order.siteId;
    const salesNo = order.salesNo;

    if (!invtID) return;

    const newItemStatus = item.itemStatus === 2 ? 1 : 2;

    setData(prev => {
      const cloned = structuredClone(prev);
      const listKey = activeTab === 'doing' ? 'salesitemhold' : 'salesitemhold_statustwo';
      const itemList = cloned[listKey];

      const match = itemList.find(
        it =>
          String(it.salesNo) === String(salesNo) &&
          String(it.invtID || it.invtId) === String(invtID)
      );
      if (match) match.itemStatus = newItemStatus;
      return cloned;
    });

    const allDone = order.items
      .filter(it => (it.invtID || it.invtId) !== invtID)
      .every(it => it.itemStatus === newItemStatus);

    const payload = {
      saleshold: {
        salesNo,
        kdsStatus: allDone ? newItemStatus : undefined,
        siteID,
      },
      salesitemhold: [
        {
          salesNo,
          invtID,
          itemStatus: newItemStatus,
        },
      ],
    };
    if (!allDone) delete payload.saleshold.kdsStatus;

    fetch('https://app.masu.mn:8082/Integration/SetKDSOrderStatus', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', authorization: token },
      body: JSON.stringify(payload),
    }).catch(console.error);
  };

  const onOrderStatusChange = (order) => {
    const siteID = order.siteID || order.siteId;
    const salesNo = order.salesNo;
    const newKdsStatus = activeTab === 'ready' ? 1 : 2;

    const itemsWithInvtId = order.items?.filter(item => !!(item.invtID || item.invtId)) || [];
    if (itemsWithInvtId.length !== order.items.length) {
      alert('Зарим бараанд invtID байхгүй байна!');
      return;
    }

    setData(prev => {
      const cloned = structuredClone(prev);
      const holdKey = activeTab === 'doing' ? 'saleshold' : 'saleshold_statustwo';
      const orders = cloned[holdKey];
      const match = orders.find(it => String(it.salesNo) === String(salesNo));
      if (match) {
        match.kdsStatus = newKdsStatus;
        match.lastUpdateLocal = new Date().toISOString();
      }
      return cloned;
    });

    const payload = {
      saleshold: {
        salesNo,
        kdsStatus: newKdsStatus,
        siteID,
      },
      salesitemhold: itemsWithInvtId.map(item => ({
        salesNo,
        invtID: item.invtID || item.invtId,
        itemStatus: item.itemStatus,
      })),
    };

    fetch('https://app.masu.mn:8082/Integration/SetKDSOrderStatus', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', authorization: token },
      body: JSON.stringify(payload),
    })
      .then(() => {
        onSearch(searchParamsRef.current, { silent: true });
      })
      .catch(console.error);
  };

  let orders = [];
  if (activeTab === 'doing') {
    orders = (retdata.saleshold || [])
      .map(order => ({
        ...order,
        items: (retdata.salesitemhold || []).filter(
          item => String(item.salesNo) === String(order.salesNo)
        )
      }))
      .sort((a, b) => {
        const dateA = new Date(a.lastUpdateLocal || a.lastUpdate || a.createdDate);
        const dateB = new Date(b.lastUpdateLocal || b.lastUpdate || b.createdDate);
        return dateB - dateA;
      });
  } else if (activeTab === 'ready') {
    orders = (retdata.saleshold_statustwo || [])
      .map(order => ({
        ...order,
        items: (retdata.salesitemhold_statustwo || []).filter(
          item => String(item.salesNo) === String(order.salesNo)
        )
      }))
      .sort((a, b) => new Date(b.lastUpdateLocal) - new Date(a.lastUpdateLocal));
  }

  const filteredOrders = orders.filter(order => {
    const status = order.kdsStatus;
    if (activeTab === 'doing') {
      return status === 0 || status === 1;
    } else if (activeTab === 'ready') {
      return status === 2;
    }
    return false;
  });

  return (
    <div className="s_container_i">
      <Overlay loading={loading}>
        {error && <Error1 error={error} />}
        <SizeMe>
          {({ size }) => (
            <div className={`i_list_cont ${!siteId ? 'no-site' : ''}`} id="kds_list">
              <Header
                onSearch={onSearch}
                setError={setError}
                size={size}
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                kdsData={retdata}
              />

              {siteId && (
                <div className="table_scroll">
                  <div id="paging">
                    <List
                      orders={filteredOrders}
                      siteId={siteId}
                      activeTab={activeTab}
                      setActiveTab={setActiveTab}
                      onItemStatusChange={onItemStatusChange}
                      onOrderStatusChange={onOrderStatusChange}
                    />
                  </div>
                </div>
              )}
            </div>
          )}
        </SizeMe>
      </Overlay>
    </div>
  );
}
  