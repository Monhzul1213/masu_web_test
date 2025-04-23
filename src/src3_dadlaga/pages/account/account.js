import { SizeMe } from "react-sizeme";
import { useTranslation } from "react-i18next";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  createSearchParams,
  useNavigate,
  useSearchParams,
} from "react-router-dom";

import "../../../css/order.css";
import "../../../css/invt.css";
import "../../css/tree.css";
import { getList } from "../../../services";
import { Filter } from "../../components/transactionModel";
import { AccountAddModal, AccountTree, List } from "../../components/accounts";
import { Empty1, Error1, Overlay } from "../../../components/all";
import { Subscription } from "../../../components/management/adjust/list";

export function Account() {
  const { t } = useTranslation();
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);
  const [searchParams] = useSearchParams();
  const [treeData, setTreeData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const { user, token } = useSelector((state) => state.login);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (user?.msRole?.webFinance !== "Y") navigate({ pathname: "/" });
    else {
      const classId = searchParams?.get("classId");
      let query = classId ? `?AcctClassID=${classId}` : "";
      onSearch(query);
    }
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onSearch = async (query) => {
    setError(null);
    setLoading(true);
    const response = await dispatch(
      getList(user, token, "Txn/GetAccount" + (query ?? ""))
    );
    if (response?.code === 1000) {
      setVisible(true);
    }
    if (response?.error) {
      setError(response?.error);
    } else {
      setData(response?.data?.acct);
      setTreeData(convertToTreeData(response?.data?.accclass));
    }

    setLoading(false);
  };

  function convertToTreeData(data) {
    const map = {};
    data.forEach((item) => {
      map[item.classId] = {
        key: item.classId,
        title: item.descr,
        children: [],
      };
    });
    const treeData = [];
    data.forEach((item) => {
      const node = map[item.classId];
      if (item.parentId === "-1") {
        treeData.push(node);
      } else if (map[item.parentId]) {
        map[item.parentId].children.push(node);
      }
    });
    return treeData;
  }

  const onNodeClick = (classId) => {
    if (classId === "0") {
      navigate({
        search: "",
      });
      onSearch();
      return;
    }
    navigate({
      search: createSearchParams({
        classId: classId,
      }).toString(),
    });
    onSearch(`?AcctClassID=${classId}`);
  };

  const onDone = async () => {
    setVisible(false);
  };
  const onClickAdd = () => {
    const classId = searchParams?.get("classId");
    if (classId) {
      setOpenModal(true);
      // navigate(`/finance/account/add?classId=${classId}`);
    } else {
      setError("Ангилаа сонгоно уу");
    }
  };

  const listProps = { data, onClickAdd, setOpenModal };
  const headerProps = { onClickAdd, setError, onSearch, type: "account" };
  const subProps = { visible, setVisible, onDone };
  const treeProps = { treeData, onNodeClick };
  const modalProps = { openModal, setOpenModal, onSearch };
  return (
    <div className="s_container_i">
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
              <div className="i_list_cont acc_list_cont" id="invt_list">
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
    </div>
  );
}
