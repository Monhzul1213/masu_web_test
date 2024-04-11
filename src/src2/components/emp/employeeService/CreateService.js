import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useTable, usePagination, useRowSelect, useSortBy } from "react-table";

import { Check, Table, Money } from "../../../../src1/components/all/all_m";
import { EmployeeServiceModal } from "./EmployeeServiceModal";
import { getList } from "../../../../services";
import { useDispatch, useSelector } from "react-redux";

export function CreateService(props) {
  const { data, setData, setShow, checked, setChecked } = props;
  const { user, token } = useSelector((state) => state.login);
  const { t, i18n } = useTranslation();
  const [visible, setVisible] = useState(false);
  const [columns, setColumns] = useState([]);
  const [serviceData, setServiceData] = useState([]);
  const dispatch = useDispatch();
  const [error, setError] = useState(null);

  useEffect(() => {
    const customStyle = { width: 40 };
    const style = {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    };
    setColumns([
      {
        id: "check",
        noSort: true,
        isBtn: true,
        customStyle,
        Header: ({ onClickCheckAll, checked }) => (
          <div style={style}>
            <Check checked={checked} onClick={onClickCheckAll} />
          </div>
        ),
        Cell: ({ row, onClickCheck }) => (
          <div style={style}>
            <Check
              checked={row?.original?.checked}
              onClick={(e) => onClickCheck(e, row)}
            />
          </div>
        ),
      },
      {
        Header: <div>{t("employeeService.serviceName")}</div>,
        accessor: "serviceDescr",
      },
      {
        Header: <div>{t("employeeService.invtName")}</div>,
        accessor: "invtId",
      },
      {
        Header: (
          <div style={{ textAlign: "right" }}>{t("employeeService.price")}</div>
        ),
        accessor: "price",
        Cell: (props) => (
          <div style={{ textAlign: "right" }}>
            <Money value={props.value ? props.value : 0} fontSize={13} currency='₮' /> 
          </div>
        ),
      },
    ]);
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [i18n?.language]);

  const onClickCheckAll = (e) => {
    setShow(!checked);
    setChecked(!checked);
    setData((old) =>
      old.map((row, index) => {
        return { ...old[index], checked: !checked };
      })
    );
  };

  const onClickCheck = (e, item) => {
    e?.preventDefault();
    setChecked(false);
    let count = false;
    setData((old) =>
      old.map((row, index) => {
        if (index === item?.index) {
          if (!row?.checked) count = true;
          return { ...old[item?.index], checked: !row?.checked };
        } else {
          if (row?.checked) count = true;
          return row;
        }
      })
    );
    setShow(count);
  };

  const onClickLink = async (row) => {
    setVisible(true);
    let api = `Employee/GetEmployeeService?SiteID=${row?.original?.siteId}&EmpCode=${row?.original?.empCode}`;
    const response = await dispatch(getList(user, token, api));
    if (response?.error) setError(response?.error);
    else setServiceData(response?.data?.employeeservice);
  };

  const tableInstance = useTable(
    {
      columns,
      data,
      autoResetPage: false,
      initialState: {
        pageIndex: 0,
        pageSize: 25,
        sortBy: [{ id: "invtId", asc: true }],
      },
      onClickCheckAll,
      checked,
      onClickCheck,
      onClickLink,
    },
    useSortBy,
    usePagination,
    useRowSelect
  );
  const tableProps = { tableInstance, onClickLink, error };

  return (
    <div>
      {visible && <EmployeeServiceModal data={serviceData} />}

      <div className="table_scroll" id="paging">
        <Table {...tableProps} />
      </div>
      {/* <PaginationTable {...tableProps} /> */}
    </div>
  );
}
