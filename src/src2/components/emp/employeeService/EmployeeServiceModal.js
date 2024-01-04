import React, { useEffect, useState } from "react";
import { Modal, Steps, message } from "antd";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";

import "../../../../css/config.css";
import { siteSubscriptions1 } from "../../../../helpers";
import {
  ButtonRow,
  Error1,
  Overlay,
} from "../../../../src1/components/all/all_m";
import { getList, sendRequest } from "../../../../services";
import { CreateService } from "./CreateService";

export function EmployeeServiceModal(props) {
  const {
    visible,
    setVisible,
    site,
    onDone,
    data,
    setShow,
    setChecked,
    setDialagClose,
    dialogClose,
    dialogDatamatch,
  } = props;
  const [loading, setLoading] = useState(false);
  const [current, setCurrent] = useState(0);
  const [error, setError] = useState(null);
  const [selected, setSelected] = useState(null);
  const [amt, setAmt] = useState(0);
  const [txnNo, setTxnNo] = useState("");
  const [saved, setSaved] = useState(false);
  const { user, token } = useSelector((state) => state.login);
  const [serviceModData, setServiceModData] = useState();
  const [saveButton, setSaveButton] = useState(false);
  const [edited, setEdited] = useState(false);
  const dispatch = useDispatch();
  const { t } = useTranslation();

  useEffect(() => {
    let selected = siteSubscriptions1 && siteSubscriptions1[0];
    setSelected(selected);
    setAmt(selected?.amt);
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onSelect = (item) => {
    setSelected(item);
    setAmt(item?.amt);
  };

  const typeProps = { selected, onSelect, amt, site, setAmt, setError };

  const steps = [{ title: "Subscription", content: <Type {...typeProps} /> }];

  const onClickCancel = () => {
    setVisible(false);
  };

  const onLoad = () => {
    setError(null);
    setLoading(true);
    setEdited(false);
  };

  const onError = (err) => {
    setError(err);
    setLoading(false);
    setEdited(true);
  };

  const onSuccess = (msg) => {
    message.success(msg);
    setSaved(true);
    setLoading(false);
  };

  const onClickSave = async (e) => {
    const serviceData = [];
    dialogDatamatch.map((el, index) => {
      data.map((el1, index1) => {
        if (
          index === index1 &&
          el.checked != el1.checked &&
          el.serviceID == el1.serviceID
        ) {
          var rowStatusChange = "";
          if (el.checked == false && el1.checked == true) {
            rowStatusChange = "I";
          } else if (el.checked == true && el1.checked == false) {
            rowStatusChange = "D";
          }

          serviceData.push({
            siteID: el?.SiteID,
            empCode: el.EmpCode,
            serviceID: el.invtId,
            rowStatus: rowStatusChange,
          });
        }
      });
    });

    // console.log("..............................", serviceData);

    e?.preventDefault();
    onLoad();
    setLoading(true);
    const response = await dispatch(
      sendRequest(user, token, "Employee/ModEmployeeService", serviceData)
    );

    if (response?.error) onError(response?.error);
    else {
      onSuccess(t("employeeService.successMessage"));
      setVisible(false);
      setDialagClose(!dialogClose);
    }
  };

  const btnProps = { onClickCancel, onClickSave };

  return (
    <Modal
      title={null}
      footer={null}
      closable={false}
      open={visible}
      centered={true}
      width={640}
    >
      <Overlay loading={loading} className="m_back2">
        {/* <DynamicAIIcon className='dr_close' name='AiFillCloseCircle' onClick={onClose} /> */}
        <Steps current={current} items={steps} />
        <div>{steps[current]?.content}</div>
        <div className="gap" />
        {error && <Error1 error={error} />}
        <CreateService {...props} setEdited={setEdited} />
        <ButtonRow {...btnProps} />
      </Overlay>
    </Modal>
  );
}

function Type(props) {
  const { selected, onSelect, amt, site } = props;
  const { t } = useTranslation();

  return (
    <div className="es_scroll">
      <p className="es_title">{t("employeeService.serviceCreate")}</p>
    </div>
  );
}
