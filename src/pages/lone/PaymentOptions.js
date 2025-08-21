import React, { useState, useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import "../../css/qr.css";
import qpayIcon from "../../assets/banks/Qpay.png";
import { useTranslation } from "react-i18next";
import { qpayLogin } from "../../services/login.slice";
 
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
 
  const [qpayQr, setQpayQr] = useState(null);
  const [invoiceId, setInvoiceId] = useState(null);
  const [polling, setPolling] = useState(false);
  const [bankUrls, setBankUrls] = useState([]);
  const [refNo, setRefNo] = useState(null);
 
  const [siteMeta, setSiteMeta] = useState({
    bankCode: siteMetaFromParent?.bankCode ?? null,
    accountNumber: siteMetaFromParent?.accountNumber ?? null,
    accountName: siteMetaFromParent?.accountName ?? null,
    useQrMenu: siteMetaFromParent?.useQrMenu ?? null,
    loaded: !!siteMetaFromParent,
  });
 
  useEffect(() => {
    if (siteMetaFromParent) {
      setSiteMeta({ ...siteMetaFromParent, loaded: true });
    }
  }, [siteMetaFromParent]);
 
  const pollingRef = useRef(null);
  const tokenRef = useRef(null);
  const { t } = useTranslation();
 
  const numericAmount =
    Number(typeof amount === "object" ? amount.amount : amount) || 0;
 
  const isDev = process.env.NODE_ENV === "development";
 
  const QPAY_MERCHANT = "fe7bde6b-f683-49ed-9325-157c54cdc0af";
  const QPAY_BASE = isDev ? "" : "https://qpay.mn";
 
  const API_BASE = "https://app.masu.mn:8082/";
  const API_AUTH = "20250722141616000AAAzaqbddsxSKJJCVd1";
 
  const ensureQpayToken = async () => {
    const { error, token } = await dispatch(qpayLogin());
    if (error || !token) throw new Error(error || "QPay token авахад алдаа гарлаа");
    tokenRef.current = token;
    return token;
  };
 
  const createQPayInvoice = async () => {
    try {
      if (!siteMeta.loaded) {
        alert(t("payment.loading_site_meta"));
        return;
      }
      if (siteMeta.useQrMenu && siteMeta.useQrMenu !== "Y") {
        alert(t("payment.qrmenu_not_enabled"));
        return;
      }
 
      const bankCode = String(siteMeta.bankCode || "").trim();
      const acctNumber = String(siteMeta.accountNumber || "").trim();
      const acctName = String(siteMeta.accountName || "").trim();
 
      if (!bankCode || !acctNumber) {
        alert(t("payment.missing_bank_settings"));
        return;
      }
 
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
        customer_logo: "",
        callback_url: "https://notify@test.mn/pay",
        description: `POS ${siteId}`,
        mcc_code: "",
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
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${bearer}`,
        },
        body: JSON.stringify(payload),
      });
 
      if (res.status === 401 || res.status === 403) {
        const refreshed = await ensureQpayToken();
        const retry = await fetch(`${QPAY_BASE}/v2/invoice`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${refreshed}`,
          },
          body: JSON.stringify(payload),
        });
        const retryData = await retry.json();
        if (retry.ok && (retryData?.qr_image || retryData?.qrcode_image)) {
          const qr = retryData.qr_image || retryData.qrcode_image;
          setQpayQr(qr);
          setInvoiceId(retryData.id || retryData.invoice_id);
          setBankUrls(retryData.urls || retryData.qr_app_urls || []);
          startPolling(retryData.id || retryData.invoice_id);
          return;
        }
        throw new Error(retryData?.message || "QPay invoice алдаа (retry)");
      }
 
      const data = await res.json();
      if (res.ok && data && (data.qr_image || data.qrcode_image)) {
        const qr = data.qr_image || data.qrcode_image;
        setQpayQr(qr);
        setInvoiceId(data.id || data.invoice_id);
        setBankUrls(data.urls || data.qr_app_urls || []);
        startPolling(data.id || data.invoice_id);
      } else {
        alert(data?.message || t("payment.qpay_invoice_error"));
      }
    } catch (error) {
      console.error("[PaymentOptions] createQPayInvoice error", error);
      alert(t("payment.qpay_generic_error"));
    }
  };
 
  const checkQPayPayment = async (invoiceIdToCheck) => {
    try {
      const bearer = tokenRef.current || (await ensureQpayToken());
      const doFetch = async (tk) =>
        fetch(`${QPAY_BASE}/v2/invoice/${invoiceIdToCheck}`, {
          method: "GET",
          headers: { Authorization: `Bearer ${tk}` },
        });
 
      let res = await doFetch(bearer);
      if (res.status === 401 || res.status === 403) {
        const refreshed = await ensureQpayToken();
        res = await doFetch(refreshed);
      }
 
      const data = await res.json();
      if (data && (data.invoice_status === "PAID" || data.status === "PAID")) {
        stopPolling();
        const ref = await saveOrderToService();
        if (ref) setRefNo(ref);
      }
    } catch (err) {
      console.warn("[PaymentOptions] checkQPayPayment error", err);
    }
  };
 
  const saveOrderToService = async () => {
    try {
      const ticketBinID = ticketBinId ? parseInt(ticketBinId) : 0;
      let resolvedPaymentTypeId = Number(paymentTypeId);
      if (!Number.isFinite(resolvedPaymentTypeId) || resolvedPaymentTypeId <= 0) {
        console.warn(
          "[PaymentOptions] paymentTypeId invalid -> fallback to 7",
          paymentTypeId
        );
        resolvedPaymentTypeId = 7;
      }
 
      const payloadCommon = {
        merchantID: parseInt(merchantId),
        siteID: parseInt(siteId),
        totalAmount: numericAmount,
        totalSalesAmount: numericAmount,
        ticketBinID,
        ticketDescr: "",
        custType: customerInfo?.type === "business" ? "business" : "individual",
        custReg: customerInfo?.regNo || "",
        custName:
          customerInfo?.type === "business" && customerInfo?.companyName
            ? customerInfo.companyName
            : customerInfo?.personName || "",
      };
     
      const salesItems = cart.map((item, idx) => ({
        lineNbr: idx + 1,
        invtID: item.invtId,
        qty: item.qty,
        price: item.price,
        amount: item.price * item.qty,
        serviceDescr: item.name,
      }));
 
      const headers = {
        "Content-Type": "application/json",
        authorization: API_AUTH,
      };
 
      const holdPayload = { ...payloadCommon, salesitemholds: salesItems };
      const holdRes = await fetch(`${API_BASE}Integration/AddSalesHold`, {
        method: "POST",
        headers,
        body: JSON.stringify(holdPayload),
      });
      const holdResult = await holdRes.json();
      if (holdResult.rettype !== 0 || !holdResult.retdata?.refNo) {
        alert(holdResult.retdesc || t("payment.save_order_error"));
        return null;
      }
      const refNo = holdResult.retdata.refNo;
     
      const salesPayload = {
        ...payloadCommon,
        ticketDescr: "",
        salesitems: salesItems,
        salespayments: [
          { paymentTypeID: resolvedPaymentTypeId, paymentAmount: numericAmount },
        ],
        refNo,
      };
     
      const salesRes = await fetch(`${API_BASE}Integration/AddSales`, {
        method: "POST",
        headers,
        body: JSON.stringify(salesPayload),
      });
      const salesResult = await salesRes.json();
      if (salesResult.rettype === 0) return refNo;
      alert(salesResult.retdesc || t("payment.save_order_error"));
      return null;
    } catch (err) {
      alert(t("payment.save_order_error"));
      return null;
    }
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
 
  useEffect(() => () => stopPolling(), []);
 
  return (
    <div className="payment_container">
      <button className="close_button" onClick={onClose}>×</button>
 
      {refNo ? (
        <div
          className="order_success"
          onClick={onSuccessClose}
          style={{ cursor: "pointer" }}
        >
          <p>{t("payment.order_number")}</p>
          <div className="order_box">{refNo}</div>
          <p style={{ marginTop: 20, fontSize: 14, color: "#555" }}>
            {t("payment.tap_to_return")}
          </p>
        </div>
      ) : (
        <>
          <p>{t("payment.pay")}</p>
          <div className="payment_amount">
            {numericAmount.toLocaleString()} ₮
          </div>
 
          {qpayQr ? (
            <div className="qpay_qr">
              <p>{t("payment.qr_label")}</p>
              <div className="qpay_qr_img_wrapper">
                <img
                  src={`data:image/png;base64,${qpayQr}`}
                  alt="QPay QR"
                  className="qpay_qr_img"
                />
              </div>
 
              {bankUrls.length > 0 && (
                <div className="bank_links">
                  <p>{t("payment.open_with_bank_app")}</p>
                  <div className="bank_app_list">
                    {bankUrls.map((bank, idx) => (
                      <a
                        key={idx}
                        href={bank.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bank_app_item"
                      >
                        <img src={bank.logo} alt={bank.name} />
                        <span>{bank.description || bank.name}</span>
                      </a>
                    ))}
                  </div>
                </div>
              )}
 
              {polling && (
                <p style={{ marginTop: 10 }}>{t("payment.checking")}</p>
              )}
            </div>
          ) : (
            <div className="payment_methods">
              <div
                className={`payment_method ${
                  siteMeta.loaded && siteMeta.useQrMenu === "N" ? "disabled" : ""
                }`}
                onClick={createQPayInvoice}
                title={
                  siteMeta.loaded && siteMeta.useQrMenu === "N"
                    ? t("payment.qrmenu_not_enabled") || "QR menu идэвхгүй"
                    : "QPay"
                }
              >
                <img src={qpayIcon} alt="QPay" className="method_icon_img" />
                <div className="method_name">QPay</div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
 
export default PaymentOptions;
 