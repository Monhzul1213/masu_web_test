import React, { useEffect, useState } from "react";
import { message } from "antd";
import { useTranslation } from "react-i18next";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";
 
import { getList, sendRequest } from "../../../services";
import { Error1, Overlay, Prompt } from "../../../components/all";
import { AddList, ButtonRow } from "../../../src1/components/finance/journal/add";
import { MainInput } from "../../../src3_dadlaga/components/reportingPeriod/MainInput";
 
export function ReportingJournalAdd({ onClose, periodRow, initialData, journalId: propJournalId, isModal }) {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [edited, setEdited] = useState(false);
  const [error, setError] = useState(null);
  const [header, setHeader] = useState(null);
  const [detail, setDetail] = useState([]);
  const [search, setSearch] = useState({ value: null });
  const [dItems, setDItems] = useState([]);
  const [price, setPrice] = useState({ value: 0 });
  const [descr, setDescr] = useState({ value: "" });
  const [source, setSource] = useState({ value: "" });
  const [customer, setCustomer] = useState();
  const [template, setTemplate] = useState();
  const [status, setStatus] = useState({ value: 0 });
  const [date, setDate] = useState({ value: moment() });
 
  const { user, token } = useSelector((state) => state.login);
  const maxWidth = useSelector((state) => state.temp.maxWidth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
 
  const getDatesForPeriod = (year, period, periodType = "S") => {
    const p = Number(period);
    let start;
 
    if (periodType === "S") {
      start = moment(`${year}-${(p - 1) * 3 + 1}-01`);
      return {
        beginDate: start.toISOString(),
        endDate: moment(start).add(3, "months").subtract(1, "day").endOf("day").toISOString(),
      };
    }
 
    if (periodType === "M") {
      start = moment(`${year}-${String(p).padStart(2, "0")}-01`);
      return {
        beginDate: start.toISOString(),
        endDate: start.endOf("month").endOf("day").toISOString(),
      };
    }
 
    if (periodType === "HY") {
      start = moment(`${year}-${p === 1 ? "01" : "07"}-01`);
      return {
        beginDate: start.toISOString(),
        endDate: moment(start).add(6, "months").subtract(1, "day").endOf("day").toISOString(),
      };
    }
 
    if (periodType === "Y") {
      return {
        beginDate: moment(`${year}-01-01`).toISOString(),
        endDate: moment(`${year}-12-31`).endOf("day").toISOString(),
      };
    }
 
    return { beginDate: "", endDate: "" };
  };
 
  useEffect(() => {
    if (user?.msRole?.webFinance !== "Y") {
      navigate({ pathname: "/" });
      return;
    }
 
    const paramJournalId = searchParams.get("journalId");
    const finalJournalId =
      initialData?.journal?.journalId ?? initialData?.journal?.id ?? initialData?.journal?.glJournalId ?? propJournalId ?? paramJournalId;
 
    if (initialData?.journal) {
      const h = initialData.journal;
      const dateVal = moment(h?.txnDate);
      setHeader(h);
      setDate({ value: dateVal.isValid() ? dateVal : moment() });
      setPrice({ value: h?.totalAmt ?? 0 });
      setDescr({ value: h?.descr ?? "" });
      setSource({ value: h?.sourceTypeName ?? "" });
      setCustomer(h?.custID ? { value: h.custID } : undefined);
      setStatus({ value: h?.status ?? 0 });
      setTemplate(h?.templateID ? { value: h.templateID } : undefined);
 
      const detailItems = (initialData?.journalitem ?? []).map((item) => ({
        ...item,
        accObj: item.acct ? { value: item.acct, label: `${item.acct}${item.itemDescr ? " - " + item.itemDescr : ""}` } : null,
      }));
 
      setDetail(detailItems);
    } else if (finalJournalId) {
      getJournalData(finalJournalId);
    }
 
    return () => setEdited(false);
  }, []);
 
  const getJournalData = async (journalId) => {
    onLoad();
    const response = await dispatch(getList(user, token, `Txn/GetJournal?JournalID=${journalId}`));
    if (response?.error) return onError(response?.error, false);
 
    const h = response?.data?.journal?.[0];
    const dateVal = moment(h?.txnDate);
    setHeader(h);
    setDate({ value: dateVal.isValid() ? dateVal : moment() });
    setPrice({ value: h?.totalAmt });
    setDescr({ value: h?.descr });
    setSource({ value: h?.sourceTypeName });
    setCustomer(h?.custId ? { value: h?.custId } : undefined);
    setStatus({ value: h?.status });
    setTemplate(h?.templateId ? { value: h?.templateId } : undefined);
 
    const detailItems = (response?.data?.journalitem || []).map((item) => ({
      ...item,
      accObj: item.acct ? { value: item.acct, label: `${item.acct}${item.itemDescr ? " - " + item.itemDescr : ""}` } : null,
    }));
 
    setDetail(detailItems);
    setLoading(false);
  };
 
  const validateData = () => {
    if (!detail?.length) {
      setSearch({ value: null, error: t("adjust.items_error") });
      return false;
    }

    if (!customer?.value) {
    message.error(t("reporting.period.customer_required"));
    return false;
  }
 
    const journalID = parseInt(header?.journalId ?? header?.id ?? header?.glJournalId ?? 0, 10) || 0;
 
    const items = detail.map((item) => ({ ...item, rowStatus: journalID ? "U" : "I" }));
    dItems.forEach((it) => items.push({ ...it, rowStatus: "D" }));
 
    return {
      journalID,
      txnDate: date?.value?.format("YYYY.MM.DD"),
      status: status?.value,
      templateID: template?.value,
      custID: customer?.value,
      totalAmt: price?.value,
      descr: descr?.value,
      rowStatus: journalID ? "U" : "I",
      items,
    };
  };
 
  const confirmJournal = async (savedJournalId) => {
    const response = await dispatch(getList(user, token, `Txn/GetJournal?JournalID=${savedJournalId}`));
    return response?.data?.journal?.[0] ?? null;
  };
 
  const onClickSave = async () => {
    if (!periodRow) {
      return;
    }
 
    const { periodType, year, period } = periodRow;
    const y = Number(year);
    const p = Number(period);
 
    if (!periodType || isNaN(y) || isNaN(p)) {
      return;
    }
 
    const data = validateData();
    if (!data) return;
 
    try {
      onLoad();
 
      if (periodRow?.isLocked === "Y") {
        const { beginDate, endDate } = getDatesForPeriod(y, p, periodType);
        const unlockPayload = [
          {
            periodType,
            year: y,
            period: p,
            beginDate,
            endDate,
            isLocked: "N",
            status: 0,
            lastUserID: user?.userID ?? user?.id ?? 0,
            lastUpdate: new Date().toISOString(),
          },
        ];
        await dispatch(sendRequest(user, token, "Merchant/ModPeriod", unlockPayload));
      }
 
      const response = await dispatch(sendRequest(user, token, "Txn/ModJournal", data));
      const savedJournalId = response?.data?.journal?.journalId ?? response?.data?.journalId ?? data.journalID;
 
      if (!savedJournalId) {
        return;
      }
 
      const confirmedJournal = await confirmJournal(savedJournalId);
      if (!confirmedJournal?.journalId) {
        return;
      }
 
      const { beginDate, endDate } = getDatesForPeriod(y, p, periodType);
      const modPeriodPayload = [
        {
          periodType,
          year: y,
          period: p,
          beginDate,
          endDate,
          journalId: confirmedJournal.journalId,
          isLocked: "Y",
          status: 1,
          lastUserID: user?.userID ?? user?.id ?? 0,
          lastUpdate: new Date().toISOString(),
        },
      ];
 
      const savePeriodRes = await dispatch(sendRequest(user, token, "Merchant/ModPeriod", modPeriodPayload));
      if (savePeriodRes?.error || savePeriodRes?.code === 1001) {
        return;
      }
 
      message.success(t("reporting.period.save_success"));
      onClose?.({ saved: true, journalId: savedJournalId });
    } catch (e) {
      console.error("Save journal error:", e);
    } finally {
      setLoading(false);
    }
  };
 
  const onClickDelete = async () => {
    onLoad();
    const data = { ...header, rowStatus: "D", items: [] };
    const response = await dispatch(sendRequest(user, token, "Txn/ModJournal", data));
    if (response?.error) onError(response?.error, true);
    else {
      setLoading(false);
    }
  };
 
  const onClickCancel = () => {
    if (typeof onClose === "function") onClose();
    else navigate({ pathname: "/finance/reporting_period" });
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
 
  const mainProps = { setError, setEdited, price, setPrice, loading, setLoading, setDetail, header, descr, setDescr, source, setSource, setCustomer, customer, template, setTemplate, status, setStatus, date, setDate };
  const listProps = { detail, setDetail, search, setSearch, setEdited, setDItems, onClickDelete, setPrice };
  const btnProps = { onClickCancel, onClickSave, onClickDelete, header };
 
  return (
    <div className='s_container_i1' style={{ maxWidth }}>
      <Overlay loading={!!loading}>
        <Prompt edited={edited} />
        {error && <Error1 error={error} />}
        <div className="i_scroll">
          <form>
            <MainInput {...mainProps} />
            <div className="gap" />
            <div className="po_back1" id="po_back_invt">
              <AddList {...listProps} />
            </div>
          </form>
        </div>
        <ButtonRow {...btnProps} />
      </Overlay>
    </div>
  );
}