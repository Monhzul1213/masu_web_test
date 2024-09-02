import React from "react";
import CurrencyInput from "react-currency-input-field";
import InputMask from "react-input-mask";

export const EditableCell = (props) => {
  const { isText, value, disabled, placeholder, handleChange } = props;

  const onChange = (e) => {
    let value = e.target.value;
    let sanitizedValue = value.replace(/[^0-9.]/g, "");
    let parts = sanitizedValue.split(".");
    if (parts.length > 2) {
      sanitizedValue = parts.shift() + "." + parts.join("");
    }
    handleChange(sanitizedValue);
  };
  const style = { textAlign: "left", width: 150 ? 150 - 5 : 100 };
  const qtyProps = {
    className: "ed_input",
    decimalsLimit: 2,
    value,
    maxLength: 15,
    onChange,
    allowNegativeValue: false,
    disableGroupSeparators: true,
    style,
    disabled: disabled,
    placeholder: placeholder,
  };

  return isText ? (
    <p className="ed_text" style={{ textAlign: "left", paddingRight: 15 }}>
      {value}
    </p>
  ) : (
    <CurrencyInput {...qtyProps} />
  );
};

export function EditableCellInput(props) {
  const { value, handleChange, placeholder, disabled, isText, error } =
    props;

  const onChange = (e) => {
    handleChange(e.target.value);
  };

  // const style = value?.error
  //   ? { borderColor: "#e41051", color: "#e41051", margin: "0" }
  //   : { margin: "0", backgroundColor: "transparent" };

  return (
    <div>
      {isText ? (
        <p>{value}</p>
      ) : (
        <InputMask
          className="ed_input"
          disabled={disabled}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
        />
      )}

      {error && <p className="f_input_error">{error}</p>}
    </div>
  );
}
