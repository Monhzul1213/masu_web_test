import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useTable, usePagination, useRowSelect, useSortBy } from "react-table";
import { useDispatch, useSelector } from "react-redux";

import { getList } from "../../services";
import { PaginationTable, Table } from "../../components/all";
import { EmployeeServiceModal } from "./emp/employeeService/EmployeeServiceModal";

export function List(props) {
  const {
    data,
    setData,
    setShow,
    checked,
    setChecked,
    setDialagClose,
    dialogClose,
  } = props;
  const { user, token } = useSelector((state) => state.login);
  const { t, i18n } = useTranslation();
  const [visible, setVisible] = useState(false);
  const [checked1, setChecked1] = useState(false);
  const [columns, setColumns] = useState([]);
  const [error, setError] = useState(null);
  const [serviceData, setServiceData] = useState([]);
  const [dialogDatamatch, setDialogDataMatch] = useState();
  const dispatch = useDispatch();

  useEffect(() => {
    setColumns([
      {
        Header: <div>{t("employeeService.site")}</div>,
        accessor: "siteName",
        customStyle: { width: 150 },
      },
      {
        Header: <div>{t("employeeService.employee")}</div>,
        accessor: "empName",
        customStyle: { width: 100 },
      },

      {
        Header: (
          <div style={{ textAlign: "right" }}>
            {t("employeeService.serviceQty")}
          </div>
        ),
        accessor: "serviceCount",
        customStyle: { width: 80 },
        exLabel: t("employeeService.serviceQty"),
        Cell: (props) => (
          <div style={{ textAlign: "right", paddingRight: 15 }}>
            {props.value ? props.value : 0}
          </div>
        ),
      },

      {
        Header: (
          <div style={{ textAlign: "center" }}>
            {t("employeeService.serviceAdd")}
          </div>
        ),
        accessor: "employeeService.serviceAdd",
        noSort: true,
        isBtn: true,
        customStyle: { width: 110 },
        Cell: ({ value, row, onClickLink }) => {
          return (
            <div
              style={{ textAlign: "center" }}
              className="table_link"
              onClick={() => onClickLink(row)}
            >
              {t("employeeService.serviceAdd")}
            </div>
          );
        },
      },
    ]);
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [i18n?.language]);

  const onClickCheckAll = (e) => {
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
  };

  const onClickLink = async (row) => {
    setVisible(true);
    let api = `Employee/GetEmployeeService?SiteID=${row?.original?.siteId}&EmpCode=${row?.original?.empCode}`;
    const response = await dispatch(getList(user, token, api));
    if (response?.error) setError(response?.error);
    else {
      response?.data?.employeeservice?.forEach((item) => {
        if (item) {
          item.EmpCode = row?.original?.empCode;
        }
        if (item) {
          item.SiteID = row?.original?.siteId;
        }
        if (item?.serviceID > -1 && item?.status > 0) {
          item.checked = true;
        } else {
          item.checked = false;
        }
      });

      setServiceData(response?.data?.employeeservice);
      setDialogDataMatch("");
      setDialogDataMatch(response?.data?.employeeservice);
    }
  };

  const tableInstance = useTable(
    {
      columns,
      data,
      autoResetPage: false,
      initialState: {
        pageIndex: 0,
        pageSize: 25,
        sortBy: [
          { id: "siteName", asc: true },
          { id: "empName", asc: true },
        ],
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
  const tableProps = {
    tableInstance,
    initialState: {
      pageIndex: 0,
      pageSize: 25,
      sortBy: [{ id: "siteName", desc: true }],
    },
  };

  const modalChildProps = {
    checked: checked1,
    setChecked: setChecked1,
    data: serviceData,
    setData: setServiceData,
    setShow,
    setVisible,
    setDialagClose,
    dialogClose, error
  };

  return (
    <div>
      {visible && (
        <EmployeeServiceModal
          {...modalChildProps}
          visible={visible}
          dialogDatamatch={dialogDatamatch}
        />
      )}
      <div style={{ height: 20 }} />
      <div className="table_scroll" id="paging">
        <Table {...tableProps} />
      </div>
      <PaginationTable {...tableProps} />
    </div>
  );
}
