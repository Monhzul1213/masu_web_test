import React, { useState, useEffect } from "react";
import { Modal } from "antd";
import { useTranslation } from "react-i18next";

import { ButtonRow, Overlay } from "../../../src1/components/all/all_m";
import { List } from "./List";
import moment from "moment";
import { Main } from "./Main";
import { useDispatch, useSelector } from "react-redux";
import { sendRequest } from "../../../services";
import { message } from "antd";

export function OrderCreateModal(props) {
  const dispatch = useDispatch();
  const { user, token } = useSelector((state) => state.login);
  const { visible, closeModal, setVisible } = props;
  const { t } = useTranslation();
  const [data, setData] = useState([]);
  const [orderTotalAmt, setOrderTotalAmt] = useState({ value: 0 });
  const [loading, setLoading] = useState(false);
  const [checked, setChecked] = useState(true);
  const [search, setSearch] = useState({ value: null });
  const [selected, setSelected] = useState(null);
  // const [invtID, setInvtID] = useState({ value: null });
  const [beginDate, setBeginDate] = useState({ value: moment() });
  const [error, setError] = useState(null);
  const [sites, setSites] = useState({ value: "" });
  const [custs, setCusts] = useState({ value: "" });
  // const [saved, setSaved] = useState(false);

  useEffect(() => {
    let sumAmt = 0;
    data?.forEach((el, index) => {
      sumAmt += el?.amount;
    });
    setOrderTotalAmt({ value: sumAmt });
  }, [data]);

  const validateData = () => {
    let dataValid = "";
    dataValid = !selected && {
      siteID: sites?.value,
      salesDate: moment(beginDate?.value).format("yyyy.MM.DD"),
      cashierCode: user?.merchantId,
      custID: custs?.value,
      totalAmount: orderTotalAmt?.value,
      salesitemholds: data,
    };
    if (!sites?.value) {
      setSites({ value: "", error: t(" хоосон байж болохгүй") });
    }
    return dataValid;
  };

  const onClickSave = async () => {
    let data = validateData();
    if (data) {
      onLoad();
      const response = await dispatch(
        sendRequest(user, token, "Sales/NewSalesHold", data)
      );
      if (response?.error) onError(response?.error, true);
      else {
        setVisible(false);
        onSuccess(t("orderCreate.add_success"));
      }
    }
  };
  const btnProps = { onClickCancel: () => closeModal(), onClickSave };

  const onLoad = () => {
    setError(null);
    setLoading(true);
  };

  const onError = (err, edited) => {
    setError(err);
    setLoading(false);
  };

  const onSuccess = (msg) => {
    if (msg) {
      message.success(msg);
      // setSaved(true);
    }
    setLoading(false);
  };

  const listProps = {
    checked,
    setChecked,
    data,
    setData,
    beginDate,
    search,
    setSearch,
    orderTotalAmt,
    setOrderTotalAmt,
    // itemSum,
  };
  const mainProps = {
    beginDate,
    setBeginDate,
    orderTotalAmt,
    setOrderTotalAmt,
    sites,
    setSites,
    custs,
    setCusts,
    error, setSelected
  };

  return (
    <Modal
      title={null}
      footer={null}
      closable={false}
      open={visible}
      centered={true}
      width={600}
    >
      <Overlay loading={loading}>
        <div
          style={{
            paddingLeft: 20,
            paddingTop: 10,
            fontSize: 18,
            fontWeight: "bold",
          }}
        >
          <p className="es_title">{"Захиалга үүсгэх"}</p>
        </div>

        <div className="m_back">
          <Main {...mainProps} />
          <List {...listProps} />
        </div>
        <ButtonRow {...btnProps} />
      </Overlay>
    </Modal>
  );
}
