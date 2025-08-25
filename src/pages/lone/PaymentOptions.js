import React, { useState, useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import "../../css/qr.css";
import qpayIcon from "../../assets/banks/Qpay.png";
import { useTranslation } from "react-i18next";
import { qpayLogin } from "../../services/login.slice";
import { encrypt } from "../../helpers/encrypt";

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
}) {
  const dispatch = useDispatch();

  const BILL_DOMAIN = "https://app.masu.mn";
  const API_BASE = "https://app.masu.mn:8082/";
  const API_AUTH = "20250722141616000AAAzaqbddsxSKJJCVd1";
  const isDev = process.env.NODE_ENV === "development";
  const QPAY_MERCHANT = "fe7bde6b-f683-49ed-9325-157c54cdc0af";
  const QPAY_BASE = isDev ? "" : "https://qpay.mn";
  const QRQMENU_URL = "http://66.181.175.6:8083/Pos/QrQmenu";
  const QRQMENU_SECRET =
    "Ba*y^*^Y:t>B:d'<F(mc6w$F0|$|p2dk=N/AyO`{oyBe>,:&O(-}c~1NqV&t]1~";
  const [qpayQr, setQpayQr] = useState(null);
  const [polling, setPolling] = useState(false);
  const [bankUrls, setBankUrls] = useState([]);
  const [refNo, setRefNo] = useState(null);
  const [payView, setPayView] = useState("qr");
  const [siteMeta, setSiteMeta] = useState({
    bankCode: siteMetaFromParent?.bankCode ?? null,
    accountNumber: siteMetaFromParent?.accountNumber ?? null,
    accountName: siteMetaFromParent?.accountName ?? null,
    useQrMenu: siteMetaFromParent?.useQrMenu ?? null,
    loaded: !!siteMetaFromParent,
  });

  const pollingRef = useRef(null);
  const tokenRef = useRef(null);
  const savingRef = useRef(false);
  const billWindowRef = useRef(null);
  const { t } = useTranslation();

  const numericAmount =
    Number(typeof amount === "object" ? amount.amount : amount) || 0;

  useEffect(() => {
    setSiteMeta((prev) => ({
      ...prev,
      ...(siteMetaFromParent || {}),
      loaded: !!siteMetaFromParent,
    }));
  }, [siteMetaFromParent]);

  useEffect(() => () => stopPolling(), []);

  const buildBillUrl = (salesNo) => {
    const plain = `${Number(merchantId)}-${Number(siteId)}-${String(salesNo).trim()}`;
    const code = encrypt(plain);
    return `${BILL_DOMAIN}/Bill?billno=${encodeURIComponent(code)}`;
  };

  const openUrlSmart = (url, targetWindow = null) => {
    try {
      if (targetWindow && !targetWindow.closed) {
        targetWindow.location.href = url;
        return;
      }
    } catch (_) {}
    let w = null;
    try {
      w = window.open(url, "_blank", "noopener=yes");
    } catch {}

    if (!w || w.closed || typeof w.closed === "undefined") {
      const a = document.createElement("a");
      a.href = url;
      a.target = "_blank";
      a.rel = "noopener";
      a.style.display = "none";
      document.body.appendChild(a);
      a.click();
      a.remove();
    }
    setTimeout(() => {
      try {
        if (!w || w.closed) window.location.assign(url);
      } catch {
        window.location.assign(url);
      }
    }, 150);
  };

  const waitAndOpenBill = async (salesNo) => {
    const plain = `${Number(merchantId)}-${Number(siteId)}-${String(salesNo).trim()}`;
    const code = encrypt(plain);
    const endpoint = `${API_BASE}Sales/GetSalesBill?data=${encodeURIComponent(code)}`;
    const headers = { Accept: "application/json", authorization: API_AUTH };

    const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
    for (let i = 0; i < 60; i++) {
      try {
        const res = await fetch(endpoint, { headers });
        const text = await res.text();
        let json = null;
        try { json = JSON.parse(text); } catch {}
        const hasHeader = Array.isArray(json?.retdata?.sales) && json.retdata.sales.length > 0;
        if (res.ok && hasHeader) {
          const url = buildBillUrl(salesNo);
          openUrlSmart(url, billWindowRef.current || null);
          billWindowRef.current = null;
          return;
        }
      } catch {}
      await sleep(1000);
    }
    const url = buildBillUrl(salesNo);
    openUrlSmart(url, billWindowRef.current || null);
    billWindowRef.current = null;
  };

  const ensureQpayToken = async () => {
    const { error, token } = await dispatch(qpayLogin());
    if (error || !token) {
      throw new Error(error || t("payment.qpay_generic_error"));
    }
    tokenRef.current = token;
    return token;
  };

  const createQPayInvoice = async () => {
    try {
      if (!siteMeta.loaded) { alert(t("payment.loading_site_meta")); return; }
      if (siteMeta.useQrMenu && siteMeta.useQrMenu !== "Y") { alert(t("payment.qrmenu_not_enabled")); return; }

      const bankCode = String(siteMeta.bankCode || "").trim();
      const acctNumber = String(siteMeta.accountNumber || "").trim();
      const acctName = String(siteMeta.accountName || "").trim();
      if (!bankCode || !acctNumber) { alert(t("payment.missing_bank_settings")); return; }

      const bearer = await ensureQpayToken();

      const customerName =
        customerInfo?.type === "business" && customerInfo?.companyName
          ? customerInfo.companyName
          : customerInfo?.personName || acctName || `SITE_${siteId}`;

      const payload = {
        merchant_id: QPAY_MERCHANT,
        branch_code: "BRANCH_" + siteId,
        amount: numericAmount,
        currency: "MNT",
        customer_name: customerName,
        description: `POS ${siteId}`,
        bank_accounts: [
          {
            account_bank_code: bankCode,
            account_number: acctNumber,
            account_name: acctName || "",
            is_default: true,
          },
        ],
      };

      const res = await fetch(`${QPAY_BASE}/v2/invoice`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${bearer}` },
        body: JSON.stringify(payload),
      });

      const data = await res.json().catch(() => ({}));

      if (res.ok && (data?.qr_image || data?.qrcode_image)) {
        const qr = data.qr_image || data.qrcode_image;
        setQpayQr(qr);
        const urls = data.urls || data.qr_app_urls || [];
        setBankUrls(urls);
        setPayView(urls.length ? "apps" : "qr");
        startPolling(data.id || data.invoice_id);
      } else {
        alert(data?.message || t("payment.qpay_invoice_error"));
      }
    } catch {
      alert(t("payment.qpay_generic_error"));
    }
  };

  const checkQPayPayment = async (invoiceIdToCheck) => {
    try {
      const bearer = tokenRef.current || (await ensureQpayToken());
      const doFetch = (tk) =>
        fetch(`${QPAY_BASE}/v2/invoice/${invoiceIdToCheck}`, {
          method: "GET",
          headers: { Authorization: `Bearer ${tk}` },
        });

      let res = await doFetch(bearer);
      if (res.status === 401 || res.status === 403) {
        const refreshed = await ensureQpayToken();
        res = await doFetch(refreshed);
      }

      const data = await res.json().catch(() => ({}));
      if (data && (data.invoice_status === "PAID" || data.status === "PAID")) {
        stopPolling();
        const result = await saveOrderToService();
        if (!result?.refNo) return;

        setRefNo(result.refNo);
        if (result?.keys) { await fetchVatInfoFromQrQmenu(result.keys); }
        await waitAndOpenBill(result.refNo);
      }
    } catch {}
  };

  const startPolling = (invoiceIdParam) => {
    if (pollingRef.current) clearInterval(pollingRef.current);
    setPolling(true);
    pollingRef.current = setInterval(() => {
      checkQPayPayment(invoiceIdParam);
    }, 3000);
  };

  const stopPolling = () => {
    if (pollingRef.current) {
      clearInterval(pollingRef.current);
      pollingRef.current = null;
    }
    setPolling(false);
  };

  const saveOrderToService = async () => {
    try {
      if (savingRef.current) return null;
      savingRef.current = true;

      const CREATED_VERSION = "QR25.08.22";
      const toMoney = (v) => Number(Number(v || 0).toFixed(2));
      const toInt = (v) => parseInt(Number(v) || 0);

      const ticketBinID = toInt(ticketBinId);

      let resolvedPaymentTypeId = Number(paymentTypeId);
      if (!Number.isFinite(resolvedPaymentTypeId) || resolvedPaymentTypeId <= 0) {
        resolvedPaymentTypeId = 7;
      }

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

      const salesText = await salesRes.text();
      let salesResult = null;
      try { salesResult = JSON.parse(salesText); } catch {}

      if (!salesRes.ok) {
        alert(`AddSales HTTP ${salesRes.status}: ${salesText || "Unknown error"}`);
        savingRef.current = false;
        return null;
      }
      if (!salesResult || salesResult.rettype !== 0) {
        alert(salesResult?.retdesc || salesResult?.message || salesText || t("payment.save_order_error"));
        savingRef.current = false;
        return null;
      }

      const serverRef =
        salesResult?.retdata?.refNo ||
        salesResult?.retdata?.ticketNo ||
        salesResult?.retdata?.orderNo ||
        null;

      const serverKeys =
        salesResult?.retdata?.keys || salesResult?.retdata?.key || null;

      savingRef.current = false;
      return { refNo: serverRef, keys: serverKeys };
    } catch (err) {
      alert(err?.message || t("payment.save_order_error"));
      savingRef.current = false;
      return null;
    }
  };

  const fetchVatInfoFromQrQmenu = async (keys) => {
    try {
      if (!keys) throw new Error("AddSales-с 'keys' хоосон ирлээ");
      const encryptedAuth = encrypt(QRQMENU_SECRET);
      const formData = new FormData();
      formData.append("pText", String(keys));
      const res = await fetch(QRQMENU_URL, {
        method: "POST",
        headers: { authorization: encryptedAuth, Accept: "application/json" },
        body: formData,
      });
      const text = await res.text();
      let data = null;
      try { data = JSON.parse(text); } catch {}
      if (!res.ok) return false;
      return true;
    } catch {
      return false;
    }
  };

  return (
    <div className="payment_container">
      <button className="close_button" onClick={onClose}>×</button>

      {refNo ? (
        <div
          className="order_success"
          onClick={onSuccessClose}
          style={{
            cursor: "pointer",
            background: "#fff",
            width: "100%",
            minHeight: 300,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        />
      ) : (
        <>
          <p>{t("payment.pay")}</p>
          <div className="payment_amount">{numericAmount.toLocaleString()} ₮</div>

          {qpayQr ? (
            <div className="qpay_qr">
              <div className="pay_segment">
                <button
                  type="button"
                  className={`seg_btn ${payView === "qr" ? "active" : ""}`}
                  onClick={() => setPayView("qr")}
                >
                  {t("payment.tab_qr")}
                </button>
                <button
                  type="button"
                  className={`seg_btn ${payView === "apps" ? "active" : ""}`}
                  onClick={() => setPayView("apps")}
                >
                  {t("payment.tab_ib")}
                </button>
              </div>

              {payView === "qr" ? (
                <>
                  <p style={{ textAlign: "center", opacity: 0.8 }}>{t("payment.qr_hint")}</p>
                  <div className="qpay_qr_img_wrapper">
                    <img
                      src={`data:image/png;base64,${qpayQr}`}
                      alt={t("payment.qpay_qr_alt")}
                      className="qpay_qr_img"
                    />
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
                          rel="noopener"
                          className="bank_app_item"
                          title={bank.description || bank.name}
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

              {polling && (
                <p style={{ marginTop: 10, textAlign: "center" }}>
                  {t("payment.checking")}
                </p>
              )}
            </div>
          ) : (
            <div className="payment_methods">
              <div
                className={`payment_method ${siteMeta.loaded && siteMeta.useQrMenu === "N" ? "disabled" : ""}`}
                onClick={createQPayInvoice}
                title={siteMeta.loaded && siteMeta.useQrMenu === "N" ? t("payment.qrmenu_not_enabled") : t("payment.qpay_name")}
              >
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