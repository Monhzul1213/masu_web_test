import React, { useEffect, useState } from "react";
import { SizeMe } from "react-sizeme";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";

import IncomeList from "../../../../components/finance/report/finance_report/IncomeList";
import "../../../../css/finance.css";
import { sendRequest, getList } from "../../../../../services";

export function IncomeReport() {
  const [data, setData] = useState();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [date, setDate] = useState([moment().startOf("month"), moment()]);
  const { user, token } = useSelector((state) => state.login);
  const dispatch = useDispatch();

  useEffect(() => {
    const query = {
      storedName: "uspgl_ReportIncome",
      moduleID: "IN",
      business: [
        { fieldName: "PerPostBegin", value: date[0].format("YYYY.MM.DD") },
        { fieldName: "PerPostEnd", value: date[1].format("YYYY.MM.DD") },
        { fieldName: "IsDesignMode", value: "N" },
      ],
    };
    getData(query);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getData = async (query) => {
    setLoading(true);
    setError(false);

    try {
      const configRes = await dispatch(getList(user, token, "Merchant/GetConfig"));
      const file = configRes?.data?.fileRaw;
      const logoBase64 =
        file?.fileData && file?.fileType
          ? `data:image/${file.fileType};base64,${file.fileData}`
          : "";

      const response = await dispatch(sendRequest(user, token, "Integration/ExecStrored", query));

      const raw = response?.data?.["#tmpBalance"] || [];
      const company = response?.data?.msMerchantConfig?.[0] || {};

      setData({
        data: raw,
        header: {
          cmpName: company?.merchantName || "",
          director: company?.director || "",
          accountant: company?.accountant || "",
          merchanLogo: logoBase64,
          dateRange: `${query.business[0].value} - ${query.business[1].value}`,
        },
        retdesc: response?.retdesc || "",
      });
    } catch (err) {
      setError(err.message || err.toString());
      setData(undefined);
    }

    setLoading(false);
  };

  const filterProps = { date, setDate, type: "uspgl_ReportIncome", onSearch: getData, loading, error, };

  return (
    <div className="s_container_f">
      <SizeMe>
        {({ size }) => (
          <IncomeList size={size} data={data} {...filterProps} />
        )}
      </SizeMe>
    </div>
  );
}

export default IncomeReport;
