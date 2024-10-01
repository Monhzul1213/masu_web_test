import React from "react";
import CurrencyInput from "react-currency-input-field";
import InputMask from "react-input-mask";

export const EditableCell = (props) => {
  const { isText, value, disabled, placeholder, handleChange, index } = props;

  const onChange = (e) => {
    let value = e.target.value;
    handleChange(value, index);
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
  const { value, handleChange, placeholder, disabled, isText, error, index } =
    props;

  const onChange = (e) => {
    handleChange(e.target.value, index);
  };
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
