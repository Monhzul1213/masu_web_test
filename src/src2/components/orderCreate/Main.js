import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import { Date } from "../Date";
import { Select } from "../../../../src/components/all";
import { getList, getServiceBar } from "../../../../src/services";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";

export function Main(props) {
  const {
    setError,
    beginDate,
    setBeginDate,
    sites,
    setSites,
    custs,
    setCusts,
    error,
  } = props;

  const dispatch = useDispatch();
  const { t } = useTranslation();
  const { user, token } = useSelector((state) => state.login);
  const [sitesData, setSitesData] = useState([]);
  const [custData, setCustsData] = useState([]);

  useEffect(() => {
    getSites();
    getCusts();
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getSites = async () => {
    const response = await dispatch(getList(user, token, "Site/GetSite"));
    if (response?.error) {
      setError(response?.error);
      return false;
    } else {
      setSitesData(response?.data);
      let first = response?.data && response?.data[0];
      let siteID = first ? first?.siteId : false;
      return siteID;
    }
  };

  const getCusts = async () => {
    let headers = { CustID: -1 };
    const branch = await dispatch(getServiceBar("getBranchInfo"));
    let response = await dispatch(
      getList(user, token, "Site/GetCustomer", null, headers)
    );
    if (response?.error) setError(response?.error);
    else {
      response?.data?.customers?.forEach((el) => {
        let branchName = "";
        let subBranchName = "";
        branch?.data?.data?.forEach((item) => {
          if (el?.branchCode === item?.branchCode) {
            branchName = item?.branchName;
          }

          if (el?.subBranchCode === item?.subBranchCode) {
            subBranchName = item?.subBranchName;
          }
        });

        el.custName =
          el?.custName +
          " - " +
          el?.phone +
          "" +
          (branchName && " - " + branchName) +
          "" +
          (subBranchName && " - " + subBranchName);
      });
      setCustsData(response?.data?.customers);
    }
  };

  const onChangeDate1 = (value) => {
    setBeginDate(value);
  };

  const date1Props = {
    value: beginDate,
    setValue: onChangeDate1,
    label: t("orderCreate.date"),
    inRow: true,
    format: "yyyy.MM.DD",
  };
  const siteProps = {
    value: sites,
    setValue: setSites,
    label: t("orderCreate.site"),
    placeholder: t("orderCreate.site"),
    setError,
    error,
    length: 100,
    inRow: true,
    data: sitesData,
    itemBackgroundColor: true,
    s_value: "siteId",
    s_descr: "name",
  };

  const custProps = {
    value: custs,
    setValue: setCusts,
    label: t("orderCreate.custID"),
    placeholder: t("orderCreate.custID"),
    setError,
    length: 100,
    inRow: true,
    data: custData,
    itemBackgroundColor: true,
    s_value: "custId",
    s_descr: "custName",
  };

  return (
    <div className="">
      <div className="ac_row">
        <div style={{ display: "flex", flex: 1 }}>
          <Select {...siteProps} />
        </div>
        <div className="gap" />
        <div style={{ display: "flex", flex: 1, marginTop: 2 }}>
          <Date {...date1Props} />
        </div>
      </div>

      <div className="ac_row" style={{ marginBottom: 40 }}>
        <div style={{ display: "flex", flex: 1, marginTop: 20 }}>
          <Select {...custProps} />
        </div>
        {/* <div className="gap" /> */}
        {/* <MoneyInput {...amtProps} /> */}
      </div>
    </div>
  );
}
