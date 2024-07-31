import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import { Date } from "../../../../components/Date";
import { Select } from "../../../../components/Select";
import { Input, MoneyInput } from "../../../Input";

export function Main(props) {
  const {
    setError,
    setEdited,
    balanceAmount,
    setBalanceAmount,
    salesAmount,
    setSalesAmount,
    cardAmount,
    setCardAmount,
    cardNumber,
    setCardNumber,
    beginDate,
    setBeginDate,
    endDate,
    setEndDate,
    status,
    setStatus,
    descr,
    setDescr,
  } = props;

  const { t } = useTranslation();
  const [states, setStates] = useState([
    { value: 1, label: "Идэвхтэй" },
    { value: 0, label: "Хүчингүй" },
  ]);
  useEffect(() => {
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
        { value: 0, label: "Хүчингүй" },
      ]);
    }
  };

  const cardAmountProps = {
    value: cardAmount,
    setValue: setCardAmount,
    label: t("giftCard.cardAmount"),
    placeholder: t("giftCard.cardAmount"),
    setError,
    setEdited,
    inRow: true,
    disabled: salesAmount?.value > 0 ? true : false,
  };

  const descrProps = {
    value: descr,
    setValue: setDescr,
    label: t("giftCard.descr"),
    placeholder: t("giftCard.descr"),
    setError,
    setEdited,
    inRow: true,
    length: 20,
  };

  const salesAmountProps = {
    value: salesAmount,
    setValue: setSalesAmount,
    label: t("giftCard.salesAmount"),
    placeholder: t("giftCard.salesAmount"),
    setError,
    setEdited,
    inRow: true,
    disabled: true,
  };

  const balanceAmountProps = {
    value: balanceAmount,
    setValue: setBalanceAmount,
    label: t("giftCard.balanceAmount"),
    placeholder: t("giftCard.balanceAmount"),
    setError,
    setEdited,
    inRow: true,
    disabled: true,
  };

  const cardNumberProps = {
    value: cardNumber,
    setValue: setCardNumber,
    label: t("giftCard.cardNumber"),
    placeholder: t("giftCard.cardNumber"),
    setError,
    length: 20,
    inRow: true,
    disabled: false,
  };

  const date1Props = {
    value: beginDate,
    setValue: onChangeDate1,
    label: t("giftCard.beginDate"),
    format: "yyyy.MM.DD",
    inRow: true,
  };

  const date2Props = {
    value: endDate,
    setValue: onChangeDate2,
    label: t("giftCard.endDate"),
    format: "yyyy.MM.DD",
    inRow: true,
  };

  const statProps = {
    value: status,
    setValue: onChangeStatus,
    data: states,
    s_value: "value",
    s_descr: "label",
    label: t("giftCard.status"),
    onFocus: onFocusStatus,
  };

  return (
    <div className="gift_main_back">
      <div className="gift_add_back">
        <div className="ac_row" style={{ marginTop: 20 }}>
          <Input {...cardNumberProps} />
          <div className="gap" />
          {<Input {...descrProps} />}
        </div>

        <div className="ac_row" style={{ marginTop: 20 }}>
          {<MoneyInput {...cardAmountProps} />}
          <div className="gap" />
          {<MoneyInput {...salesAmountProps} />}
          <div className="gap" />
          {<MoneyInput {...balanceAmountProps} />}
        </div>

        <div className="ac_row" style={{ marginTop: 20 }}>
          <Date {...date1Props} />
          <div className="gap" />
          <Date {...date2Props} />
        </div>

        <Select {...statProps} />
      </div>
    </div>
  );
}
