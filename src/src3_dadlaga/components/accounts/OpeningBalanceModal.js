import React, { useEffect, useMemo, useState, useCallback, useRef } from "react";
import { Modal, Button, Space, message } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import moment from "moment";
import { createSearchParams, useNavigate } from "react-router-dom";

import "../../../css/order.css";
import "../../../css/invt.css";
import "../../css/tree.css";

import { getList } from "../../../services";
import { AccountTree, AccountAddModal } from "./index";
import { List2 } from "./List2";
import { Filter2 } from "./Filter2";
import { Empty1, Error1, Overlay } from "../../../components/all";
import { Subscription } from "../../../components/management/adjust/list";
import { Confirm } from "../../../components/all/Confirm";

const API_BASE = "https://app.masu.mn:8082";
const joinUrl = (base, path) => `${base.replace(/\/+$/, "")}/${path.replace(/^\/+/, "")}`;

const toNumber = (v) => {
  if (v == null || v === "") return 0;
  if (typeof v === "number") return v;
  const n = Number(String(v).replace(/[,\s]/g, ""));
  return Number.isFinite(n) ? n : 0;
};

const isDebitFlag = (row) => {
  const v =
    row?.glAccount?.IsDebit ??
    row?.glAccount?.isDebit ??
    row?.IsDebit ??
    row?.isDebit ??
    null;
  if (typeof v === "boolean") return v;
  return String(v ?? "").toUpperCase() === "Y";
};

const pickDr = (r) => toNumber(r?.dtAmt ?? r?.drAmt ?? 0);
const pickCr = (r) => toNumber(r?.ctAmt ?? r?.crAmt ?? 0);
const pickJournalId = (r) => toNumber(r?.journalId ?? r?.journalID ?? r?.JournalId ?? 0);
const pickJournalItemId = (r) => toNumber(r?.journalItemId ?? r?.journalItemID ?? r?.JournalItemId ?? 0);

const normalizeRow = (a) => {
  let dt = toNumber(a.dtAmt ?? a.drAmt ?? 0);
  let ct = toNumber(a.ctAmt ?? a.crAmt ?? 0);
  const debit = isDebitFlag(a);
  let amt = a.amt != null ? toNumber(a.amt) : (debit ? dt : ct);
  if (!dt && !ct && amt) { if (debit) dt = amt; else ct = amt; }
  return {
    ...a,
    amt,
    dtAmt: dt,
    ctAmt: ct,
    journalId: pickJournalId(a),
    journalItemId: pickJournalItemId(a),
  };
};

const userKey = (u) =>
  String(u?.id ?? u?.userId ?? u?.userid ?? u?.UserID ?? u?.username ?? u?.email ?? "default");
const dateStorageKey = (u) => `openingBalance.balanceDate.${userKey(u)}`;

