import { Modal, message } from "antd";
import { useTranslation } from "react-i18next";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  createSearchParams,
  useNavigate,
  useSearchParams,
} from "react-router-dom";

import {
  getConstants,
  getList,
  sendRequest,
  setSystemVat,
  setSystemCash,
} from "../../../services";
import { MainInput } from "../../components/accounts";
import { ButtonRow } from "../../components/transactionModel";
import { Subscription } from "../../../components/management/adjust/list";
import { Confirm, Error1, Prompt } from "../../../components/all";

export function AccountAddModal(props) {
  const { openModal, setOpenModal, onSearch } = props;

  const { t } = useTranslation();
  const [sites, setSites] = useState([]);
  const [open, setOpen] = useState(false);
  const [error, setError] = useState(null);
  const [saved, setSaved] = useState(false);
  const [header, setHeader] = useState(null);
  const [edited, setEdited] = useState(false);
  const [visible, setVisible] = useState(false);

  const [isDebit, setIsDebit] = useState(false);
  const [editable, setEditable] = useState(true);
  const [siteDatas, setSiteDatas] = useState([]);
  const [updatable, setUpdatable] = useState(false);
  const [siteId, setSiteId] = useState({ value: null });
  const [accountCode, setAccountCode] = useState({ value: "" });
  const [accountName, setAccountName] = useState({ value: "" });
  const [accountType, setAccountType] = useState({ value: null });
  const [accountStatus, setAccountStatus] = useState({ value: 1 });
  const [accountCurrency, setAccountCurrency] = useState({ value: "MNT" });

  const [searchParams] = useSearchParams();
  const { user, token } = useSelector((state) => state.login);
  const currency = useSelector((state) => state.temp.systemVat);
  const typeDatas = useSelector((state) => state.temp.systemCash);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (saved) onClickCancel();
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [saved]);

  useEffect(() => {
    user?.msRole?.webManageItem !== "Y" && navigate({ pathname: "/" });
    const acct = searchParams?.get("acct");
    if (acct) {
      getData(acct);
    }
    getConstantsData();
    return () => setEdited(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [openModal]);

  const clearForm = () => {
    setIsDebit(false);
    setSiteId({ value: null });
    setAccountCode({ value: "" });
    setAccountName({ value: "" });
    setAccountStatus({ value: 1 });
    setAccountType({ value: null });
    setAccountCurrency({ value: "MNT" });
  };

  const getData = async (acct) => {
    if (acct) {
      onLoad();
      const response = await dispatch(
        getList(user, token, "Txn/GetAccount?Acct=" + acct)
      );
      const data = response?.data?.acct[0];
      setUpdatable(true);
      setIsDebit(data?.isDebit === "Y");
      setSiteId({ value: data?.siteId });
      setAccountCode({ value: data?.acct });
      setAccountName({ value: data?.acctName });
      setAccountStatus({ value: data?.status });
      setAccountType({ value: data?.acctType });
      setAccountCurrency({ value: data?.currency });
      if (response?.error) onError(response?.error, false);
      else {
        let header = response?.data && response?.data[0];
        setHeader(header);
        setEditable(true);
        onSuccess();
      }
    }
  };
  const getConstantsData = async () => {
    const response = await dispatch(
      getConstants(user, token, "glAccount_Currency", setSystemVat)
    );
    await dispatch(
      getConstants(user, token, "glAccount_AcctType", setSystemCash)
    );
    const response2 = await dispatch(getList(user, token, "Site/GetSite"));
    setSiteDatas([...(response2?.data || []), { siteId: null, name: null }]);
    if (response?.error) setError(response?.error);
  };

  const onClickCancel = () => {
    const classId = searchParams?.get("classId");
    navigate({
      search: createSearchParams({
        classId: classId,
      }).toString(),
    });
    setOpenModal(false);
    clearForm();
    setUpdatable(false);
  };

  const validateData = (rowStatus) => {
    if (
      accountCode.value === "" ||
      accountName.value === "" ||
      accountType.value === null
    ) {
      setError("Бүрэн бөглөнө үү");
      return null;
    }
    let acctClassID = searchParams?.get("classId");
    let account = {
      acct: accountCode.value,
      acctName: accountName.value,
      currency: accountCurrency.value,
      isDebit: isDebit ? "Y" : "N",
      status: accountStatus.value,
      siteID: siteId.value,
      acctType: accountType.value,
      acctClassID,
      rowStatus,
    };
    return account;
  };

  const onClickSave = async (rowStatus) => {
    let data = validateData(rowStatus);

    let classId = searchParams?.get("classId");
    const message =
      rowStatus === "I"
        ? t("account.add_success")
        : rowStatus === "U"
        ? t("account.edit_success")
        : t("account.delete_success");
    if (data) {
      onLoad();
      const response = await dispatch(
        sendRequest(user, token, "Txn/ModAccount", data)
      );
      if (response?.code === 1001) {
        onError(response?.error, true);
        setOpen(true);
        setSites(response?.data);
      } else if (response?.error) onError(response?.error, true);
      else {
        onSuccess(message);
        onSearch(`?AcctClassID=${classId}`);
        onClickCancel();
      }
    }
  };

  const onLoad = () => {
    setError(null);

    setEdited(false);
  };

  const onError = (err, edited) => {
    setError(err);
    setEdited(edited);
  };

  const onSuccess = (msg) => {
    if (msg) {
      message.success(msg);
      setSaved(true);
    }
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

  let mainProps = {
    setError,
    setEdited,
    setSiteId,
    setIsDebit,
    setAccountCode,
    setAccountType,
    setAccountName,
    setAccountStatus,
    setAccountCurrency,
    onClickCancel,
    accountType,
    siteId,
    isDebit,
    accountCode,
    header,
    accountName,
    accountCurrency,
    accountStatus,
    editable,
    updatable,
    currency,
    typeDatas,
    siteDatas,
  };
  let btnProps = {
    onClickCancel,
    onClickSave: () => onClickSave("I"),
    onClickEdit: () => onClickSave("U"),
    onClickDelete: () => onClickSave("D"),
    updatable,
    header,
    deletable: updatable,
    disabled: updatable,
  };
  let subProps = {
    setVisible,
    setSites,
    onDone,
    visible,
    sites,
    noTrial: true,
  };
  let confirmProps = {
    open,
    text: t("adjust.confirm_pay"),
    confirm,
    text1: error,
  };

  return (
    <Modal open={openModal} footer={null} closable={false}>
      <div style={{ padding: 10 }}>
        <Prompt edited={edited} />
        <Confirm {...confirmProps} />
        {visible && <Subscription {...subProps} />}
        {error && <Error1 error={error} />}
        <div className="i_scroll">
          <form>
            <MainInput {...mainProps} />
          </form>
        </div>
        <ButtonRow {...btnProps} />
      </div>
    </Modal>
  );
}
