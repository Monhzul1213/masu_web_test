import React, { useState, useEffect, useRef, useMemo } from "react";
import "../../css/qr.css";
import qpayIcon from "../../assets/banks/Qpay.png";
import { useTranslation } from "react-i18next";
import { encrypt, decrypt } from "../../helpers/encrypt";
import axios from "axios";
 
function PaymentOptions({
  amount = 0,
  onSuccessClose,
  onClose,
  merchantId,
  siteId,
  cart,
  ticketBinId,
  paymentTypeId,
  siteMetaFromParent,
  customerInfo,
  terminalId,
  onPaymentSuccess,
}) {
  const { t } = useTranslation();
  console.log(merchantId);

  const BILL_DOMAIN = "https://app.masu.mn";
  const API_BASE = "https://app.masu.mn:8082/";
  const API_AUTH = "20250722141616000AAAzaqbddsxSKJJCVd1";
  const MASU_BASE = "https://payment.app.masu.mn/Payment.asmx";
 
  const [qpayQr, setQpayQr] = useState(null);
  const [qpayQrUrl, setQpayQrUrl] = useState(null);
  const [qpayQrText, setQpayQrText] = useState(null);
  const [qpayInvoiceId, setQpayInvoiceId] = useState(null);
 
  const [bankUrls, setBankUrls] = useState([]);
  const [payView, setPayView] = useState("qr");
  const [polling, setPolling] = useState(false);
  const [showBlank, setShowBlank] = useState(false);
  const [siteMeta, setSiteMeta] = useState({
    bankCode: siteMetaFromParent?.bankCode ?? null,
    accountNumber: siteMetaFromParent?.accountNumber ?? null,
    accountName: siteMetaFromParent?.accountName ?? null,
    useQrMenu: siteMetaFromParent?.useQrMenu ?? null,
    terminalId: siteMetaFromParent?.terminalId ?? null,
    loaded: !!siteMetaFromParent,
  });
 
  const [masuSalesNo, setMasuSalesNo] = useState(null);
  const masuSalesNoRef = useRef(null);
  const qpayInvoiceIdRef = useRef(null);
  const pollingRef = useRef(null);
  const savingRef = useRef(false);
  const addSalesKeysRef = useRef(null);
 
  useEffect(() => { masuSalesNoRef.current = masuSalesNo; }, [masuSalesNo]);
  useEffect(() => { qpayInvoiceIdRef.current = qpayInvoiceId; }, [qpayInvoiceId]);
 
  const resolvedTerminalId = useMemo(() => {
    const pick = (v) => {
      const n = Number(v);
      return Number.isFinite(n) && n > 0 ? n : null;
    };
    return (
      pick(siteMetaFromParent?.terminalId) ??
      pick(siteMeta?.terminalId) ??
      pick(terminalId) ??
      pick(window?.__QRMENU__?.terminalId) ??
      pick(localStorage.getItem("qrmenu_terminalId")) ??
      0
    );
  }, [siteMetaFromParent?.terminalId, siteMeta?.terminalId, terminalId]);
 
  useEffect(() => {
    setSiteMeta((prev) => ({
      ...prev,
      ...(siteMetaFromParent || {}),
      terminalId: siteMetaFromParent?.terminalId ?? prev.terminalId ?? null,
      loaded: !!siteMetaFromParent,
    }));
    if (siteMetaFromParent?.terminalId) {
      try { localStorage.setItem("qrmenu_terminalId", String(siteMetaFromParent.terminalId)); } catch {}
    }
  }, [siteMetaFromParent]);
 
  useEffect(() => () => stopPolling(), []);
 
  const numericAmount =
    Number(typeof amount === "object" ? amount.amount : amount) || 0;
 
  const buildBillUrl = (salesNo) => {
    const plain = `${Number(merchantId)}-${Number(siteId)}-${String(salesNo).trim()}`;
    const code = encrypt(plain);
    return `${BILL_DOMAIN}/Bill?billno=${encodeURIComponent(code)}`;
  };
 
  const fetchTextJson = async (res) => {
    const text = await res.text();
    let json = null;
    try { json = JSON.parse(text); } catch { json = { raw: text }; }
    return { text, json };
  };
 
  function fetchRetry(config, retries = 5) {
  return axios(config)
    .then(res => {
      console.log(res);
      return res?.data;
    }).catch(error => {
      if(error?.message === 'Network Error' && retries > 0){
        console.log('retrying network', retries);
        return fetchRetry(config, retries - 1)
      }
      else return { result: 444, rettype: 444, message: error?.message, retdesc: error?.message };
    });
}
  const waitAndOpenBill = async (salesNo) => {
    const plain = `${Number(merchantId)}-${Number(siteId)}-${String(salesNo).trim()}`;
    const code = encrypt(plain);
    const endpoint = `${API_BASE}Sales/GetSalesBill?data=${encodeURIComponent(code)}`;
    const headers = { Accept: "application/json", authorization: API_AUTH };
    const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
    for (let i = 0; i < 60; i++) {
      try {
        const config = {
          url: endpoint,
          headers
        };
        // const res = await fetch(endpoint, { headers });
        const res = await fetchRetry(config);
        const { json } = await fetchTextJson(res);
        const hasHeader = Array.isArray(json?.retdata?.sales) && json.retdata.sales.length > 0;
        if (res.ok && hasHeader) {
          const url = buildBillUrl(salesNo);
          window.location.assign(url);
          return;
        }
      } catch {}
      await sleep(1000);
    }
    const url = buildBillUrl(salesNo);
    window.location.assign(url);
};
 
  const getFinalTotalForPayment = () => {
    const toMoney = (v) => Number(Number(v || 0).toFixed(2));
    const items = (cart || []).map((it) => toMoney((it.qty || 0) * (it.price || 0)));
    const itemsTotal = toMoney(items.reduce((a, b) => a + b, 0));
    return itemsTotal > 0 ? itemsTotal : toMoney(numericAmount);
  };
 
  const detectPaid = (raw) => {
    const d = Array.isArray(raw) ? raw[0] : raw || {};
    const s = (d?.invoice_status ?? d?.status ?? d?.payment_status ?? d?.state ?? "")
      .toString()
      .toUpperCase();
    if (["PAID", "PAYED", "SUCCESS", "CONFIRMED", "PAID_OK", "APPROVED", "DONE"].includes(s)) return true;
    if (Number(d?.payment_status_code) === 2) return true;
    if (Number(d?.status_code) === 2) return true;
    if (d?.paid === true || d?.is_paid === true) return true;
    const cnt = Number(d?.count); if (!Number.isNaN(cnt) && cnt > 0) return true;
    if (Array.isArray(d?.payments) && d.payments.length > 0) return true;
    return false;
  };
 
  const generateSalesNoAfter2023 = () => {
    const base = new Date("2023-01-01T00:00:00Z").getTime();
    const now = Date.now();
    return String(Math.max(now, base));
  };
 
  const saveOrderToService = async (overrideSalesNo) => {
    try {
      if (savingRef.current) return null;
      savingRef.current = true;
 
      const CREATED_VERSION = "QR25.08.22";
      const toMoney = (v) => Number(Number(v || 0).toFixed(2));
      const toInt = (v) => parseInt(Number(v) || 0);
 
      const ticketBinID = toInt(ticketBinId);
      let resolvedPaymentTypeId = Number(paymentTypeId);
      if (!Number.isFinite(resolvedPaymentTypeId) || resolvedPaymentTypeId <= 0) resolvedPaymentTypeId = 7;
 
      const salesItems = (cart || []).map((item, idx) => {
        const qty = toMoney(item.qty);
        const price = toMoney(item.price);
        const amount = toMoney(qty * price);
        return {
          lineNbr: idx + 1,
          invtID: item.invtId,
          qty,
          price,
          amount,
          serviceDescr: String(item.name || "").slice(0, 200),
        };
      });
 
      const itemsTotal = toMoney(salesItems.reduce((s, it) => s + (it.amount || 0), 0));
      const finalTotal = itemsTotal > 0 ? itemsTotal : toMoney(numericAmount);
 
      const derived = {
        custType: customerInfo?.type === "business" ? "business" : "individual",
        custReg: String(customerInfo?.regNo || ""),
        custName:
          customerInfo?.type === "business" && customerInfo?.companyName
            ? String(customerInfo.companyName)
            : String(customerInfo?.personName || ""),
        VatCustomerID: customerInfo?.type === "business" ? String(customerInfo?.regNo || "").trim() : "",
      };
 
      const payload = {
        merchantID: toInt(merchantId),
        siteID: toInt(siteId),
        SalesNo: String(overrideSalesNo),
        totalAmount: finalTotal,
        totalSalesAmount: finalTotal,
        ticketBinID,
        ticketDescr: "",
        CreatedVersion: CREATED_VERSION,
        ...derived,
        salesitems: salesItems,
        salespayments: [{ paymentTypeID: resolvedPaymentTypeId, paymentAmount: finalTotal }],
      };
 
      const headers = {
        "Content-Type": "application/json",
        Accept: "application/json",
        authorization: API_AUTH,
      };
      const salesRes = await fetch(`${API_BASE}Integration/AddSales`, {
        method: "POST",
        headers,
        body: JSON.stringify(payload),
      });
      const { text, json } = await fetchTextJson(salesRes);
 
      console.log(salesRes, payload, text, json, merchantId);
      if (!salesRes.ok) {
        alert(`AddSales HTTP ${salesRes.status}: ${text || "Unknown error"}`);
        savingRef.current = false;
        return null;
      }
      if (!json || json.rettype !== 0) {
        alert(json?.retdesc || json?.message || text || t("payment.save_order_error"));
        savingRef.current = false;
        return null;
      }
 
      const serverRef =
        json?.retdata?.refNo ||
        json?.retdata?.ticketNo ||
        json?.retdata?.orderNo ||
        String(overrideSalesNo);
      const serverKeys = json?.retdata?.keys || json?.retdata?.key || null;
 
      savingRef.current = false;
      return { refNo: serverRef, keys: serverKeys };
    } catch (err) {
      alert(err?.message || t("payment.save_order_error"));
      savingRef.current = false;
      return null;
    }
  };
 
  const doCallPayment = async (salesNo, amount) => {
    const dataStrPlain = `${Number(merchantId)}-${Number(siteId)}-${Number(resolvedTerminalId)}`;
    const dataStr = encrypt(dataStrPlain);
 
    const req = {
      paymentReq: {
        DataStr: dataStr,
        SalesNo: String(salesNo),
        PaymentTypeID: 7,
        Amount: amount,
      },
    };
 
    const res = await fetch(`${MASU_BASE}/callPaymentOut`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(req),
    });
    const { json } = await fetchTextJson(res);
    return { res, json };
  };
 
  const normalizeCallPaymentData = (json) => {
    const raw = json?.retdata ?? json;
    return Array.isArray(raw) ? raw[0] : raw || {};
  };
 
  const maybeGenerateQrFromText = async (qrText) => {
    try { require("qrcode.react"); return null; } catch {}
    try {
      const QRCode = (await import("qrcode")).default;
      const dataUrl = await QRCode.toDataURL(qrText, { margin: 2, scale: 6 });
      return dataUrl;
    } catch { return null; }
  };
 
