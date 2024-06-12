import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import { Date } from "../../../../../components/all";
import { Select } from "../../../../components/Select";
import { Input, MoneyInput } from "../../../../../src1/components/all/all_m";
import { getConstants } from "../../../../../services";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { VoucherImage } from "./image";

export function Main(props) {
  const {
    setError,
    setEdited,
    name,
    setName,
    price,
    setPrice,
    beginDate,
    setBeginDate,
    endDate,
    setEndDate,
    status,
    setStatus,
    number,
    setNumber,
    controlDisable,
    color,
    setColor,
  } = props;

  const dispatch = useDispatch();
  const { t } = useTranslation();
  const [states, setStates] = useState([{ value: 1, label: "Идэвхитэй" }]);
  const { user, token } = useSelector((state) => state.login);
  const [colorData, setColorData] = useState([]);
  useEffect(() => {
    getColor();
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getColor = async () => {
    const responseColor = await dispatch(
      getConstants(user, token, "msVoucher_Color")
    );

    setColorData(responseColor?.data?.sort((a,b)=> a.valueNum - b.valueNum));
  };

  const onChangeDate1 = (value) => {
    setBeginDate(value);
  };

  const onChangeDate2 = (value) => {
    setEndDate(value);
  };

  const onChangeStatus = (value) => {
    setStatus(value);
  };

  const onFocusStatus = async () => {
    if (!states?.length || states?.length === 1) {
      setStates([
        { value: 1, label: "Идэвхтэй" },
        { value: 0, label: "Идэвхгүй" },
      ]);
    }
  };

  const changeNumber = (value) => {
    let text = value?.value?.replace(/[^0-9]/g, "");
    if (isNaN(text)) setNumber({ ...value, error: "must_number" });
    else setNumber({ value: text });
  };

  const amtProps = {
    value: price,
    setValue: setPrice,
    label: t("voucher.voucherAmt"),
    placeholder: t("voucher.voucherAmt"),
    setError,
    setEdited,
    disabled: controlDisable,
  };
  const nameProps = {
    value: name,
    setValue: setName,
    label: t("page.name"),
    placeholder: t("page.name"),
    setError,
    length: 100,
    inRow: true,
    disabled: controlDisable,
  };
  const date1Props = {
    value: beginDate,
    setValue: onChangeDate1,
    label: t("voucher.beginDate"),
    inRow: true,
  };
  const date2Props = {
    value: endDate,
    setValue: onChangeDate2,
    label: t("voucher.endDate"),
    inRow: true,
  };
  const statProps = {
    value: status,
    setValue: onChangeStatus,
    data: states,
    s_value: "value",
    s_descr: "label",
    label: t("order.status"),
    onFocus: onFocusStatus,
  };
  const numberProps = {
    value: number,
    setValue: changeNumber,
    label: t("voucher.voucherQty"),
    placeholder: t("voucher.voucherQty"),
    setEdited,
    setError,
    length: 100,
    inRow: true,
  };
  const colorProps = {
    value: color,
    setValue: setColor,
    label: t("voucher.color"),
    placeholder: t("voucher.color"),
    setError,
    length: 100,
    inRow: true,
    data: colorData,
    s_value: "constKey",
    s_descr: "valueStr1",
    itemBackgroundColor: true,
  };

  return (
    <div className="vou_main_back">
      <div className="vou_add_back">
        <Input {...nameProps} />
        <div className="ac_row" style={{ marginTop: 20 }}>
          <Input {...numberProps} />
          <div className="gap" />
          <Select {...colorProps} />
        </div>

        {<MoneyInput {...amtProps} />}
        <div className="ac_row" style={{ marginTop: 20 }}>
          <Date {...date1Props} />
          <div className="gap" />
          <Date {...date2Props} />
        </div>
        <Select {...statProps} />
      </div>
      <div className="vou_main">
        <VoucherImage
          color={color}
          name={name}
          price={price}
          beginDate={beginDate}
          endDate={endDate}
          status={status}
          number={number}
          user={user?.msMerchant?.descr}
        />
      </div>
    </div>
  );
}
