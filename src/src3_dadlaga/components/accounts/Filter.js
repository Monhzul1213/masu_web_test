import React from "react";
import { useTranslation } from "react-i18next";
// import moment from "moment";
import { useNavigate } from 'react-router-dom';
import { Button, ButtonRowAddConfirm } from "../../../components/all";

export function Filter(props) {
  const { size, onClickAdd, type } = props;
  
   const { t } = useTranslation();
   const navigate = useNavigate();

  
  const onClickImport = () => navigate('acct_import');
  const id = size?.width > 870 ? "ih_large" : "ih_small";
  const addProps = { type, onClickAdd, show: false };
  const importProps =  { className: 'ih_btn', text: t('page.import'), onClick: onClickImport };
  

  return (
    <div className="ih_header" style={{ marginTop: 5 }} id={id}>
      <ButtonRowAddConfirm {...addProps} />
      <Button  {...importProps}             />
      {/* <div className={classH}>
        <PlainRange {...dateProps} />
      </div> */}
    </div>
  );
}
