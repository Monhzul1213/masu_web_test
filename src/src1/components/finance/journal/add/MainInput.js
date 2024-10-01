import React, { useEffect, useState } from "react";
import { MdChevronLeft } from "react-icons/md";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { Date, DescrInput, IconButton, Input, MoneyInput, Select } from "../../../../../components/all";
import { getList } from "../../../../../services";

export function MainInput(props) {
  const { setError, setEdited, price, setPrice, descr,  setDescr, source, setSource, setCustomer , customer,
          date, setDate, template, setTemplate, setLoading, status, setStatus, setDetail } = props;
  const [states, setStates] = useState([{ value: 0, label: "Үүсгэсэн" }]);
  const [templates, setTemplates] = useState([]);
  const [custs, setCusts] = useState([]);
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user, token } = useSelector((state) => state.login);

  useEffect(() => {
    onFocusCust();
    onFocusTemplate();
    onFocusStatus();
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onClickBack = (e) => {
    e?.preventDefault();
    navigate("/finance/journal");
  };

  const onFocusStatus = async () => {
    if (!states?.length || states?.length === 1) {
      setStates([
        { value: 0, label: "Үүсгэсэн" },
        { value: 1, label: "Баталсан" },
      ]);
    }
  };

  const onFocusCust = async () => {
    if(!custs?.length){
      setError && setError(null);
      setLoading('custs');
      let headers = {CustID: -1}
      const response = await dispatch(getList(user, token, 'Site/GetCustomer', null, headers));
      if(response?.error) setError && setError(response?.error);
      else {
        setCusts(response?.data?.customers);
      }
      setLoading(false);
    }
  }

  const onFocusTemplate = async () => {
    if(!templates?.length){
    setError && setError(null);
    setLoading('custs');
    const response = await dispatch(getList(user, token, "Txn/GetTemplate"));
    if(response?.error) setError(response?.error)
    else setTemplates(response?.data?.template)
    setLoading(false);
    }
  };

  const onChangeTemplate = async (value) => {
    setTemplate(value)
    const response = await dispatch(getList(user, token, "Txn/GetTemplate?TemplateId=" + value?.value));
    if(response?.error) setError(response?.error)
    else {
      response?.data?.templateitem?.forEach(item=> {
        // item.acct = item?.acct
        item.itemDescr = item?.itemDescr ?? ""
        item.crAmt = item?.crAmt ?? 0
        item.drAmt = item?.drAmt ?? 0
      })
      setDetail(response?.data?.templateitem)
    } 
  };

  const descrProps = { value: descr, setValue: setDescr, label: t("shop.descr"), placeholder: t("shop.descr"), 
                       setEdited, setError, length: 100, inRow: true};
  const backProps = { className: "ps_back_btn", text: t("journal.backButton"), icon: <MdChevronLeft className="ps_back_icon" />, 
                      onClick: onClickBack };
  const dateProps = { value: date, setValue: setDate, label: t('count.date'), placeholder: t('count.date'), 
                      inRow: true, className: 'c_date' };
  const totalProps = { value: price, setValue: setPrice, label: t('discount.amount'), placeholder: t('discount.amount'), 
                       setEdited, setError, inRow: true };
  const sourceProps = { value: source, setValue: setSource, label: t('manage.t_no'), placeholder: t('manage.t_no'), 
                        setError, setEdited, inRow: true, disabled: true, inRow1: true};
  const custProps = { value: customer, setValue: setCustomer, data: custs, s_value: "custId", s_descr: "custName", 
                      label: t("customer.title"), placeholder: t("customer.title"), onFocus: onFocusCust, inRow: true };
  const statusProps = { value: status, setValue: setStatus, data: states, s_value: "value", s_descr: "label", 
                      label: t("order.status"), placeholder: t("order.status"), onFocus: onFocusStatus, inRow: true, inRow1: true };
  const templateProps = { value: template, setValue: onChangeTemplate, data: templates, s_value: "templateId", s_descr: "templateName", 
                          label: t("transModel.title"), placeholder: t("transModel.title"), onFocus: onFocusTemplate, inRow: true };

  return (
    <div className="ad_back">
      <div className="ps_menu_back">
        <IconButton {...backProps} />
      </div>
      <div className="ad_main">
        <div className='ad_row'>
          <div style={{marginTop: 0, flex: 1}}><Date {...dateProps} /></div>
          <div className='gap' />
          <MoneyInput {...totalProps}/>
          <div className='gap' />
          <Select {...custProps}/>
        </div>
        <div className='ad_row' style={{ marginTop: "10px" }}>
          <Select {...statusProps}/>
          <div className='gap' />
          <DescrInput {...descrProps}/>
        </div>
        <div className='ad_row' style={{ marginTop: "10px" }}>
          <Select {...templateProps}/>
          <div className='gap' />
          <Input {...sourceProps}/>
        </div>
      </div>
    </div>
  );
}
