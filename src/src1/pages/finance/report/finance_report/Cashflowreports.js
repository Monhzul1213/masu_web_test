import React, { useEffect, useState } from "react";
import { SizeMe } from "react-sizeme";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";

import CashFlowList from "../../../../components/finance/report/finance_report/CashFlowList";
import '../../../../css/finance.css';
import { sendRequest, getList } from "../../../../../services";

export function CashFlowReport() {
  const [data, setData] = useState();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [date, setDate] = useState([moment().startOf('month'), moment()]);
  const { user, token } = useSelector((state) => state.login);
  const dispatch = useDispatch();

  useEffect(() => {
    const query = {
      storedName: 'uspgl_ReportCashFlow_V2',
      moduleID: "IN",
      business: [
        { fieldName: "BeginDate", value: date[0]?.format("YYYY.MM.DD") },
        { fieldName: "EndDate", value: date[1]?.format("YYYY.MM.DD") }
      ]
    };
    getData(query);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getData = async (query) => {
    setLoading(true);
    setError(false);

    try {
      const configRes = await dispatch(getList(user, token, 'Merchant/GetConfig'));
      let logoBase64 = '';
      const file = configRes?.data?.fileRaw;

      if (file?.fileData && file?.fileType) {
        logoBase64 = `data:image/${file.fileType};base64,${file.fileData}`;
      }

      const response = await dispatch(sendRequest(user, token, 'Integration/ExecStrored', query));

      if (response?.error) {
        setError(response.error);
        setData(undefined);
      } else {
        const rawData = response?.data?.['#tmpBalance'] || [];
        const company = response?.data?.msMerchantConfig?.[0] || {};

        setData({
        data: rawData,
        header: {
        cmpName: company?.merchantName || '',
        director: company?.director || '',
        accountant: company?.accountant || '',
        merchanLogo: logoBase64,
        dateRange: `${query.business[0].value} - ${query.business[1].value}`
        }
      });

      }
    } catch (err) {
      setError(err);
    }

    setLoading(false);
  };

  const filterProps = { date, setDate, type: 'uspgl_ReportCashFlow_V2', onSearch: getData, loading, error };

  return (
    <div className="s_container_f">
      <SizeMe>
        {({ size }) => (
          <CashFlowList size={size} data={data} {...filterProps} />
        )}
      </SizeMe>
    </div>
  );
}

export default CashFlowReport;
