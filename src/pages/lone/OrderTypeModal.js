import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import "../../css/qr.css";

export default function OrderTypeModal({ onSelect, onClose }) {
  const { t } = useTranslation();
  const [selected, setSelected] = useState(null);
  const [regNo, setRegNo] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [isValidReg, setIsValidReg] = useState(false);

  const fetchCompanyName = async (reg) => {
    if (!reg || reg.length < 7) return;

    try {
      const res = await fetch(
        `https://info.ebarimt.mn/rest/merchant/info?regno=${reg}`
      );
      const data = await res.json();
      if (data?.name) {
        setCompanyName(data.name);
        setIsValidReg(true);
      } else {
        setCompanyName("");
        setIsValidReg(false);
      }
    } catch (err) {
      setCompanyName("");
      setIsValidReg(false);
    }
  };

  const handleSubmit = () => {
    if (selected === "business" && (!regNo || !companyName)) {
      alert(t("orderType.fill_all_fields"));
      return;
    }

    const customerInfo =
      selected === "business"
        ? { type: "business", regNo, companyName }
        : { type: "individual" };

    onSelect(customerInfo);
  };

  return (
    <div className="order_type_modal">
      <div className="modal_content vertical">
        <div className="type_buttons">
          <button
            className={`option_btn ${selected === "business" ? "active" : ""}`}
            onClick={() => {
              setSelected("business");
            }}
            aria-label={t("orderType.business")}
          >
            <div className="icon business" />
            <span>{t("orderType.business")}</span>
          </button>

          <button
            className={`option_btn ${selected === "individual" ? "active" : ""}`}
            onClick={() => {
              setSelected("individual");
              onSelect({ type: "individual" });
            }}
            aria-label={t("orderType.individual")}
          >
            <div className="icon individual" />
            <span>{t("orderType.individual")}</span>
          </button>
        </div>

        {selected === "business" && (
          <>
            <div className={`input_group ${isValidReg ? "success" : ""}`}>
              <input
                type="text"
                placeholder={t("orderType.reg_placeholder")}
                value={regNo}
                onChange={(e) => {
                  const val = e.target.value.toUpperCase().trim();
                  setRegNo(val);
                  setIsValidReg(false);
                  if (val.length >= 7) fetchCompanyName(val);
                }}
              />
              {isValidReg && <div className="check_icon" />}
            </div>

            <div className="input_group">
              <input
                type="text"
                placeholder={t("orderType.company_placeholder")}
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
              />
            </div>

            <button className="submit_btn" onClick={handleSubmit}>
              {t("orderType.pay_now")}
            </button>
          </>
        )}

        <button className="close_btn" onClick={onClose} aria-label={t("orderType.close")}>
          ✕
        </button>
      </div>
    </div>
  );
}
