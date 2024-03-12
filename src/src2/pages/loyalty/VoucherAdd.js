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
import {
  Main,
  CardService,
} from "../../components/loyalty/vaucher/add";

export function VoucherAdd() {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [edited, setEdited] = useState(false);
  const [error, setError] = useState(null);
  const [saved, setSaved] = useState(false);
  const [selected, setSelected] = useState(null);
  const [open, setOpen] = useState(false);
  const [name, setName] = useState({ value: "" });
  const [price, setPrice] = useState({ value: 0 });
  const [qty, setQty] = useState({ value: 0 });
  const [perc, setPerc] = useState({ value: 0 });
  const [status, setStatus] = useState({ value: 1 });
  const [type, setType] = useState({ value: 0 });
  const [beginDate, setBeginDate] = useState({ value: moment() });
  const [endDate, setEndDate] = useState({ value: moment() });
  const [number, setNumber] = useState({ value: '' });
  const [kits, setKits] = useState([]);
  const [dkits, setDKits] = useState([]);
  const [item, setItem] = useState(null);
  const [searchI, setSearchI] = useState({ value: null });
  const { user, token } = useSelector((state) => state.login);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [controlDisable, setControlDisable] = useState(false);
  const [consumer, setConsumer] = useState([]);

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
    let voucherId = searchParams?.get("voucherId");
    if (voucherId || voucherId === 0) {Getvoucher(voucherId);
      setControlDisable(true)
    }
  };

  const Getvoucher = async (voucherId) => {
    setError(null);
    setLoading(true);
    let api = "?voucherId=" + voucherId;
    let response = await dispatch(
      getList(user, token, "Site/GetVoucher" + api)
    );
    console.log("response", response);
    setLoading(false);
    if (response?.error) setError(response?.error);
    else {
      let voucher = response?.data?.voucher && response?.data?.voucher[0] ;
      setKits(response?.data?.voucherconsumer);
      setSelected(voucher);
      setItem(response?.data);
      setName({ value: voucher?.name ?? "" });
      setPrice({ value: voucher?.voucherAmount ?? "" });
      setPerc({ value: voucher?.voucherValue ?? "" });
      setBeginDate({ value: moment(voucher?.beginDate, "YYYY-MM-DD") });
      setEndDate({ value: moment(voucher?.endDate, "YYYY-MM-DD") });
      setStatus({ value: voucher?.status ?? 0 });
      setNumber({ value: voucher?.voucherCount });

      response?.data?.voucherconsumer?.forEach(item => {
        item.firstName = item?.consumerName
        item.age = item?.consumerAge
      })
      setConsumer(response?.data?.voucherconsumer)
    }
  };
  const onClickCancel = () => navigate({ pathname: "/loyalty/voucher" });

  const validateData = () => {
    let consumers = []
    if (name?.value?.trim() && number?.value && price?.value > 0) {
      let data = "";
      if(consumer?.length <= number?.value){
        consumer?.forEach(item => {
          consumers.push({consumerID: item?.consumerId, voucherID: selected ? selected?.voucherId : -1, status: item?.status});
        });
        // dconsumer?.forEach(it => couponConsumers?.push({...it, rowStatus: 'D'}));
      } else {
        setSearchI({ value: searchI?.value, error: t('voucher.number_max') });
        return false;
      }

        data = selected
          ? {
              voucherID: selected?.voucherId,
              name: name?.value,
              beginDate: moment(beginDate?.value).format("yyyy.MM.DD"),
              endDate: moment(endDate.value).format("yyyy.MM.DD"),
              status: status?.value,
              voucherCount: number?.value,
              voucherAmount: price?.value,
              rowStatus: "U",
              consumers,
            }
          : {
              name: name?.value,
              beginDate: moment(beginDate?.value).format("yyyy.MM.DD"),
              endDate: moment(endDate.value).format("yyyy.MM.DD"),
              status: status?.value,
              voucherCount: number?.value,
              voucherAmount: price?.value,
              rowStatus: "I",
              consumers,
            };
      return data;
    } else {
      if (!name?.value?.trim())
      if(!name?.value?.trim()) setName({ value: '', error: t('error.not_empty') });
      if(!number?.value) setNumber({ value: '', error: t('error.not_empty') });

      // if(qty?.value < 1) setQty({ value: '', error: t('error.not_empty') });
      if(price?.value < 1) setPrice({ value: '', error: t('0 байж болохгүй') });
    }
  };

  const onClickSave = async () => {
    let data = validateData();
    if(data){
        onLoad();
        const response = await dispatch(sendRequest(user, token, 'Site/ModVoucher', data));
        if(response?.error) onError(response?.error, true);
        else onSuccess(t('coupon.already_added'));
    }
  };

  const onClickDelete = async () => {
    onLoad();
    let data = {
      voucherID: selected?.voucherId,
      name: selected?.name,
      voucherCount: selected?.voucherCount,
      beginDate: selected?.beginDate,
      endDate: selected?.endDate,
      status: selected?.status,
      consumerAge : selected.consumerAge,
      voucherAmount: selected?.voucherAmount,
      rowStatus: "D",
      consumers: []
    };
    const response = await dispatch(
      sendRequest(user, token, "Site/ModVoucher", data)
    );
    if (response?.error) onError(response?.error, true);
    else onSuccess(t("voucher.delete_success"), true);
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
    price,
    setPrice,
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
    controlDisable
  };
  let btnProps = {
    onClickCancel,
    onClickSave,
    onClickDelete,
    id: "co_btn",
    show: false,
  };
  let confirmProps = {
    open,
    text: t("adjust.confirm_pay"),
    confirm,
    text1: error,
  };

  const serviceProps = {
        number,
        data: consumer,
        setData: setConsumer,
        setError,
        setEdited,
        setDKits,
        search: searchI,
        setSearch: setSearchI,
  };

  return (
    <Overlay className="i_container" loading={loading}>
      <Prompt edited={edited} />
      <Confirm {...confirmProps} />
      {error && <Error1 error={error} />}
      <div className="i_scroll">
        <Main {...mainProps} />
        <CardService {...serviceProps} />
      </div>
      <ButtonRowConfirm {...btnProps} />
    </Overlay>
  );
}
