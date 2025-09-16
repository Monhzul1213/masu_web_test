import React, { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import "../../css/qr.css";

export default function CustomerDetailsModal({ baseInfo, onSubmit, onClose }) {
  const { t } = useTranslation();
  const [phone, setPhone] = useState("");
  const [note, setNote] = useState("");
  const [phoneTouched, setPhoneTouched] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const phoneRef = useRef(null);

  const NOTE_LIMIT = 100;

  const isPhoneValid = /^\d{8}$/.test(phone);
  const showPhoneError = (phoneTouched || submitted) && !isPhoneValid;

  const handleSubmit = () => {
    setSubmitted(true);

    if (!isPhoneValid) {
      setPhone("");
      requestAnimationFrame(() => phoneRef.current?.focus());
      if (!phoneTouched) setPhoneTouched(true);
      return;
    }

    onSubmit({
      ...baseInfo,
      phone,
      note: (note || "").slice(0, NOTE_LIMIT).trim() || null,
    });
  };

  return (
    <div className="order_type_modal">
      <div className="modal_content vertical">
        <p className="product_section_title" style={{ marginBottom: 8 }}>
          {t("orderType.contact_info")}
        </p>

        <div className={`input_group ${showPhoneError ? "error" : (isPhoneValid ? "success" : "")}`}>
          <input
            ref={phoneRef}
            type="tel"
            inputMode="numeric"
            maxLength={8}
            placeholder={
              showPhoneError
                ? t("orderType.enter_phone") || "Утасны дугаар оруулна уу"
                : t("orderType.phone_placeholder") || "Утас (8 орон)"
            }
            value={phone}
            onChange={(e) => setPhone(e.target.value.replace(/[^\d]/g, ""))}
            onBlur={() => setPhoneTouched(true)}
          />
          {isPhoneValid && <div className="check_icon" />}
        </div>

        <div className="input_group">
          <textarea
            placeholder={t("orderType.note_placeholder") || "Нэмэлт мэдээлэл"}
            value={note}
            maxLength={NOTE_LIMIT}
            onChange={(e) => setNote((e.target.value || "").slice(0, NOTE_LIMIT))}
            aria-describedby="note-limit"
            rows={3}                 // ← 3 мөр
          />
          <div id="note-limit" style={{ fontSize: 12, marginTop: 6, opacity: 0.7, textAlign: "right" }}>
            {note.length}/{NOTE_LIMIT}
          </div>
        </div>

        <button className="submit_btn" onClick={handleSubmit}>
          {t("orderType.pay_now")}
        </button>

        <button className="close_btn" onClick={onClose} aria-label={t("orderType.close")}>
          ✕
        </button>
      </div>
    </div>
  );
}