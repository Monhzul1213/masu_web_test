import React, { useState, useEffect, useRef } from "react";
import "../../css/qr.css";
import qpayIcon from "../../assets/banks/Qpay.png";
import { useTranslation } from "react-i18next";
 
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
  const { t } = useTranslation();
 
  const numericAmount =
    Number(typeof amount === "object" ? amount.amount : amount) || 0;
 
  // const isDev = process.env.NODE_ENV === "development";
 
  const QPAY_MERCHANT = "fe7bde6b-f683-49ed-9325-157c54cdc0af";
  const QPAY_BEARER =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjbGllbnRfaWQiOiIxM2ExMTNlZC1iMmIwLTQzMjQtYmU5Yi0xZGFhYTY4ZDMyNDEiLCJzZXNzaW9uX2lkIjoiTFg5SDg1ZnU5LVF2cW9VMGFaaEFudEVrV0dZSWRqUHkiLCJ0ZXJtaW5hbF9pZCI6Ijk1MDAwMDU5IiwiaWF0IjoxNzMzMjg1MTc2LCJleHAiOjM0NjY2NTY3NTJ9.Fh3Nw-EK9D1glI25jTbNJKFu7qYjtbwASvZfFvpBpfA"; // ← танай bearer
  const QPAY_BASE = "https://qpay.mn";
 
  const API_BASE = "https://app.masu.mn:8082/";
  const API_AUTH = "20250722141616000AAAzaqbddsxSKJJCVd1";
 
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
      console.log("[PaymentOptions] customerInfo:", customerInfo);
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
      console.log( payload);

      const res = await fetch(`${QPAY_BASE}/v2/invoice`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${QPAY_BEARER}`,
        },
        body: JSON.stringify(payload),
      });
      console.log( res);

      const data = await res.json();
      if (data && data.qr_image) {
        setQpayQr(data.qr_image);
        setInvoiceId(data.id);
        setBankUrls(data.urls || []);
        startPolling(data.id);
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
      const res = await fetch(`${QPAY_BASE}/v2/invoice/${invoiceIdToCheck}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${QPAY_BEARER}`,
        },
      });
      const data = await res.json();

      if (data && data.invoice_status === "PAID") {
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
      console.log("[PaymentOptions] saveOrderToService salesPayload:", salesPayload);
     
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
      console.error("❌ Error saving order:", err);
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
 