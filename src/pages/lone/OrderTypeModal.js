import React, { useState } from "react";
import "../../css/qr.css";

export default function OrderTypeModal({ onSelect, onClose }) {
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
      console.error("EBARIMT API error:", err);
      setCompanyName("");
      setIsValidReg(false);
    }
  };

  const handleSubmit = () => {
    if (selected === "business" && (!regNo || !companyName)) {
      alert("Бүх талбарыг бөглөнө үү");
      return;
    }

    const customerInfo =
      selected === "business"
        ? {
            type: "business",
            regNo,
            companyName,
          }
        : {
            type: "individual",
          };

    onSelect(customerInfo);
  };

  return (
    <div className="order_type_modal">
      <div className="modal_content vertical">
        <div className="type_buttons">
  <button
    className={`option_btn ${selected === "business" ? "active" : ""}`}
    onClick={() => setSelected("business")}
  >
    <div className="icon business" />
    <span>Аж ахуйн НЭГЖ</span>
  </button>

  <button
    className={`option_btn ${selected === "individual" ? "active" : ""}`}
    onClick={() => {
  setSelected("individual");
  onSelect({
    type: "individual",
  });
}}

  >
    <div className="icon individual" />
    <span>Хувь хүн</span>
  </button>
</div>

{selected === "business" && (
  <>
    <div className={`input_group ${isValidReg ? "success" : ""}`}>
      <input
        type="text"
        placeholder="Аж ахуйн нэгжийн регистерийн дугаар"
        value={regNo}
        onChange={(e) => {
          const val = e.target.value;
          setRegNo(val);
          setIsValidReg(false);
          if (val.length >= 7) {
            fetchCompanyName(val);
          }
        }}
      />
      {isValidReg && <div className="check_icon" />}
    </div>

    <div className="input_group">
      <input
        type="text"
        placeholder="Компанийн нэр"
        value={companyName}
        onChange={(e) => setCompanyName(e.target.value)}
      />
    </div>

    <button className="submit_btn" onClick={handleSubmit}>
      Төлбөр төлөх
    </button>
  </>
)}

        <button className="close_btn" onClick={onClose}>
          ✕
        </button>
      </div>
    </div>
  );
}
