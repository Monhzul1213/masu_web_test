import React, { useEffect, useState } from "react";
import { SizeMe } from "react-sizeme";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";
import { FinanceList } from "../../../../components/finance/report/finance_report/FinanceList";
import '../../../../css/finance.css';
import { sendRequest,getList } from "../../../../../services";

export function FinanceStatement() {
  const [data, setFinanceData] = useState();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [date, setDate] = useState([moment().startOf('month'), moment()]);
  const { user, token } = useSelector((state) => state.login);
  const dispatch = useDispatch();
  useEffect(() => {
    const query = {
      storedName: 'uspgl_ReportBalance',
      moduleID: "IN",
      business: [
        { fieldName: "BeginDate", value: date[0]?.format('yyyy.MM.DD') },
        { fieldName: "EndDate", value: date[1]?.format('yyyy.MM.DD') }
      ]
    };
    getData(query);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  
const getData = async (query) => {
  setError(null);
  setLoading(true);
  const configRes = await dispatch(getList(user, token, 'Merchant/GetConfig'));
  let logoBase64 = '';

  if (configRes?.data?.fileRaw?.fileData && configRes?.data?.fileRaw?.fileType) {
    logoBase64 = `data:image/${configRes.data.fileRaw.fileType};base64,${configRes.data.fileRaw.fileData}`;
  }
  const response = await dispatch(sendRequest(user, token, 'Integration/ExecStrored', {
    ...query,
    storedName: 'uspgl_ReportBalance'
  }));
  if (response?.error) {
    setError(response.error);
    setFinanceData(undefined);
  } else {
    const balanceRows = response?.data?.['#tmpBalance'] || [];
    const company = response?.data?.msMerchantConfig?.[0] || {};
    const formatted = balanceRows.map((row) => {
      const beginBalance = +row.beginBalance ;
      const endBalance = +row.endBalance ;
      return {
        ...row,
        isBold: row.isBold === 'Y',
        propertyDescr: row.propertyDescr || '',
        lineColumn: row.lineColumn || '',        
        beginBalance,
        endBalance, 
      };
    });
    setFinanceData({
      newData: formatted,
      header: {
        cmpName: company?.merchantName || '',
        director: company?.director || '',
        accountant: company?.accountant || '',
        reportDate: company?.reportDate || '',
        cpnyID: company?.cpnyID || '',
        endPerYear: company?.endPerYear || '',
        ehnii: company?.ehnii || '',
        etssiin: company?.etssiin || '',
        dateRange: `${date[0].format('YYYY.MM.DD')} - ${date[1].format('YYYY.MM.DD')}`,
        merchanLogo: logoBase64
      }
    });
  }
  setLoading(false);
};
  const filterProps = {
    date,
    setDate,
    type: 'uspgl_ReportBalance',
    onSearch: getData,
    loading,
    error
  };
  return (
    <div className="s_container_f">
      <SizeMe>
        {({ size }) => (
          <FinanceList size={size} data={data} {...filterProps} />
        )}
      </SizeMe>
    </div>
  );
}
