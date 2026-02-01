import React, { useState } from "react";
import InputMask from "react-input-mask";
import { formatPhone, phoneToNumber } from "@/utils";
import { useTranslation } from "react-i18next";

interface PhoneInputWidgetProps {
  htmlFor: string;
  value?: number;
  nobg?: boolean;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string | undefined;
}

const PhoneInputWidget: React.FC<PhoneInputWidgetProps> = ({
  htmlFor,
  value,
  nobg = false,
  onChange,
  error,
}) => {
  const [inputValue, setInputValue] = useState(
    value ? formatPhone(value || "") : null
  );
  const { t } = useTranslation();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);

    if (onChange) {
      const syntheticEvent = {
        ...e,
        target: {
          ...e.target,
          value: phoneToNumber(e.target.value),
        },
      };
      onChange(syntheticEvent as React.ChangeEvent<HTMLInputElement>);
    }
  };

  return (
    <div className="form-group">
      <label
        htmlFor={htmlFor}
        className="block text-md font-normal text-text mb-1"
      >
        {t("Phone number")}
      </label>

      <InputMask
        mask="+\9\9\8 (99) 999-99-99"
        value={inputValue}
        onChange={handleChange}
        maskChar={null}
        alwaysShowMask={false}
      >
        {(inputProps: any) => (
          <input
            {...inputProps}
            type="text"
            id={htmlFor}
            placeholder="+998 (99) 999-99-99"
            className={
              "block text-md font-normal placeholder-placeholder text-text border-2 focus:border-brand py-1.5 px-2 rounded-md outline-none w-full transition-all duration-200 ease-in" +
              (nobg ? "" : " bg-background") +
              (error ? " border-red-400" : " border-border")
            }
            maxLength={19}
          />
        )}
      </InputMask>
      {error && <p className="mt-1 text-sm text-red-400">{error}</p>}
    </div>
  );
};

export default PhoneInputWidget;
