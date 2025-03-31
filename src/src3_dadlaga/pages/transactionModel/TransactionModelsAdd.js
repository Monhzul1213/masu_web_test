import React, { useEffect, useState } from "react";
import { message } from "antd";
import { useTranslation } from "react-i18next";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import {
  getConstants,
  getList,
  sendRequest,
  setSystemCash,
  setSystemVat,
} from "../../../services";
import { Confirm, Error1, Overlay, Prompt } from "../../../components/all";
import { Subscription } from "../../../components/management/adjust/list";
import {
  MainInput,
  AddList,
  ButtonRow,
} from "../../components/transactionModel";

export function TransactionModelsAdd() {
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
  const [editable, setEditable] = useState(true);
  const [updatable, setUpdatable] = useState(false);
  const [visible, setVisible] = useState(false);
  const [sites, setSites] = useState([]);
  const [open, setOpen] = useState(false);
  const [searchParams] = useSearchParams();
  const { user, token } = useSelector((state) => state.login);
  const [templateId, setTemplateId] = useState();
  const [vatPropertyId, setVatPropertyId] = useState();
  const [cashPropertyId, setCashPropertyId] = useState();
  const vatPropertys = useSelector((state) => state.temp.systemVat);
  const cashPropertys = useSelector((state) => state.temp.systemCash);

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
    user?.msRole?.webManageItem !== "Y"
      ? navigate({ pathname: "/" })
      : getData();
    getConstantsData();
    return () => setEdited(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getData = async () => {
    let templateId = searchParams?.get("templateId");
    setTemplateId(templateId);
    if (templateId) {
      onLoad();
      const response = await dispatch(
        getList(user, token, "Txn/GetTemplate?TemplateId=" + templateId)
      );
      setUpdatable(true);
      if (response?.error) onError(response?.error, false);
      else {
        let header = response?.data?.template && response?.data?.template[0];
        setHeader(header);
        setEditable(true);
        setTemplateName({ value: header?.templateName });
        setCashPropertyId({ value: header?.cashPropertyId });
        setVatPropertyId({ value: header?.vatPropertyId });
        let items = [];
        response?.data?.templateitem.forEach((item) => {
          item.rowStatus = "U";
          items.push(item);
        });
        setDetail(items);
        onSuccess();
      }
    }
  };
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
      templateName: templateName.value,
      vatPropertyId: vatPropertyId.value,
      cashPropertyId: cashPropertyId.value,
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
      else onSuccess(message);
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

  const onDone = async () => {
    setVisible(false);
    setSites([]);
    // onClickSave(status1);
  };

  const confirm = (sure) => {
    setOpen(false);
    setError(null);
    if (sure) setVisible(true);
  };

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
      detail.forEach((item) => {
        if (item.isDebit === 0) {
          isCredit = true;
        } else {
          isDebit = true;
        }
      });
      if (!isDebit) {
        setSearch({ value: null, error: "Дэбит данс оруулна уу" });
        return;
      }
      if (!isCredit) {
        setSearch({ value: null, error: "Кредит данс оруулна уу" });
        return;
      }
      if (isCredit && isDebit) {
        setSearch({ value: null, error: null });
        onClickSave(status, rowStatus);
      }
    }
  };

  let mainProps = {
    templateId,
    setError,
    setEdited,
    header,
    detail,
    templateName,
    vatPropertyId,
    cashPropertyId,
    setVatPropertyId,
    setCashPropertyId,
    setTemplateName,
    editable,
    vatPropertys,
    cashPropertys,
  };
  let listProps = {
    handleFormula,
    handleCheck,
    detail,
    setDetail,
    search,
    setSearch,
    setEdited,
    setDItems,
    editable,
    addDetail,
    onClickDelete,
  };
  let btnProps = {
    onClickCancel,
    onClickSave: () => debateValidation(1, "I"),
    onClickEdit: () => debateValidation(1, "U"),
    onClickDelete: () => onClickSave(1, "D"),
    updatable,
    header,
    disabled: updatable,
    deletable: updatable,
  };
  let subProps = {
    visible,
    setVisible,
    sites,
    setSites,
    onDone,
    noTrial: true,
  };
  let confirmProps = {
    open,
    text: t("adjust.confirm_pay"),
    confirm,
    text1: error,
  };

  return (
    <Overlay className="i_container" loading={loading}>
      <Prompt edited={edited} />
      <Confirm {...confirmProps} />
      {visible && <Subscription {...subProps} />}
      {error && <Error1 error={error} />}
      <div className="i_scroll">
        <form>
          <MainInput {...mainProps} />
          <div className="gap" />
          <div className="po_back" id="po_back_invt">
            <AddList {...listProps} />
          </div>
        </form>
      </div>
      <ButtonRow {...btnProps} />
    </Overlay>
  );
}
