import { getPasswordStrengthScore } from "@/utils";
import React, { useState } from "react";

interface InputWidgetProps {
  htmlFor: string;
  label: string;
  placeholder: string;
  value: string;
  nobg?: boolean;
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  error?: string | undefined;
}

const TextareaWidget: React.FC<InputWidgetProps> = (props) => {
  const [value, setValue] = useState(props.value || "");

  return (
    <>
      <div className="form-group w-full">
        <label
          htmlFor={props.htmlFor}
          className="block text-md font-normal text-text mb-1"
        >
          {props.label}
        </label>
        <textarea
          placeholder={props.placeholder}
          id={props.htmlFor}
          rows={5}
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
        ></textarea>
        {props.error && (
          <p className="mt-1 text-sm text-red-400">{props.error}</p>
        )}
      </div>
    </>
  );
};

export default TextareaWidget;
