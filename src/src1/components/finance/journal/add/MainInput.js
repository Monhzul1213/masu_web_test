import React, { useEffect, useState } from "react";
import { MdChevronLeft } from "react-icons/md";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { Date, DescrInput, DynamicBSIcon, IconButton, MoneyInput1, Select } from "../../../../../components/all";
import { getList, getServiceBar } from "../../../../../services";
import { TempSelect } from "./TempSelect";
import { evaluate } from "mathjs";
import { Add as AddCustomer } from "../../../customer/customer/Add";
import { AddTemplate } from "./AddTemplate";

export function MainInput(props) {
  const { setError, setEdited, price, setPrice, descr,  setDescr, setCustomer , customer,
          date, setDate, template, setTemplate, setLoading, status, setStatus, setDetail, header, detail } = props;
  const [states, setStates] = useState([{ value: 0, label: "Үүсгэсэн" }]);
  const [templates, setTemplates] = useState([]);
  const [custs, setCusts] = useState([]);
  const [tempVisible, setTempVisible] = useState(false);
  const [custVisible, setCustVisible] = useState(false);
  const [branch, setBranch] = useState([]);
  const [allBranch, setAllBranch] = useState([]);
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user, token } = useSelector((state) => state.login);

  useEffect(() => {
    getTemplate();
    getCustomer();
    getData();
    getBranchs();
    onFocusStatus();
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getBranchs = async () => {
    setError(null);
    setLoading(true);
    const response = await dispatch(getServiceBar('getBranchInfo'));
    if(response?.error) setError(response?.error);
    else {
      let data = [];
      response?.data?.data?.forEach(item => {
        let index = data?.findIndex(list => item.branchCode === list.branchCode )
        if(index === -1 ) data.push(item)
      })
      setBranch(data?.sort((a, b)=> a?.branchCode - b?.branchCode));
      setAllBranch(response?.data?.data);
    }
    setLoading(false);
  }

  const getData = async () => {
    setLoading(true);
    let response = await getTemplate();
    if(response) await getCustomer();
    setLoading(false);
  }

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

  const getCustomer = async (toGet, id) => {
    if(!custs?.length || custs?.length === 1 || toGet){
      setError && setError(null);
      setLoading('custs');
      let headers = {CustID: -1}
      const response = await dispatch(getList(user, token, 'Site/GetCustomer', null, headers));
      if(response?.error) setError && setError(response?.error);
      else {
        setCusts(response?.data?.customers);
        if(id) setCustomer({ value: id });
      }
      setLoading(false);
    }
  }

  const getTemplate = async (toGet, id) => {
    if(!templates?.length || templates?.length === 1 || toGet){
    setError && setError(null);
    setLoading('templates');
    const response = await dispatch(getList(user, token, "Txn/GetTemplate"));
    if(response?.error) setError(response?.error)
    else {
      response?.data?.template?.forEach(item => {
        item.template = item?.templateId + "-" + item?.templateName
      })
      setTemplates(response?.data?.template)
      let item = response?.data?.templateitem?.filter( item => item?.templateId === id)
      setDetail(item)
      if(id) setTemplate({ value: id });
    }
    setLoading(false);
    }
  };

  const calculateWithDependencies = (items, totalAmount) => {
    const localVars = { A0: totalAmount };
  
    return items.map((item, index) => {
      const currentVar = `A${index + 1}`;
      let formula = item?.formula;
      let calcAmount = 0;
  
      if (!formula || formula.toUpperCase() === "NULL") {
        calcAmount = totalAmount;
      } else {
        for (const [key, value] of Object.entries(localVars)) {
          formula = formula.replace(new RegExp(`\\b${key}\\b`, 'g'), value);
        }
  
        try {
          calcAmount = parseFloat(evaluate(formula).toFixed(2));
        } catch (e) {
          calcAmount = 0;
        }
      }
      localVars[currentVar] = calcAmount;
      if (item?.isDebit === 0) {
        item.crAmt = Number(calcAmount);
        item.itemDescr = item?.itemDescr ?? '';
      } else {
        item.drAmt = Number(calcAmount);
        item.itemDescr = item?.itemDescr ?? '';
      }
  
      return item;
    });
  };
  
  const handleEnter = async (value) => {
    setPrice(value)
    const totalAmount = value?.value ?? 0;
    if(template?.value){
        const response = await dispatch(getList(user, token, "Txn/GetTemplate?TemplateId=" + template?.value));
        if (response?.error) {
          setError(response?.error);
        } else {
          const updatedItems = calculateWithDependencies(response?.data?.templateitem, totalAmount);
          setDetail(updatedItems);
        }
    }
    else {
      const updatedItems = detail.map(item => {
        if (item.isDebit === 1 || item.isDebit === "Y") {
          return { ...item, drAmt: totalAmount, itemDescr: item?.itemDescr ?? '' };
        } else {
          return { ...item, crAmt: totalAmount, itemDescr: item?.itemDescr ?? '' };
        }
      });
      setDetail(updatedItems);
    }
  };
  

  const onChangeTemplate = async (value) => {
    setTemplate(value);
    if (!value?.value) {
      setDetail([]);
      return;
    }
    const response = await dispatch(
      getList(user, token, "Txn/GetTemplate?TemplateId=" + value?.value)
    );
    if (response?.error) {
      setError(response?.error);
    } else {
      response?.data?.templateitem?.forEach(item => {
        item.drAmt = item?.drAmt ?? 0;
        item.crAmt = item?.crAmt ?? 0;
      });
    }
    setDetail(response?.data?.templateitem);
  };

  const onClickTemplate = e => {
    e?.preventDefault();
    setTempVisible(true);
  };

  const closeTemplate = (saved, id) => {
    setTempVisible(false);
    getTemplate(saved, id);
  }

  const onClickCustomer = e => {
    e?.preventDefault();
    setCustVisible(true);
  }

  const closeCustomer = (saved, id) => {
    setCustVisible(false);
    getCustomer(saved, id);
  }

  const descrProps = { value: descr, setValue: setDescr, label: t("shop.descr"), placeholder: t("shop.descr"), 
                       setEdited, setError, length: 100, inRow: true};
  const backProps = { className: "ps_back_btn", text: t("journal.backButton"), icon: <MdChevronLeft className="ps_back_icon" />, 
                      onClick: onClickBack };
  const dateProps = { value: date, setValue: setDate, label: t('count.date'), placeholder: t('count.date'), 
                      inRow: true, className: 'c_date' };
  const totalProps = { value: price, setValue: handleEnter, label: t('discount.amount'), placeholder: t('discount.amount'), 
                       setEdited, setError, inRow: true, handleEnter };
  // const sourceProps = { value: source, setValue: setSource, label: t('manage.t_no'), placeholder: t('manage.t_no'), 
  //                       setError, setEdited, inRow: true, disabled: true, inRow1: true};
  const custProps = { value: customer, setValue: setCustomer, data: custs, s_value: "custId", s_descr: "custName", 
                      label: t("customer.title"), placeholder: t("customer.title"), onFocus: getCustomer, inRow: true, allowClear: true };
  const statusProps = { value: status, setValue: setStatus, data: states, s_value: "value", s_descr: "label", 
                      label: t("order.status"), placeholder: t("order.status"), onFocus: onFocusStatus, inRow: true, inRow1: true };
  const templateProps = { value: template, setValue: onChangeTemplate, data: templates,
                          label: t("transModel.title"), placeholder: t("transModel.title"), onFocus: getTemplate, inRow: true };
  const addcustProps = {visible: custVisible, closeModal: closeCustomer, branch, allBranch, getBranchs}

  return (
    <div className="ad_back">
      {custVisible && <AddCustomer {...addcustProps} />}
      {tempVisible && <AddTemplate visible={tempVisible} closeModal={closeTemplate} />}
      <div className="ps_menu_back">
        <IconButton {...backProps} />
      </div>
      <div className="ad_main">
        {header?.journalId ? <p className='ps_header_no' style={{marginBottom: 10}}>{header?.journalId}</p> : null}
        <div className='ad_row'>
          <div style={{marginTop: 0, flex: 0.43}}><Date {...dateProps} /></div>
          <div className='gap' />
          <TempSelect {...templateProps}/>
          <div style={{display: 'flex', alignItems:'flex-end'}}>
            <IconButton className='im_add_btn' onClick={onClickTemplate} icon={<DynamicBSIcon name='BsPlusLg' className='im_add_btn_icon' />} />
          </div>
        </div>
        <div className='ad_row' style={{ marginTop: "10px" }}>
        <div style={{marginTop: 0, flex: 0.43}}><MoneyInput1 {...totalProps}/></div>
          {/* <div className='gap' />
          <Select {...statusProps}/> */}
          <div className='gap' />
          <Select {...custProps}/>
          <div style={{display: 'flex', alignItems:'flex-end'}}>
            <IconButton className='im_add_btn' onClick={onClickCustomer} icon={<DynamicBSIcon name='BsPlusLg' className='im_add_btn_icon' />} />
          </div>
        </div>
        <div className='ad_row' style={{ marginTop: "10px" }}>
          {/* <div style={{marginTop: 0, flex: 0.4}}><Input {...sourceProps}/></div> */}
          <div style={{marginTop: 0, flex: 0.4}}><Select {...statusProps}/></div>
          <div className='gap' />
          <DescrInput {...descrProps}/>
        </div>
      </div>
    </div>
  );
}
