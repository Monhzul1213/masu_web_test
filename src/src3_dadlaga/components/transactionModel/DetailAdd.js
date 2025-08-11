import React, { useEffect, useState } from "react";
import { Select } from "antd";
import { CustomSelect, Overlay } from "../../../components/all";
import { SelectItem } from "../../../components/invt/inventory/add/SelectItem";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { getList } from "../../../services";
import { useSelector } from "react-redux";
import { useDebounce } from "../../../helpers";
const { Option } = Select;

export const DetailAdd = ({ addDetail, detail, search, setSearch }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { user, token } = useSelector((state) => state.login);
  const [items, setItems] = useState([]);
  // const [searchValue, setSearchValue] = useState();
  const [loading, setLoading] = useState(false);
  const [text, setText] = useDebounce();

  useEffect(() => {
    getData();
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  
  const getData = async () => {
    setLoading(true);
    setSearch({ value: null });
    let api = 'Txn/GetAccount' //[{ fieldName: "Name", value }, { fieldName: "SiteID", value: siteId?.value }, {fieldName : 'GetVariant', value : "Y"}];
    let response = await dispatch(getList(user, token, api ))
    if(response?.error) setSearch({ value: null, error: response?.error });
    else setItems(response?.data?.acct);
    setLoading(false);
  }

  const onSelect = ({ value }) => {
    const selectedItem = items?.filter((item) => item.accountId === value)[0];
    const exists = detail?.findIndex((item) => item.accountId === value);
    if (exists === -1) {
      const newItem = {
        accountId: selectedItem?.accountId,
        acct: selectedItem?.acctCode,
        acctName: selectedItem?.acctName,
        isDebit: selectedItem?.isDebit,
        formula: "",
        isNew: true,
      };
      addDetail(newItem);
      setSearch({ value: null, error: null });
    } else {
      setSearch({ value: null, error: "Энэ данс жагсаалтанд нэмэгдсэн байна" });
    }
  };

  const renderItem = (item, index) => {
    let optItem = {
      name: item?.acctName,
      sku: item?.acctCode,
    };
    return (
      <Option
        key={index}
        value={item.accountId}
        name={optItem?.name}
        sku={optItem?.sku}
      >
        <SelectItem label="Дансны дугаар" item={optItem} />
      </Option>
    );
  };

  const filterOption = (input, option) => {
    return (
      option?.name?.toLowerCase().indexOf(input.toLowerCase()) >= 0
    );
  };

  const selectProps = {
    value: search,
    setValue: onSelect,
    placeholder: t("account.search"),
    data: items,
    className: "kit_select",
    classBack: "kit_search",
    renderItem,
    onSearch : setText, text,
    onFocus: getData,
    filterOption,
    setData: setItems,
  };
  return (
    <Overlay loading={loading}>
      <CustomSelect {...selectProps} />
    </Overlay>
    // <div
    //   style={{
    //     display: "flex",
    //     margin: "15px 0",
    //     overflow: "scroll",
    //     width: "930px",
    //   }}
    // >
    //   <EditableCell
    //     placeholder="Дансны дугаар"
    //     value={templateDtl?.acct}
    //     handleChange={(value) => {
    //       handleTemplateDtl("acct", value);
    //     }}
    //   />
    //   <div style={{ width: "3%" }} />
    //   <EditableCellInput
    //     placeholder="Дансны нэр"
    //     value={templateDtl?.acctName}
    //     handleChange={(value) => {
    //       handleTemplateDtl("acctName", value);
    //     }}
    //   />
    //   <div style={{ width: "68px" }} />
    //   <Check
    //     checked={templateDtl.isDebit === 1}
    //     onClick={() => {
    //       templateDtl.isDebit === 0
    //         ? setTemplateDtl((prev) => ({ ...prev, isDebit: 1 }))
    //         : setTemplateDtl((prev) => ({ ...prev, isDebit: 0 }));
    //     }}
    //   />
    //   <div style={{ width: "62px" }} />
    //   <Check
    //     checked={templateDtl.isDebit === 0}
    //     onClick={() => {
    //       templateDtl.isDebit === 0
    //         ? setTemplateDtl((prev) => ({ ...prev, isDebit: 1 }))
    //         : setTemplateDtl((prev) => ({ ...prev, isDebit: 0 }));
    //     }}
    //   />
    //   <div style={{ width: "30px" }} />
    //   <EditableCellInput
    //     placeholder="Томьёо"
    //     value={templateDtl?.formula}
    //     handleChange={(value) => {
    //       handleTemplateDtl("formula", value);
    //     }}
    //   />
    //   <div style={{ width: "100px" }} />
    //   <IoIosAddCircle
    //     size={25}
    //     color="#4BAF4F"
    //     name="BsTrashFill"
    //     className="ac_delete"
    //     onClick={handleClick}
    //   />
    // </div>
  );
};
