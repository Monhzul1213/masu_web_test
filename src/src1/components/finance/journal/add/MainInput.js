import React, { useEffect, useState } from "react";
import { MdChevronLeft } from "react-icons/md";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { Date, DescrInput, IconButton, Input, MoneyInput, MoneyInput1, Select } from "../../../../../components/all";
import { getList } from "../../../../../services";
import { TempSelect } from "./TempSelect";
import { evaluate } from "mathjs";

export function MainInput(props) {
  const { setError, setEdited, price, setPrice, descr,  setDescr, source, setSource, setCustomer , customer,
          date, setDate, template, setTemplate, setLoading, status, setStatus, setDetail, header } = props;
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
    else {
      response?.data?.template?.forEach(item => {
        item.template = item?.templateId + "-" + item?.templateName
      })
      setTemplates(response?.data?.template)
    }
    setLoading(false);
    }
  };

  const calculateWithDependencies = (items, totalAmount) => {
    const localVars = { A0: totalAmount };
  
    return items.map((item, index) => {
      const currentVar = `A${index + 1}`; // A2, A3, A4 гэх мэт автоматаар үүсгэнэ
      let formula = item?.formula;
      let calcAmount;
  
      if (!formula || formula.toUpperCase() === "NULL") {
        // Зөвхөн A1 дээр totalAmount онооно
        calcAmount = totalAmount;
      } else {
        // LocalVars доторх бүх хувьсагчийг орлуулна
        for (const [key, value] of Object.entries(localVars)) {
          // RegExp ашиглан яг тухайн хувьсагчийг (A1 гэх мэт) олж солино
          formula = formula.replace(new RegExp(`\\b${key}\\b`, 'g'), value);
        }
  
        try {
          calcAmount = parseFloat(evaluate(formula).toFixed(2));
        } catch (e) {
          calcAmount = 0; // Хэрвээ томьёо буруу байвал 0 болгоно
        }
      }
      // localVars-д шинэ хувьсагчаа хадгална
      localVars[currentVar] = calcAmount;
        // Debit / Credit талд хуваарилна
      if (item?.isDebit === 0) {
        item.crAmt = calcAmount;
      } else {
        item.drAmt = calcAmount;
      }
  
      return item;
    });
  };
  
  const handleEnter = async (value) => {
    const totalAmount = value?.value ?? 0;
    const response = await dispatch(getList(user, token, "Txn/GetTemplate?TemplateId=" + template?.value));
  
    if (response?.error) {
      setError(response?.error);
    } else {
      const updatedItems = calculateWithDependencies(response?.data?.templateitem, totalAmount);
      setDetail(updatedItems);
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
                       setEdited, setError, inRow: true, handleEnter };
  const sourceProps = { value: source, setValue: setSource, label: t('manage.t_no'), placeholder: t('manage.t_no'), 
                        setError, setEdited, inRow: true, disabled: true, inRow1: true};
  const custProps = { value: customer, setValue: setCustomer, data: custs, s_value: "custId", s_descr: "custName", 
                      label: t("customer.title"), placeholder: t("customer.title"), onFocus: onFocusCust, inRow: true };
  const statusProps = { value: status, setValue: setStatus, data: states, s_value: "value", s_descr: "label", 
                      label: t("order.status"), placeholder: t("order.status"), onFocus: onFocusStatus, inRow: true, inRow1: true };
  const templateProps = { value: template, setValue: onChangeTemplate, data: templates,
                          label: t("transModel.title"), placeholder: t("transModel.title"), onFocus: onFocusTemplate, inRow: true };

  return (
    <div className="ad_back">
      <div className="ps_menu_back">
        <IconButton {...backProps} />
      </div>
      <div className="ad_main">
        {header?.journalId ? <p className='ps_header_no' style={{marginBottom: 10}}>{header?.journalId}</p> : null}
        <div className='ad_row'>
          <div style={{marginTop: 0, flex: 0.5}}><Date {...dateProps} /></div>
          <div className='gap' />
          <TempSelect {...templateProps}/>
        </div>
        <div className='ad_row' style={{ marginTop: "10px" }}>
          <MoneyInput1 {...totalProps}/>
          <div className='gap' />
          <Select {...statusProps}/>
          <div className='gap' />
          <Select {...custProps}/>
        </div>
        <div className='ad_row' style={{ marginTop: "10px" }}>
          <DescrInput {...descrProps}/>
          <div className='gap' />
          <Input {...sourceProps}/>
        </div>
      </div>
    </div>
  );
}
