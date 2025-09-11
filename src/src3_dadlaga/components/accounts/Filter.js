import React from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from 'react-router-dom';
import { Button, ButtonRowAddConfirm } from "../../../components/all";

export function Filter(props) {
  const { size, onClickAdd, type, onOpenBalance } = props; 
  const { t } = useTranslation();
  const navigate = useNavigate();

  const onClickImport = () => navigate('acct_import');

  const id = size?.width > 870 ? "ih_large" : "ih_small";
  const addProps = { type, onClickAdd, show: false};
  const importProps = { className: 'ih_btn', text: t('page.import'), onClick: onClickImport };

  const openingBalanceProps = {
    className: 'ih_btn',
    text: t('account.openingBalance'),
  
    onClick: onOpenBalance ?? (() => navigate('opening-balance')),
  };

return (
  <div className="ih_header" style={{ marginTop: 5 }} id={id}>
    <ButtonRowAddConfirm {...addProps} />
    <span style={{ display: "inline-flex", gap: 6 }}>
      <Button {...importProps} />
      <Button {...openingBalanceProps} />
    </span>
    {/* <div className={classH}>
      <PlainRange {...dateProps} />
    </div> */}
  </div>
);
}
