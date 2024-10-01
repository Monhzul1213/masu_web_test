import React from "react";
import { MdChevronLeft } from "react-icons/md";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { DescrInput, IconButton, Input, Select } from "../../../components/all";

export function MainInput(props) {
  const {
    setError,
    setEdited,
    templateName,
    vatPropertyId,
    cashPropertyId,
    setCashPropertyId,
    setVatPropertyId,
    setTemplateName,
    editable,
    loading,
    templateId,
    vatPropertys,
    cashPropertys,
  } = props;
  const { t } = useTranslation();
  const navigate = useNavigate();
  const onClickBack = (e) => {
    e?.preventDefault();
    navigate("/finance/template");
  };
  const idProps = {
    value: { value: templateId },
    setValue: () => {},
    label: t("transModel.number"),
    placeholder: t("transModel.number"),
    disabled: true,
    inRow: true,
  };
  const descrProps = {
    value: templateName,
    setValue: setTemplateName,
    label: t("transModel.title"),
    placeholder: t("transModel.title"),
    setEdited,
    setError,
    length: 100,
    disabled: !editable,
    inRow: true,
  };
  const backProps = {
    className: "ps_back_btn",
    text: t("transModel.backButton"),
    icon: <MdChevronLeft className="ps_back_icon" />,
    onClick: onClickBack,
  };
  const vatProps = {
    value: vatPropertyId,
    setValue: ({ value }) => {
      setVatPropertyId({ value });
    },
    label: t("transModel.vatSelect"),
    placeholder: t("transModel.vatSelect"),
    data: vatPropertys,
    setError,
    setEdited,
    s_value: "constKey",
    s_descr: "valueStr1",
    inRow: true,
    // onFocus: onFocusSite,
    loading,
    disabled: !editable,
  };
  const cashProps = {
    value: cashPropertyId,
    setValue: ({ value }) => {
      setCashPropertyId({ value });
    },
    label: t("transModel.cashSelect"),
    placeholder: t("transModel.cashSelect"),
    data: cashPropertys,
    setError,
    setEdited,
    s_value: "constKey",
    s_descr: "valueStr1",
    inRow: true,
    // onFocus: onFocusSite,
    loading,
    disabled: !editable,
  };

  return (
    <div className="ad_back">
      <div className="ps_menu_back">
        <IconButton {...backProps} />
      </div>
      <div className="ad_main">
        <div>
          <div style={{ marginTop: 0, width: "50%" }}>
            <Input {...idProps} />
          </div>
          <div className="gap" />
          <div style={{ marginTop: 0, width: "50%" }}>
            <DescrInput {...descrProps} />
          </div>
        </div>
        <div style={{ marginTop: "10px" }}>
          <div style={{ marginTop: 0, width: "50%" }}>
            <Select {...vatProps} />
          </div>
          <div className="gap" />
          <div style={{ flex: 1, width: "50%" }}>
            <Select {...cashProps} />
          </div>
        </div>
      </div>
    </div>
  );
}
