import React from "react";
import { DatePicker } from "antd";
import moment from "moment";
import { useTranslation } from "react-i18next";

export function Filter2({ value, onChange, size }) {
  const { t } = useTranslation();
  const id = size?.width > 1080 ? "ih_large2" : "ih_small";

  return (
    <div
      className="ih_header"
      id={id}
      style={{ paddingTop: 0, marginBottom: 6, display: "flex", alignItems: "center" }}
    >
      <span style={{ fontWeight: 500, marginRight: 8 }}>
        {t("account.dateOpening")}
      </span>
      <DatePicker
        value={value || moment()}
        onChange={onChange}
        allowClear={false}
        style={{ width: 180 }}
        format="YYYY.MM.DD"
      />
    </div>
  );
}