const cleanBankUrls = (arr) => {
  const list = Array.isArray(arr) ? arr : [];
  const seen = new Set();
  return list
    .filter((x) => x && typeof x.link === "string" && x.link.trim())
    .filter((x) => {
      if (seen.has(x.link)) return false;
      seen.add(x.link);
      return true;
    })
    .map((x) => ({
      name: x.name || x.description || "Bank",
      description: x.description || x.name || "",
      logo: x.logo || "",
      link: x.link,
    }));
};
 
  const createQPayInvoice = async () => {
    try {
      let salesNo = masuSalesNoRef.current;
      if (!salesNo) {
        salesNo = generateSalesNoAfter2023();
        setMasuSalesNo(salesNo);
        masuSalesNoRef.current = salesNo;
      }
 
      const amountForPay = getFinalTotalForPayment();
      const { res, json } = await doCallPayment(salesNo, amountForPay);
 
      if (!res.ok) { alert(json?.retdesc || `callPaymentOut HTTP ${res.status}`); return; }
      if (typeof json?.rettype !== "undefined" && json.rettype !== 0) { alert(json?.retdesc || "callPaymentOut амжилтгүй."); return; }
 
      const data = normalizeCallPaymentData(json);
 
      setQpayInvoiceId(data?.invoice_id || null);
      qpayInvoiceIdRef.current = data?.invoice_id || null;
 
      let qrText = null;
      const qrB64 = data?.qr_image || data?.qrcode_image || null;
      if (qrB64) {
        setQpayQr(qrB64);
        setQpayQrUrl(null);
        setQpayQrText(null);
      } else {
        qrText = data?.qr_text || null;
        setQpayQr(null);
        setQpayQrText(qrText || null);
        setQpayQrUrl(qrText ? await maybeGenerateQrFromText(qrText) : null);
      }
      const urls = cleanBankUrls(data?.urls);
      setBankUrls(urls);
      setPayView(urls.length ? "apps" : "qr");
 
      await startPolling();
    } catch (e) {
      alert(e?.message || t("payment.qpay_generic_error"));
    }
  };
 
  const doCheckPayment = async (salesNo, amountForPay) => {
    const checkId = qpayInvoiceIdRef.current || "";
 
    const dataStrPlain = `${Number(merchantId)}-${Number(siteId)}-${Number(resolvedTerminalId)}`;
    const dataStr = encrypt(dataStrPlain);
 
    const req = {
      checkreq: {
        DataStr: dataStr,
        SalesNo: String(salesNo),
        PaymentTypeID: 7,
        Amount: amountForPay,
        CheckID: checkId,
      },
    };
 
    const res = await fetch(`${MASU_BASE}/checkPaymentOut`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(req),
    });
    console.log(res, 'checkPaymentOut');
    const { json } = await fetchTextJson(res);
    return { res, json };
  };
 
  const checkQPayPayment = async () => {
    const salesNo = masuSalesNoRef.current;
    if (!salesNo) return;
    if (!qpayInvoiceIdRef.current) return;
 
    const amountForPay = getFinalTotalForPayment();
    const { res, json } = await doCheckPayment(salesNo, amountForPay);
 
    if (!res.ok) return;
    if (typeof json?.rettype !== "undefined" && json.rettype !== 0) return;
 
    const data = json?.retdata ?? json;
 
    if (detectPaid(data)) {
      stopPolling();
      setShowBlank(true);
 
      const saved = await saveOrderToService(String(salesNo));
      console.log(saved, 'saved');
      if (saved?.keys) { addSalesKeysRef.current = saved.keys; try { await fetchVatInfoFromQrQmenu(saved.keys); } catch {} }
 
      try { onPaymentSuccess && onPaymentSuccess(String(salesNo)); } catch {}
      // await waitAndOpenBill(String(salesNo));
    }
  };
 
  const startPolling = async () => {
    if (pollingRef.current) return;
    if (!masuSalesNoRef.current) return;
    if (!qpayInvoiceIdRef.current) return;
 
    setPolling(true);
    pollingRef.current = setInterval(() => { checkQPayPayment(); }, 3000);
  };
 
  const stopPolling = () => {
    if (pollingRef.current) { clearInterval(pollingRef.current); pollingRef.current = null; }
    setPolling(false);
  };
 
  const QRQMENU_URL = "https://app.masu.mn:8082/Txn/QrQMenu";
  const QRQMENU_SECRET = "Ba*y^*^Y:t>B:d'<F(mc6w$F0|$|p2dk=N/AyO`{oyBe>,:&O(-}c~1NqV&t]1~";
 
  const fetchVatInfoFromQrQmenu = async (keys) => {
    console.log(keys, 'keyss');
    try {
      if (!keys) throw new Error("AddSales-с 'keys' хоосон ирлээ");
      const encryptedAuth = encrypt(QRQMENU_SECRET);
      const formData = new FormData();
      formData.append("pText", String(keys));
      const decrypted = decrypt(decodeURIComponent(keys));
      const parts = decrypted.split("-");
      console.log(decrypted, parts, 'decrypted');
      const res = await fetch(QRQMENU_URL, {
        method: "POST",
        headers: { authorization: encryptedAuth, Accept: "application/json" },
        body: formData,
      });
      console.log(res, encryptedAuth, 'encryptedAuth');
      return res.ok;
    } catch { return false; }
  };
 
  let QRCanvas = null;
  try { QRCanvas = require("qrcode.react").QRCodeCanvas || null; } catch {}
 
  return (
    <div className="payment_container">
      <button className="close_button" onClick={onClose}>×</button>
 
      {showBlank ? (
        <div
          className="order_success"
          onClick={onSuccessClose}
          style={{ cursor: "pointer", background: "#fff", width: "100%", minHeight: 300, display: "flex", alignItems: "center", justifyContent: "center" }}
        />
      ) : (
        <>
          <p>{t("payment.pay")}</p>
          <div className="payment_amount">{numericAmount.toLocaleString()} ₮</div>
 
          {(qpayQr || qpayQrUrl || qpayQrText) ? (
            <div className="qpay_qr">
              <div className="pay_segment">
                <button type="button" className={`seg_btn ${payView === "qr" ? "active" : ""}`} onClick={() => setPayView("qr")}>{t("payment.tab_qr")}</button>
                <button type="button" className={`seg_btn ${payView === "apps" ? "active" : ""}`} onClick={() => setPayView("apps")}>{t("payment.tab_ib")}</button>
              </div>
 
              {payView === "qr" ? (
                <>
                  <p style={{ textAlign: "center", opacity: 0.8 }}>{t("payment.qr_hint")}</p>
                  <div className="qpay_qr_img_wrapper" style={{ textAlign: "center" }}>
                    {qpayQr && (
                      <img src={`data:image/png;base64,${qpayQr}`} alt={t("payment.qpay_qr_alt")} className="qpay_qr_img" />
                    )}
                    {!qpayQr && qpayQrUrl && (
                      <img src={qpayQrUrl} alt={t("payment.qpay_qr_alt")} className="qpay_qr_img" />
                    )}
                    {!qpayQr && !qpayQrUrl && qpayQrText && QRCanvas && (
                      <div style={{ display: "inline-block" }}>
                        <QRCanvas value={qpayQrText} size={220} includeMargin />
                      </div>
                    )}
                    {!qpayQr && !qpayQrUrl && qpayQrText && !QRCanvas && (
                      <div style={{ fontSize: 12, wordBreak: "break-all", opacity: 0.7 }}>{qpayQrText}</div>
                    )}
                  </div>
                </>
              ) : (
                <>
                  <p style={{ textAlign: "center", opacity: 0.8 }}>{t("payment.app_hint")}</p>
                  {bankUrls.length > 0 ? (
                    <div className="bank_app_list">
                      {bankUrls.map((bank, idx) => (
                        <a
                          key={idx}
                          href={bank.link}
                          target="_blank"
                          rel="noopener noreferrer nofollow"
                          className="bank_app_item"
                          title={bank.description || bank.name}
                          aria-label={bank.description || bank.name}
                        >
                          {bank.logo ? <img src={bank.logo} alt={bank.name} /> : null}
                          <span>{bank.description || bank.name}</span>
                        </a>
                      ))}
                    </div>
                  ) : (
                    <div style={{ textAlign: "center", fontSize: 14, opacity: 0.7 }}>
                      {t("payment.bank_list_empty")}
                    </div>
                  )}
                </>
              )}
              {polling && (<p style={{ marginTop: 10, textAlign: "center" }}>{t("payment.checking")}</p>)}
              {merchantId}
            </div>
          ) : (
            <div className="payment_methods">
              <div className="payment_method" onClick={createQPayInvoice} title={t("payment.qpay_name")}>
                <img src={qpayIcon} alt={t("payment.qpay_name")} className="method_icon_img" />
                <div className="method_name">{t("payment.qpay_name")}</div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
 
export default PaymentOptions;