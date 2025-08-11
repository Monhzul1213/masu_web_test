import React, { useEffect, useState } from "react";
import { SizeMe } from "react-sizeme";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";
import { StockholdersEquity } from "../../../../components/finance/report/finance_report/StockholdersEquity";
import '../../../../css/finance.css';
import { sendRequest, getList } from "../../../../../services";

export function DailyReport() {
  const [data, setStckData] = useState();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [date, setDate] = useState([moment().startOf('month'), moment()]);
  const { user, token } = useSelector((state) => state.login);
  const dispatch = useDispatch();

  useEffect(() => {
    const query = {
      storedName: 'uspcm_ReportCommunicateDayCash',
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
  
    const response = await dispatch(sendRequest(user, token, 'Integration/ExecStrored', query));
  
    if (response?.error) {
      setError(response.error);
      setStckData(undefined);
    } else {
      const balanceRows = response?.data?.['#tmpBalance'] || [];
      const company = response?.data?.msMerchantConfig?.[0] || {};
  
      const formatted = balanceRows.map((row) => ({
        ...row,
        isBold: row.isBold === 'Y',
        isCenter: row.isCenter === 'Y',
        isUpper: row.isUpper === 'Y',
        propertyDescr: row.propertyDescr || '',
        amount1: +row.amount1 || 0,
        amount2: +row.amount2 || 0,
        amount3: +row.amount3 || 0,
        amount4: +row.amount4 || 0,
        amount5: +row.amount5 || 0,
        amount6: +row.amount6 || 0,
      }));
  
      setStckData({
        newData: formatted,
        header: {
          cmpName: company?.merchantName || '',
          director: company?.director || '',
          accountant: company?.accountant || '',
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
    type: 'uspcm_ReportCommunicateDayCash',
    onSearch: getData,
    loading,
    error
  };

  return (
    <div className="s_container_f" style={{ maxWidth: '297mm' }}>
      <SizeMe>
        {({ size }) => (
          <StockholdersEquity size={size} data={data} {...filterProps} />
        )}
      </SizeMe>
    </div>
  );
}
