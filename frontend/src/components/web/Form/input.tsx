import { getPasswordStrengthScore } from "@/utils";
import React, { useState } from "react";

interface InputWidgetProps {
  htmlFor: string;
  label: string;
  placeholder: string;
  value: string | number;
  type?: string;
  nobg?: boolean;
  min?: number;
  max?: number;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string | undefined;
  disabled?: boolean;
}

const InputWidget: React.FC<InputWidgetProps> = (props) => {
  const [value, setValue] = useState(props.value || "");
  const [visibleStrengthbar, setVisibleStrengthbar] = useState(false);

  return (
    <>
      <div className="form-group w-full">
        {props.label && (
          <label
            htmlFor={props.htmlFor}
            className="block text-md font-normal text-text mb-1"
          >
            {props.label}
          </label>
        )}
        <input
          type={props.type || "text"}
          placeholder={props.placeholder}
          id={props.htmlFor}
          className={
            "block text-md font-normal placeholder-placeholder text-text border-2 focus:border-brand py-1.5 px-2 rounded-md outline-none w-full transition-all duration-200 ease-in" +
            (props.nobg ? "" : " bg-background") +
            (props.error ? " border-red-400" : " border-border")
          }
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
            if (props.onChange) props.onChange(e);
          }}
          min={props.min}
          max={props.max}
          disabled={props.disabled}
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="none"
          spellCheck="false"
          onFocus={() => setVisibleStrengthbar(true)}
          onBlur={() => setVisibleStrengthbar(false)}
        />
        {props.error && (
          <p className="mt-1 text-sm text-red-400">{props.error}</p>
        )}
        {props.type === "password" && (visibleStrengthbar || value) ? (
          <div className="mt-2 w-full h-1 bg-border rounded-lg overflow-hidden">
            <div
              style={{ width: getPasswordStrengthScore(String(value)) + "%" }}
              className={`h-full ${(function () {
                const v = getPasswordStrengthScore(String(value));
                if (v <= 40) return "bg-red-400";
                if (v <= 80) return "bg-yellow-400";
                return "bg-brand";
              })()} transition-all duration-300 ease-in`}
            ></div>
          </div>
        ) : (
          <></>
        )}
      </div>
    </>
  );
};

export default InputWidget;
