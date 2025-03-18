import React from "react";
import { MdChevronLeft } from "react-icons/md";
import { useTranslation } from "react-i18next";

import { IconButton, Input, Select } from "../../../components/all";

export function MainInput(props) {
  const {
    setError,
    setEdited,
    accountCode,
    setAccountCode,
    accountName,
    setAccountName,
    accountCurrency,
    setAccountCurrency,
    accountStatus,
    setAccountStatus,
    editable,
    loading,
    currency,
    typeDatas,
    // setIsDebit,
    // isDebit,
    setAccountType,
    accountType,
    setSiteId,
    siteId,
    siteDatas,
    onClickCancel,
    updatable,
  } = props;
  const { t } = useTranslation();

  const onClickBack = (e) => {
    e?.preventDefault();
    onClickCancel();
  };
  const acctName = {
    value: accountName,
    setValue: setAccountName,
    label: t("transModel.acctName"),
    placeholder: t("transModel.acctName"),
    inRow: true,
  };
  const acctCode = {
    value: accountCode,
    setValue: setAccountCode,
    label: t("account.acctCode"),
    placeholder: t("account.acctCode"),
    setEdited,
    setError,
    length: 100,
    disabled: updatable,
    inRow: true,
    type: "number",
  };
  const backProps = {
    className: "ps_back_btn",
    text: t("account.title"),
    icon: <MdChevronLeft className="ps_back_icon" />,
    onClick: onClickBack,
  };
  const currencyProps = {
    value: accountCurrency,
    setValue: ({ value }) => {
      setAccountCurrency({ value: value });
    },
    label: t("account.currency"),
    placeholder: t("account.currency"),
    data: currency,
    setError,
    setEdited,
    s_value: "constKey",
    s_descr: "valueStr1",
    inRow: true,
    // onFocus: onFocusSite,
    loading,
    disabled: !editable,
  };
  const statusProps = {
    value: accountStatus,
    setValue: ({ value }) => {
      setAccountStatus({ value: value });
    },
    label: t("account.status"),
    placeholder: t("account.status"),
    data: [
      { value: 1, descr: "Идэвхтэй" },
      { value: 0, descr: "Хүчингүй" },
    ],
    setError,
    setEdited,
    s_value: "value",
    s_descr: "descr",
    inRow: true,
    // onFocus: onFocusSite,
    loading,
    disabled: !editable,
  };
  const typeProps = {
    value: accountType,
    setValue: ({ value }) => {
      setAccountType({ value: value });
    },
    label: t("account.acctType"),
    placeholder: t("account.acctType"),
    data: typeDatas,
    setError,
    setEdited,
    s_value: "constKey",
    s_descr: "valueStr1",
    inRow: true,
    loading,
    disabled: !editable,
  };
  const siteProps = {
    value: siteId,
    setValue: ({ value }) => {
      setSiteId({ value: value });
    },
    label: t("shop.title"),
    placeholder: t("shop.title"),
    data: siteDatas,
    setError,
    setEdited,
    s_value: "siteId",
    s_descr: "name",
    inRow: true,
    loading,
    disabled: !editable,
  };
  return (
    <div className="ad_back">
      <div className="ps_menu_back">
        <IconButton {...backProps} />
      </div>
      <div className="ad_main">
        {/* <div className="ad_row"> */}
          <div style={{ marginTop: 0, flex: 1 }}>
            <Input {...acctCode} />
          </div>
          <div className="gap" />
          <Input {...acctName} />
        {/* </div> */}
        <div className="ad_row" style={{ marginTop: "10px" }}>
          <div style={{ marginTop: 0, flex: 1, width: "40%" }}>
            <Select {...currencyProps} />
          </div>
          <div className="gap" />
          <div style={{ flex: 1, width: "50%" }}>
            <Select {...statusProps} />
          </div>
        </div>
        <div className="ad_row" style={{ marginTop: "10px" }}>
          <div style={{ marginTop: 0, flex: 1, width: "40%" }}>
            <Select {...typeProps} />
          </div>
          <div className="gap" />
          <div style={{ flex: 1, width: "50%" }}>
            <Select {...siteProps} />
          </div>
        </div>
        {/* <div className="ad_row">
          <CheckBox label="Дэбит" checked={isDebit} setChecked={setIsDebit} />
          <div className="gap" />
          <CheckBox
            label="Кредит"
            checked={!isDebit}
            setChecked={(checked) => setIsDebit(!checked)}
          />
        </div> */}
      </div>
    </div>
  );
}