export function OpeningBalanceModal({ open, onClose }) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user, token } = useSelector((state) => state.login);

  const [data, setData] = useState([]);
  const [allAcct, setAllAcct] = useState([]);
  const [error, setError] = useState(null);
  const [treeData, setTreeData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = useState(false);
  const [openModal, setOpenModal] = useState(false);

  const [txnDate, setTxnDate] = useState(() => {
    try {
      const raw = localStorage.getItem(dateStorageKey({ ...(user || {}) }));
      if (raw) {
        const m = moment(raw, "YYYY-MM-DD", true);
        if (m.isValid()) return m;
      }
    } catch {}
    return moment();
  });

  const [edited, setEdited] = useState(false);
  const [showCloseConfirm, setShowCloseConfirm] = useState(false);

  const initialMapRef = useRef({});
  const initialDisplayDateSetRef = useRef(false);

  useEffect(() => {
    try {
      const val = txnDate ? moment(txnDate).format("YYYY-MM-DD") : moment().format("YYYY-MM-DD");
      localStorage.setItem(dateStorageKey(user), val);
    } catch {}
  }, [txnDate, user]);

  const convertToTreeData = (arr = []) => {
    if (!Array.isArray(arr)) return [];
    const map = {};
    arr.forEach((item) => {
      map[item.classId] = { key: String(item.classId), title: item.descr, children: [] };
    });
    const out = [];
    arr.forEach((item) => {
      const node = map[item.classId];
      if (item.parentId === "-1") out.push(node);
      else if (map[item.parentId]) map[item.parentId].children.push(node);
    });
    return out;
  };

  const buildKeyMap = useMemo(() => {
    return (nodes = []) => {
      const map = {};
      const walk = (n) => {
        if (!n) return;
        const k = String(n.key);
        map[k] = n;
        if (Array.isArray(n.children)) n.children.forEach(walk);
      };
      nodes.forEach(walk);
      return map;
    };
  }, []);

  const collectDescendantKeys = (rootKey, keyMap) => {
    const res = [];
    const seen = new Set();
    const dfs = (k) => {
      if (!k || seen.has(k)) return;
      seen.add(k);
      const node = keyMap[k];
      if (!node) return;
      res.push(k);
      if (Array.isArray(node.children)) node.children.forEach((c) => dfs(String(c.key)));
    };
    dfs(String(rootKey));
    return res;
  };

  const applyRowsToAll = useCallback((baseAll, rows) => {
    if (!Array.isArray(baseAll) || !Array.isArray(rows)) return baseAll || [];
    const map = new Map(baseAll.map((r) => [String(r.acct), r]));
    rows.forEach((r) => {
      const k = String(r.acct || "");
      if (!k) return;
      const old = map.get(k) || r;
      const dr = pickDr(r);
      const cr = pickCr(r);
      const debit = isDebitFlag(r);
      const amt = r.amt != null ? toNumber(r.amt) : (debit ? dr : cr);
      map.set(k, {
        ...old,
        dtAmt: dr,
        ctAmt: cr,
        amt,
        journalId: pickJournalId(r) || pickJournalId(old),
        journalItemId: pickJournalItemId(r) || pickJournalItemId(old),
      });
    });
    return Array.from(map.values());
  }, []);

  const setDataSynced = useCallback(
    (nextOrUpdater) => {
      setData((prev) => {
        const next = typeof nextOrUpdater === "function" ? nextOrUpdater(prev) : nextOrUpdater;
        setAllAcct((curr) => applyRowsToAll(curr, next));
        setEdited(true);
        return next;
      });
    },
    [applyRowsToAll]
  );

  const fetchInitial = useCallback(async () => {
    setError(null);
    setLoading(true);
    const response = await dispatch(getList(user, token, "Txn/GetAcctBalance"));
    if (response?.code === 1000) setVisible(true);
    if (response?.error) {
      setError(response?.error);
    } else if (response?.data) {
      const acctRaw = response?.data?.account ?? response?.data?.acct ?? [];
      const classes = response?.data?.acctclass ?? response?.data?.accclass ?? [];
      const acctbalance = response?.data?.acctbalance ?? [];
      const acct = Array.isArray(acctRaw)
        ? acctRaw.filter((a) => Number(a?.status ?? 1) === 1).map(normalizeRow)
        : [];
      const init = {};
      acct.forEach((r) => {
        if (!r?.acct) return;
        init[r.acct] = {
          dr: pickDr(r),
          cr: pickCr(r),
          journalId: pickJournalId(r),
          journalItemId: pickJournalItemId(r),
        };
      });
      initialMapRef.current = init;
      if (!initialDisplayDateSetRef.current && acctbalance.length && acctbalance[0].balanceDate) {
        const m = moment(acctbalance[0].balanceDate);
        if (m.isValid()) {
          setTxnDate(m);
          initialDisplayDateSetRef.current = true;
        }
      }
      setAllAcct(acct);
      setData(acct);
      setTreeData(convertToTreeData(classes));
      setEdited(false);
    }
    setLoading(false);
  }, [dispatch, user, token]);

  useEffect(() => {
    if (open && user?.msRole?.webFinance === "Y") {
      fetchInitial();
    }
    if (!open) {
      setData([]);
      setAllAcct([]);
      setTreeData([]);
      setError(null);
      setVisible(false);
      setOpenModal(false);
      setLoading(false);
      setEdited(false);
      setShowCloseConfirm(false);
    }
  }, [open, user?.msRole?.webFinance, fetchInitial]);

  const onNodeClick = (classId) => {
    const persisted = applyRowsToAll(allAcct, data);
    setAllAcct(persisted);
    if (classId === "0") {
      navigate({ search: "" });
      setData(persisted);
      return;
    }
    navigate({ search: createSearchParams({ classId }).toString() });
    const keyMap = buildKeyMap(treeData);
    const idsArr = collectDescendantKeys(String(classId), keyMap);
    const idSet = new Set(idsArr);
    const pickRowClassId = (row) =>
      String(row?.acctClassId ?? row?.acctClassID ?? row?.classId ?? row?.ClassId ?? row?.classid ?? "");
    const filtered = (persisted || []).filter((row) => idSet.has(pickRowClassId(row)));
    setData(filtered);
  };

  const onAmountChange = () => setEdited(true);

  const buildRowsForSubmit = useCallback(() => {
    const initial = initialMapRef.current || {};
    return (allAcct || []).map((r) => {
      const init = initial[r.acct] || {};
      return {
        acct: r.acct,
        drAmt: pickDr(r),
        crAmt: pickCr(r),
        journalItemId: pickJournalItemId(r) || init.journalItemId || 0,
        _journalId: pickJournalId(r) || init.journalId || 0,
      };
    });
  }, [allAcct]);

  const sumTotals = (rows) =>
    rows.reduce(
      (acc, r) => {
        acc.dr += toNumber(r.drAmt);
        acc.cr += toNumber(r.crAmt);
        return acc;
      },
      { dr: 0, cr: 0 }
    );

  const submitAll = async (rows, dateStr) => {
    const accounts = rows.map(({ _journalId, ...row }) => row);
    const ids = Array.from(new Set(rows.map(r => Number(r._journalId || 0))));
    const nonZero = ids.filter(x => x > 0);
    const headerJournalId =
      nonZero.length === 1 && ids.every(id => id === nonZero[0] || id === 0)
        ? nonZero[0]
        : 0;

    const payload = {
      journalId: headerJournalId,
      txnDate: dateStr,
      status: 1,
      accounts,
    };

    const res = await fetch(joinUrl(API_BASE, "/Txn/AddAcctBalance"), {
      method: "POST",
      headers: { "Content-Type": "application/json", authorization: token },
      body: JSON.stringify(payload),
    });
    let json = null; try { json = await res.json(); } catch {}
    if (!res.ok) throw new Error((json && (json.retmsg || json.message)) || `HTTP ${res.status}`);
    if (json?.rettype != null && json?.rettype !== 0) {
      throw new Error(json?.retdesc || json?.retmsg || "addacctbalance failed");
    }
  };

  const doSubmit = async () => {
    try {
      const m = txnDate ? moment(txnDate) : moment();
      if (!m.isValid()) {
        message.warning(t("date.invalid") || "Огноо буруу байна.");
        return;
      }
      const selectedDate = m.format("YYYY-MM-DD");
      const rows = buildRowsForSubmit();
      if (!rows.length) {
        message.success(t("account.openingBalanceSuccess") || "Амжилттай хадгаллаа.");
        setEdited(false);
        return;
      }
      const total = sumTotals(rows);
      const proceed = async () => {
        setLoading(true);
        try {
          await submitAll(rows, selectedDate);
          message.success(t("account.openingBalanceSuccess") || "Амжилттай хадгаллаа.");
          await fetchInitial();
          setEdited(false);
        } finally {
          setLoading(false);
        }
      };
      if (total.dr !== total.cr) {
        Modal.confirm({
          content: t("account.debitCreditNotEqualConfirm"),
          okText: t("page.yes"),
          cancelText: t("page.no"),
          okButtonProps: { style: { background: "var(--config-b-color)", border: "none" } },
          onOk: proceed,
        });
        return;
      }
      await proceed();
    } catch (e) {
      message.error(e?.message || String(e));
    }
  };

  const handleCancel = () => {
    if (showCloseConfirm) return;
    if (edited) setShowCloseConfirm(true);
    else onClose?.();
  };

  const handleConfirmClose = (ok) => {
    setShowCloseConfirm(false);
    if (ok) {
      setEdited(false);
      onClose?.();
    }
  };

  const listProps = { data, setData: setDataSynced, setOpenModal, onAmountChange };
  const subProps = { visible, setVisible, onDone: () => setVisible(false) };
  const treeProps = { treeData, onNodeClick };
  const modalProps = { openModal, setOpenModal, onSearch: fetchInitial };

  return (
    <>
      <Modal
        title={t("account.openingBalance")}
        open={open}
        onCancel={handleCancel}
        width="90%"
        destroyOnClose
        centered
        zIndex={1000}
        maskClosable={false}
        keyboard={false}
        afterClose={() => {}}
        footer={
          <Space wrap>
            <Button
              type="primary"
              htmlType="button"
              onClick={doSubmit}
              loading={loading}
              disabled={loading}
              style={{ background: "var(--config-b-color)", border: "none" }}
            >
              {t("account.submitOpening")}
            </Button>
          </Space>
        }
      >
        <div className="s_container_i" style={{ maxWidth: "100%", maxHeight: 500, overflowY: "auto" }}>
          {visible && <Subscription {...subProps} />}
          <Overlay loading={loading}>
            {error && <Error1 error={error} />}
            <section className="a_cont">
              <div className="a_tree_cont2" style={{ flex: "0 0 410px" }}>
                <div className="a_tree_header">
                  <h2 className="a_acctTitle">{t("account.acctClass")}</h2>
                </div>
                <div style={{ width: 300, minWidth: 260, maxWidth: 400 }}>
                  <AccountTree {...treeProps} />
                </div>
              </div>
              <div className="i_list_cont acc_list_cont2">
                <Filter2 value={txnDate} onChange={setTxnDate} size={{ width: 1200 }} />
                {!data?.length ? (
                  <Empty1 icon="MdOutlineArticle" />
                ) : (
                  <List2 {...listProps} size={{ width: 1200 }} height={655} />
                )}
              </div>
            </section>
          </Overlay>
          <AccountAddModal {...modalProps} />
        </div>
      </Modal>

      <Confirm
        open={showCloseConfirm}
        text="page.back_confirm"
        confirm={handleConfirmClose}
        getContainer={() => document.querySelector('.ant-modal-wrap') || document.body}
        zIndex={2000}
        maskClosable={false}
        keyboard={false}
      />
    </>
  );
}
