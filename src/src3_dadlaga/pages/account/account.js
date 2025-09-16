import { SizeMe } from "react-sizeme";
import { useTranslation } from "react-i18next";
import React, { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  createSearchParams,
  useNavigate,
} from "react-router-dom";

import "../../../css/order.css";
import "../../../css/invt.css";
import "../../css/tree.css";
import { getList } from "../../../services";
import { Filter } from "../../components/accounts/Filter";
import { AccountAddModal, AccountTree, List } from "../../components/accounts";
import { Empty1, Error1, Overlay } from "../../../components/all";
import { Subscription } from "../../../components/management/adjust/list";
import { OpeningBalanceModal } from "../../components/accounts/OpeningBalanceModal";

export function Account() {
  const { t } = useTranslation();
  const [data, setData] = useState([]);          
  const [allAcct, setAllAcct] = useState([]);  
  const [error, setError] = useState(null);
  const [treeData, setTreeData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = useState(false);
  const [openModal, setOpenModal] = useState(false);           
  const [openBalanceModal, setOpenBalanceModal] = useState(false);
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

  const convertToTreeData = (arr = []) => {
    if (!Array.isArray(arr)) return [];
    const map = {};
    arr.forEach((item) => {
      map[item.classId] = {
        key: String(item.classId),
        title: item.descr,
        children: [],
      };
    });
    const out = [];
    arr.forEach((item) => {
      const node = map[item.classId];
      if (item.parentId === "-1") out.push(node);
      else if (map[item.parentId]) map[item.parentId].children.push(node);
    });
    return out;
  };

  const buildKeyMap = useMemo(() => {
    return (nodes = []) => {
      const map = {};
      const walk = (n) => {
        if (!n) return;
        const k = String(n.key);
        map[k] = n;
        if (Array.isArray(n.children)) n.children.forEach(walk);
      };
      nodes.forEach(walk);
      return map;
    };
  }, []);

  const collectDescendantKeys = (rootKey, keyMap) => {
    const res = [];
    const seen = new Set();
    const dfs = (k) => {
      if (!k || seen.has(k)) return;
      seen.add(k);
      const node = keyMap[k];
      if (!node) return;
      res.push(k);
      if (Array.isArray(node.children)) {
        node.children.forEach((c) => dfs(String(c.key)));
      }
    };
    dfs(String(rootKey));
    return res;
  };
 
  useEffect(() => {
    if (user?.msRole?.webFinance !== "Y") {
      navigate({ pathname: "/" });
    } else {
      fetchAccounts();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchAccounts = async (query = "") => {
    setError(null);
    setLoading(true);
    setRequestTime(new Date()); // илгээсэн цаг тэмдэглэх

    const response = await dispatch(getList(user, token, "Txn/GetAccount" + (query ?? "")));

    if (response?.code === 1000) setVisible(true);

    if (response?.error) {
      setError(response?.error);
    } else if (response?.data) {
      const acct = response?.data?.acct ?? [];
      const classes = response?.data?.accclass ?? [];
      setData(acct);
      setTreeData(convertToTreeData(classes));

      if (!query) setAllAcct(acct);
    }
    setLoading(false);
    setResponseTime(new Date()); // авсан цаг тэмдэглэх
  };

  const onNodeClick = (classId) => {
    if (classId === "0") {
      navigate({ search: "" });
      setData(allAcct);
      return;
    }

    navigate({ search: createSearchParams({ classId }).toString() });

    const keyMap = buildKeyMap(treeData);
    const idsArr = collectDescendantKeys(String(classId), keyMap);
    const idSet = new Set(idsArr);

    const pickRowClassId = (row) =>
      String(
        row?.acctClassId ??
        row?.acctClassID ??
        row?.classId ??
        row?.ClassId ??
        row?.classid ??
        ""
      );

    if (allAcct?.length) {
      const filtered = allAcct.filter((row) => idSet.has(pickRowClassId(row)));
      setData(filtered);
      return;
    }

    const params = new URLSearchParams();
    params.set("AcctClassID", idsArr.join(","));
    params.set("includeChildren", "Y");
    fetchAccounts(`?${params.toString()}`);
  };

  const onDone = async () => setVisible(false);
  const onClickAdd = () => setOpenModal(true);

  const listProps = { data, onClickAdd, setOpenModal };
  const headerProps = {
    onClickAdd,
    setError,
    onSearch: fetchAccounts,
    type: "account",

    onOpenBalance: () => setOpenBalanceModal(true),
  };
  const subProps = { visible, setVisible, onDone };
  const treeProps = { treeData, onNodeClick };
  const modalProps = { openModal, setOpenModal, onSearch: fetchAccounts };

  return (
    <div className="s_container_i" style={{ maxWidth, display: 'flex', flexFlow: 'row' }}>
      {visible && <Subscription {...subProps} />}
      <Overlay loading={loading}>
        {error && <Error1 error={error} />}
        <SizeMe>
          {({ size }) => (
            <section className="a_cont">
              <div className="a_tree_cont">
                <div className="a_tree_header">
                  <h2 className="a_acctTitle">{t("account.acctClass")}</h2>
                </div>
                <AccountTree {...treeProps} />
              </div>
              <div className="i_list_cont acc_list_cont" id="acct_list">
                <Filter {...headerProps} size={size} />
                {!data?.length ? (
                  <Empty1 icon="MdOutlineArticle" />
                ) : (
                  <List {...listProps} size={size} />
                )}
              </div>
            </section>
          )}
        </SizeMe>
      </Overlay>

      <AccountAddModal {...modalProps} />

      <OpeningBalanceModal
        open={openBalanceModal}
        onClose={() => setOpenBalanceModal(false)}
      />
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
