import React from "react";
// import { useTranslation } from "react-i18next";
// import moment from "moment";
import { ButtonRowAddConfirm } from "../../../components/all";

export function Filter(props) {
  const { size, onClickAdd, type } = props;
  // const { t } = useTranslation();

  // const [classH, setClassH] = useState("th_header1");
  // const [date, setDate] = useState([moment().startOf("month"), moment()]);

  // useEffect(() => {
  //   if (size?.width >= 870) setClassH("th_header1");
  //   else if (size?.width < 870 && size?.width >= 660) setClassH("th_header2");
  //   else setClassH("th_header3");
  //   return () => {};
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [size?.width]);

  // const onHide = () => {
  //   let query =
  //     "?BeginDate=" +
  //     date[0]?.format("yyyy.MM.DD") +
  //     "&EndDate=" +
  //     date[1]?.format("yyyy.MM.DD");
  //   onSearch(query);
  // };
  const id = size?.width > 870 ? "ih_large" : "ih_small";
  const addProps = { type, onClickAdd, show: false };
  // const dateProps = {
  //   label: t("page.date"),
  //   value: date,
  //   setValue: setDate,
  //   placeholder: t("time.select_date"),
  //   onHide: () => onHide(),
  //   className: "rh_date",
  // };

  return (
    <div className="ih_header" style={{ marginTop: 5 }} id={id}>
      <ButtonRowAddConfirm {...addProps} />
      {/* <div className={classH}>
        <PlainRange {...dateProps} />
      </div> */}
    </div>
  );
}
