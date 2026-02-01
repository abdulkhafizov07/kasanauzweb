import React, { useState } from "react";

interface SwitchWidgetProps {
  htmlFor: string;
  checked: boolean;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSwitchOn?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSwitchOff?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const SwitchWidget: React.FC<SwitchWidgetProps> = (props) => {
  const [checked, setChecked] = useState(props.checked || false);

  return (
    <>
      <label htmlFor={props.htmlFor} className="cursor-pointer w-fit h-fit">
        <div
          className={
            "relative switch-container w-[44px] h-[28px] rounded-full " +
            String(checked ? "bg-brand" : "bg-background")
          }
        >
          <div
            className={
              "switch-circle w-[22px] h-[22px] bg-white rounded-full absolute top-1/2 -translate-y-1/2 transition-all duration-300 " +
              String(
                checked ? "translate-x-[calc(100%-3px)] ease-in" : "translate-x-[3px] ease-out"
              )
            }
          ></div>
        </div>
      </label>

      <input
        type="checkbox"
        className="hidden"
        checked={checked}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
          setChecked(e.target.checked);
          if (e.target.checked && props.onSwitchOn) {
            props.onSwitchOn(e);
          } else if (props.onSwitchOff) {
            props.onSwitchOff(e);
          }
          if (props.onChange) {
            props.onChange(e);
          }
        }}
        id={props.htmlFor}
      />
    </>
  );
};

export default SwitchWidget;
