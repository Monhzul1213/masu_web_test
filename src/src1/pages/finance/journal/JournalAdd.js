import React, { useEffect, useState } from "react";
import { message } from "antd";
import { useTranslation } from "react-i18next";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";

import { getList, sendRequest} from "../../../../services";
import { Confirm, Error1, Overlay, Prompt } from "../../../../components/all";
import { Subscription } from "../../../../components/management/adjust/list";
import { MainInput, AddList, ButtonRow } from "../../../components/finance/journal/add";

export function JournalAdd() {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [edited, setEdited] = useState(false);
  const [error, setError] = useState(null);
  const [header, setHeader] = useState(null);
  const [detail, setDetail] = useState([]);
  const [search, setSearch] = useState({ value: null });
  const [dItems, setDItems] = useState([]);
  const [saved, setSaved] = useState(false);
  // const [editable, setEditable] = useState(true);
  // const [updatable, setUpdatable] = useState(false);
  const [visible, setVisible] = useState(false);
  const [open, setOpen] = useState(false);
  const [price, setPrice] = useState({ value: 0 });
  const [descr,  setDescr] = useState({ value: '' });
  const [source, setSource] = useState({ value: '' });
  const [customer, setCustomer] = useState({ value: '' });
  const [template, setTemplate] = useState({ value: '' });
  const [status, setStatus] = useState({ value: 0 });
  const [date, setDate] = useState({ value: moment() });
  const [searchParams] = useSearchParams();
  const { user, token } = useSelector((state) => state.login);
  const maxWidth = useSelector(state => state.temp.maxWidth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (saved) onCancel();
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [saved]);

  useEffect(() => {
    user?.msRole?.webFinance !== "Y"
      ? navigate({ pathname: "/" })
      : getData();
    return () => setEdited(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getData = async () => {
    let journalId = searchParams?.get("journalId");
    if (journalId) {
      onLoad();
      const response = await dispatch(getList(user, token, "Txn/GetJournal?JournalID=" + journalId));
      if(response?.error) onError(response?.error, false);
      else {
        let header = response?.data?.journal && response?.data?.journal[0];
        setHeader(header);
        // setEditable(header?.status !== 1);
        setDate ({ value: moment(header?.txnDate, 'yyyy.MM.DD') })
        setPrice({ value: header?.totalAmt });
        setDescr({ value: header?.descr });
        setSource({ value: header?.sourceTypeName });
        setCustomer({ value: header?.custId !== 0 ? header?.custId : '' });
        setStatus({ value: header?.status });
        setTemplate({ value: header?.templateId !== 0 ? header?.templateId : '' });
        response?.data?.journalitem?.forEach(item=> {
          item.vatPropertyID = item?.vaId
        })
        setDetail(response?.data?.journalitem);
        onSuccess();
      }
    }
  };

  const onClickCancel = () => navigate({ pathname: "/finance/journal" });

  const onCancel = () => {
    clearForm();
  };

  const clearForm = () => {
    setHeader();
    setPrice({ value: 0 });
    setDescr({ value: ''});
    setSource({ value: '' });
    setCustomer();
    setStatus();
    setTemplate();
    setDetail([]);
    
  };

  const validateData = () => {
    let length = detail?.length;
      // let isDebit = false;
      let itemDescr = null;
      detail.forEach((item) => {
        if(item?.itemDescr ) {
          itemDescr = true;
        }
      });
    if(length && itemDescr){
      let journalID = header?.journalId ?? 0;
      let items = [];
      detail?.forEach(item => {
        // if(item?.qty){
          item.rowStatus = item?.journalItemId ? 'U' : 'I';
          items.push(item);
        // }
      })
      dItems?.forEach(it => items?.push({...it, rowStatus: 'D'}));
      return { journalID, txnDate: date?.value?.format('yyyy.MM.DD'), status: status?.value, templateID: template?.value,  //sourceType: source?.value,
      custID: customer?.value, totalAmt: price?.value, descr: descr?.value, rowStatus: journalID ? 'U' : 'I', items };
    } else {
      if(!length) setSearch({ value: null, error: t('account.items_error') });
      if(!itemDescr) setSearch({ value: null, error: "Тайлбар оруулна уу" });
      return false;
    }
  };

  const onClickSave = async () => {
    let data = validateData();
    if (data) {
      onLoad();
      const response = await dispatch( sendRequest(user, token, "Txn/ModJournal", data));
      if (response?.code === 1001) {
        onError(response?.error, true);
        setOpen(true);
      } else if (response?.error) onError(response?.error, true);
      else {
        onSuccess(t("journal.save_success"));
        onCancel();
      };
    }
  };


    const onClickDelete = async () => {
    onLoad();
    let data = {...header, rowStatus: 'D', items: []};
    const response = await dispatch(sendRequest(user, token, 'Txn/ModJournal', data));
    if(response?.error) onError(response?.error, true);
    else onSuccess(t('journal.delete_success'), true);
  }

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
  };

  const confirm = (sure) => {
    setOpen(false);
    setError(null);
    if (sure) setVisible(true);
  };
  let mainProps = { setError, setEdited, price, setPrice, loading, setLoading, setDetail, header, detail, 
      descr,  setDescr, source, setSource, setCustomer , customer, template, setTemplate, status, setStatus, date, setDate };
  let listProps = { detail, setDetail, search, setSearch, setEdited, setDItems, onClickDelete, setPrice};
  let btnProps = { onClickCancel, onClickSave, onClickDelete, header  };
  let subProps = { visible, setVisible, onDone, noTrial: true};
  let confirmProps = {open, text: t("adjust.confirm_pay"), confirm, text1: error};

  return (
    <div className='s_container_i' style={{maxWidth}}>
      <Overlay loading={loading}>
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
    </div>
  );
}
