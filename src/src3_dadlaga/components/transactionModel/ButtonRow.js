import React, { useState } from "react";
import { useTranslation } from "react-i18next";

import { Button, Confirm, DynamicBSIcon } from "../../../components/all";

export function ButtonRow(props) {
  const {
    onClickCancel,
    onClickSave,
    onClickEdit,
    onClickDelete,
    updatable,
    disabled = false,
    deletable = true,
  } = props;
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);

  const onDelete = () => setOpen(true);

  const confirm = async (sure) => {
    setOpen(false);
    if (sure) onClickDelete();
  };

  const confirmProps = { open, text: t("page.delete_confirm"), confirm };

  return (
    <div className="invt_btn_row" id="po_btns">
      {open && <Confirm {...confirmProps} />}
      {deletable && (
        <DynamicBSIcon
          className="a_btn_delete"
          name="BsTrash"
          onClick={onDelete}
        />
      )}
      <Button
        className="invt_btn"
        text={t(disabled ? "login.back" : "page.cancel")}
        onClick={onClickCancel}
      />
      {updatable && (
        <Button
          className="invt_btn"
          id="invt_btn_save"
          text="Өөрчлөлт хадгалах"
          onClick={onClickEdit}
        />
      )}
      {!disabled && (
        <Button
          className="invt_btn"
          id="invt_btn_save"
          text={t("page.save")}
          onClick={onClickSave}
        />
      )}
    </div>
  );
}
