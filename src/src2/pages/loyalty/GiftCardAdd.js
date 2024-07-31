import React, { useEffect, useState } from "react";
import { message } from "antd";
import { useTranslation } from "react-i18next";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";

import { getList, sendRequest } from "../../../services";
import {
  Error1,
  Overlay,
  Prompt,
  Confirm,
  ButtonRowConfirm,
} from "../../../components/all";
import { Main } from "../../components/loyalty/giftCard/add";

export function GiftCardAdd() {
  const { t } = useTranslation();
  const { user, token } = useSelector((state) => state.login);
  const [loading, setLoading] = useState(false);
  const [edited, setEdited] = useState(false);
  const [error, setError] = useState(null);
  const [saved, setSaved] = useState(false);
  const [selected, setSelected] = useState(null);
  const [open, setOpen] = useState(false);
  const [name, setName] = useState({ value: "" });
  const [balanceAmount, setBalanceAmount] = useState({ value: 0 });
  const [salesAmount, setSalesAmount] = useState({ value: 0 });
  const [cardAmount, setCardAmount] = useState({ value: 0 });
  const [cardNumber, setCardNumber] = useState();
  const [descr, setDescr] = useState({ value: "" });
  const [qty, setQty] = useState({ value: 0 });
  const [perc, setPerc] = useState({ value: 0 });
  const [status, setStatus] = useState({ value: 1 });
  const [type, setType] = useState({ value: 0 });
  const [beginDate, setBeginDate] = useState({ value: moment() });
  const [endDate, setEndDate] = useState({ value: moment() });
  const [number, setNumber] = useState({ value: "" });
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [controlDisable, setControlDisable] = useState(false);

  useEffect(() => {
    if (saved) onClickCancel();
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [saved]);

  useEffect(() => {
    user?.msRole?.webManageItem !== "Y"
      ? navigate({ pathname: "/" })
      : getData();
    return () => setEdited(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getData = async () => {
    let giftCardId = searchParams?.get("giftCardId");
    if (giftCardId || giftCardId === 0) {
      GetGiftCard(giftCardId);
      setControlDisable(true);
    }
  };

  const GetGiftCard = async (giftCardId) => {
    setError(null);
    setLoading(true);

    let api = "?giftCardID=" + giftCardId;
    let response = await dispatch(
      getList(user, token, "Sales/GetGiftCard" + api)
    );
    setLoading(false);
    if (response?.error) setError(response?.error);
    else {
      let giftcardData = response?.data && response?.data[0];
      setSelected(giftcardData);
      setCardNumber({ value: giftcardData?.cardNumber ?? "" });
      setBeginDate({ value: moment(giftcardData?.beginDate, "YYYY-MM-DD") });
      setEndDate({ value: moment(giftcardData?.endDate, "YYYY-MM-DD") });
      setStatus({ value: giftcardData?.status ?? 0 });
      setCardAmount({ value: giftcardData?.cardAmount ?? "" });
      setSalesAmount({ value: giftcardData?.salesAmount ?? "" });
      setBalanceAmount({
        value: giftcardData?.cardAmount - giftcardData?.salesAmount ?? "",
      });
      setDescr({ value: giftcardData?.descr });
    }
  };

  const onClickCancel = () => navigate({ pathname: "/loyalty/giftCard" });

  const validateData = () => {
    let data = "";
    data = selected
      ? {
          giftCardId: selected?.giftCardId,
          cardNumber: selected?.cardNumber,
          beginDate: moment(beginDate?.value).format("yyyy.MM.DD"),
          endDate: moment(endDate.value).format("yyyy.MM.DD"),
          status: status?.value,
          cardAmount: cardAmount?.value,
          salesAmount: salesAmount?.value,
          balanceAmount: balanceAmount?.value,
          descr: descr?.value,
          rowStatus: "U",
        }
      : {
          cardNumber: cardNumber?.value,
          beginDate: moment(beginDate?.value).format("yyyy.MM.DD"),
          endDate: moment(endDate.value).format("yyyy.MM.DD"),
          status: status?.value,
          cardAmount: cardAmount?.value,
          salesAmount: salesAmount?.value,
          balanceAmount: balanceAmount?.value,
          descr: descr?.value,
          rowStatus: "I",
        };
    return data;
  };

  const onClickSave = async () => {
    let data = validateData();
    if (data) {
      onLoad();
      const response = await dispatch(
        sendRequest(user, token, "Sales/ModGiftCard", data)
      );
      if (response?.error) onError(response?.error, true);
      else {
        onSuccess(t("giftCard.add_success"));
        navigate({ pathname: "/loyalty/giftCard" });
      }
    }
  };

  const onLoad = () => {
    setError(null);
    setLoading(true);
    setEdited(false);
  };

  const onError = (err, edited) => {
    setError(err);
    setEdited(edited);
    setLoading(false);
  };

  const onSuccess = (msg) => {
    if (msg) {
      message.success(msg);
      setSaved(true);
    }
    setLoading(false);
  };

  const confirm = (sure) => {
    setOpen(false);
    setError(null);
    // if(sure) setVisible(true);
  };

  let mainProps = {
    setError,
    setEdited,
    name,
    setName,
    balanceAmount,
    setBalanceAmount,
    qty,
    setQty,
    number,
    setNumber,
    perc,
    setPerc,
    beginDate,
    setBeginDate,
    endDate,
    setEndDate,
    status,
    setStatus,
    type,
    setType,
    controlDisable,
    salesAmount,
    setSalesAmount,
    cardAmount,
    setCardAmount,
    cardNumber,
    setCardNumber,
    descr,
    setDescr,
  };

  let btnProps = {
    onClickCancel,
    onClickSave,
    id: "vo_btn",
    show: false,
  };
  let confirmProps = {
    open,
    text: t("adjust.confirm_pay"),
    confirm,
    text1: error,
  };
  return (
    <Overlay className="i_container" loading={loading}>
      <Prompt edited={edited} />
      <Confirm {...confirmProps} />
      {error && <Error1 error={error} />}
      <div className="i_scroll">
        <Main {...mainProps} />
      </div>
      <ButtonRowConfirm {...btnProps} />
    </Overlay>
  );
}
