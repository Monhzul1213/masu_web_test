import React, { useState } from "react";
import { EditableCell, EditableCellInput } from "./EditableCell";
import { Check } from "../../../components/all";
import { IoIosAddCircle } from "react-icons/io";

export const DetailAdd = ({ addDetail }) => {
  const [templateDtl, setTemplateDtl] = useState({
    acct: "",
    acctName: "",
    sub: "",
    isDebit: 0,
    formula: "",
  });
  const handleTemplateDtl = (name, value) => {
    setTemplateDtl((prev) => ({ ...prev, [name]: value }));
  };
  const handleClick = () => {
    addDetail(templateDtl);
    setTemplateDtl({
      acct: "",
      acctName: "",
      sub: "",
      isDebit: 0,
      formula: "",
    });
  };
  return (
    <div
      style={{
        display: "flex",
        margin: "15px 0",
        overflow: "scroll",
        width: "930px",
      }}
    >
      <EditableCell
        placeholder="Дансны дугаар"
        value={templateDtl?.acct}
        handleChange={(value) => {
          handleTemplateDtl("acct", value);
        }}
      />
      <div style={{ width: "3%" }} />
      <EditableCellInput
        placeholder="Дансны нэр"
        value={templateDtl?.acctName}
        handleChange={(value) => {
          handleTemplateDtl("acctName", value);
        }}
      />
      <div style={{ width: "68px" }} />
      <Check
        checked={templateDtl.isDebit === 1}
        // disabled={false}
        onClick={() => {
          templateDtl.isDebit === 0
            ? setTemplateDtl((prev) => ({ ...prev, isDebit: 1 }))
            : setTemplateDtl((prev) => ({ ...prev, isDebit: 0 }));
        }}
      />
      <div style={{ width: "30px" }} />
      <EditableCellInput
        placeholder="Томьёо"
        value={templateDtl?.formula}
        handleChange={(value) => {
          handleTemplateDtl("formula", value);
        }}
      />
      <div style={{ width: "95px" }} />
      <IoIosAddCircle
        size={25}
        color="#4BAF4F"
        name="BsTrashFill"
        className="ac_delete"
        onClick={handleClick}
      />
    </div>
  );
};
