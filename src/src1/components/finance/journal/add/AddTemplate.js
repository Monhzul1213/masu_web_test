import React, { useEffect, useMemo, useState } from "react";
import { Modal, message } from "antd";
import { useTranslation } from "react-i18next";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { getConstants, sendRequest, setSystemCash, setSystemVat } from "../../../../../services";
import { DescrInput, Error1, Input, Overlay, Select } from "../../../../../components/all";
import { AddList, ButtonRow} from "../../../../../src3_dadlaga/components/transactionModel";

export function AddTemplate(props) {
  const { visible, closeModal } = props;
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [edited, setEdited] = useState(false);
  const [error, setError] = useState(null);
  const [header, setHeader] = useState(null);
  const [detail, setDetail] = useState([]);
  const [templateName, setTemplateName] = useState({ value: "" });
  const [search, setSearch] = useState({ value: null });
  const [dItems, setDItems] = useState([]);
  const [saved, setSaved] = useState(false);
//   const [visible, setVisible] = useState(false);
  const [sites, setSites] = useState([]);
  const [open, setOpen] = useState(false);
  const [searchParams] = useSearchParams();
  const { user, token } = useSelector((state) => state.login);
  const [templateId, setTemplateId] = useState();
  const [vatPropertyId, setVatPropertyId] = useState();
  const [cashPropertyId, setCashPropertyId] = useState();
  const vatPropertys = useSelector((state) => state.temp.systemVat);
  const cashPropertys = useSelector((state) => state.temp.systemCash);
  const maxWidth = useSelector(state => state.temp.maxWidth);

  const addDetail = (newItem) => {
    setDetail((oldArray) => {
      const newArray = [...oldArray, { ...newItem, rowStatus: "I" }];
      return newArray;
    });
  };
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (saved) onClickCancel();
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [saved]);

  useEffect(() => {
    getConstantsData();
    return () => setEdited(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getConstantsData = async () => {
    setLoading(true);
    const response = await dispatch(
      getConstants(user, token, "glTemplate_VatPropertyID", setSystemVat)
    );
    await dispatch(
      getConstants(user, token, "glTemplate_CashPropertyID", setSystemCash)
    );
    if (response?.error) setError(response?.error);
    setLoading(false);
  };

  const onClickCancel = () => navigate({ pathname: "/finance/template" });

  const validateData = (status, rowStatus) => {
    let templateId = searchParams?.get("templateId") || 0;
    let templateType = 0;
    let items = [];
    detail?.forEach((item) => {
      // item.templateId = 0;
      // item.templateDtlId = 0;
      if (rowStatus === "I") {
        item.rowStatus = rowStatus;
      }
      items.push(item);
    });
    dItems?.forEach((it) => items?.push({ ...it, rowStatus: "D" }));
    let template = {
      templateId,
      templateType,
      templateName: templateName?.value,
      vatPropertyId: vatPropertyId?.value,
      cashPropertyId: cashPropertyId?.value,
      status,
      rowStatus: rowStatus,
      items,
    };

    return template;
  };

  const onClickSave = async (status, rowStatus) => {
    let data = validateData(status, rowStatus);
    const message =
      rowStatus === "I"
        ? t("transModel.add_success")
        : rowStatus === "U"
        ? t("transModel.edit_success")
        : t("transModel.delete_success");
    if (data) {
      onLoad();
      const response = await dispatch(
        sendRequest(user, token, "Txn/ModTemplate", data)
      );
      if (response?.code === 1001) {
        onError(response?.error, true);
        setOpen(true);
        setSites(response?.data);
      } else if (response?.error) onError(response?.error, true);
      else {
        onSuccess(message);
        closeModal(true, response?.data?.templateId)
      }
    }
  };

  const onClickDelete = (row) => {
    setDItems((oldArray) => {
      const newArray = [...oldArray, row?.original];
      return newArray;
    });
    setDetail((prev) => prev.filter((_, i) => i !== row.index));
  };

  const onLoad = () => {
    setError(null);
    setLoading(true);
    setEdited(false);
  };

  const onError = (err, edited) => {
    setError(err);
    setEdited(edited);
    setLoading(false);
  };

  const onSuccess = (msg) => {
    if (msg) {
      message.success(msg);
      setSaved(true);
    }
    setLoading(false);
  };


//   const confirm = (sure) => {
//     setOpen(false);
//     setError(null);
//     if (sure) setVisible(true);
//   };

  const handleFormula = (value, index) => {
    setDetail((prevArr) => {
      const newArr = [...prevArr];
      newArr[index] = { ...newArr[index], formula: value };
      return newArr;
    });
  };
  const handleCheck = (value, index) => {
    setDetail((prevArr) => {
      const newArr = [...prevArr];
      newArr[index] = { ...newArr[index], isDebit: value };
      return newArr;
    });
  };
  const debateValidation = (status, rowStatus) => {
    if (detail.length > 0) {
      let isDebit = false;
      let isCredit = false;
      let isFormula = false;
      detail.forEach((item) => {
        if (item.isDebit === 0) {
          isCredit = true;
        } else {
          isDebit = true;
        }
        if(item?.formula) isFormula = true;
      });
      if (!isDebit) {
        setSearch({ value: null, error: "Дэбит данс оруулна уу" });
        return;
      }
      if (!isCredit) {
        setSearch({ value: null, error: "Кредит данс оруулна уу" });
        return;
      }
      if (!isFormula) {
        setSearch({ value: null, error: "Томьёо оруулна уу" });
        return;
      }
      if (isCredit && isDebit && isFormula) {
        setSearch({ value: null, error: null });
        onClickSave(status, rowStatus);
      }
    }
  };

  const sortedVat = useMemo(() => {
    const arr = Array.isArray(vatPropertys) ? [...vatPropertys] : [];
    return arr.sort((a, b) =>
      String(a?.valueStr1 ?? "").localeCompare(String(b?.valueStr1 ?? ""), "mn", {
        numeric: true,
        sensitivity: "base",
      })
    );
  }, [vatPropertys]);
 
  const sortedCash = useMemo(() => {
    const arr = Array.isArray(cashPropertys) ? [...cashPropertys] : [];
    return arr.sort((a, b) =>
      String(a?.valueStr1 ?? "").localeCompare(String(b?.valueStr1 ?? ""), "mn", {
        numeric: true,
        sensitivity: "base",
      })
    );
  }, [cashPropertys]);

  let listProps = {
    handleFormula,
    handleCheck,
    detail,
    setDetail,
    search,
    setSearch,
    setEdited,
    setDItems,
    addDetail,
    onClickDelete,
  };
  let btnProps = {
    onClickCancel: () => closeModal(),
    onClickSave: () => debateValidation(1, "I"),
    header
  };

  const idProps = { value: { value: templateId }, setValue: () => {}, label: t("transModel.number"), placeholder: t("transModel.number"), disabled: true, inRow: true};
  const descrProps = { value: templateName, setValue: setTemplateName, label: t("transModel.title"), placeholder: t("transModel.title"), setEdited, setError, length: 100, inRow: true};
  const vatProps = { value: vatPropertyId, setValue: ({ value }) => setVatPropertyId({ value }), label: t("transModel.vatSelect"), placeholder: t("transModel.vatSelect"),
                    data: sortedVat,  setError, setEdited, s_value: "constKey", s_descr: "valueStr1", inRow: true, loading};
  const cashProps = { value: cashPropertyId, setValue: ({ value }) => setCashPropertyId({ value }), label: t("transModel.cashSelect"), placeholder: t("transModel.cashSelect"),
                    data: sortedCash, setError, setEdited, s_value: "constKey", s_descr: "valueStr1", inRow: true, loading};

  return (
    <Modal title={null} footer={null} closable={false} open={visible} centered={true} width={900}>
      <Overlay loading={loading}>
        <div className='m_back'>
        {error && <Error1 error={error} />}
        <div className='m_scroll' id='im_small'>
          <form>
            <div className="ad_main">
                <div className='ad_row'>
                    <Input {...idProps} />
                    <div className="gap" />
                    <DescrInput {...descrProps} />
                </div>
                <div className='ad_row' style={{ marginTop: "10px" }}>
                    <Select {...vatProps} />
                    <div className="gap" />
                    <Select {...cashProps} />
                </div>
            </div>
            {/* <div className="gap" /> */}
              <AddList {...listProps} />
          </form>
        </div>
        <ButtonRow {...btnProps} />
        </div>
      </Overlay>
    </Modal>
  );
}
