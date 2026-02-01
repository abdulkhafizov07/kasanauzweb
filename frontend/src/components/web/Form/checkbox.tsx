import { CheckIcon } from 'lucide-react'
import React, { useState } from 'react'

interface CheckboxWidgetProps {
  htmlFor: string
  checked: boolean
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
  onSwitchOn?: (e: React.ChangeEvent<HTMLInputElement>) => void
  onSwitchOff?: (e: React.ChangeEvent<HTMLInputElement>) => void
}

const CheckboxWidget: React.FC<CheckboxWidgetProps> = (props) => {
  const [checked, setChecked] = useState(props.checked || false)

  return (
    <>
      <label htmlFor={props.htmlFor} className="cursor-pointer w-fit h-fit">
        <span
          className={
            'text-white w-3.5 h-3.5 flex items-center justify-center rounded-md border transition-all duration-100 ease-in ' +
            String(
              checked ? 'bg-brand border-brand' : 'bg-white border-tborder',
            )
          }
        >
          <CheckIcon size={16} />
        </span>
      </label>

      <input
        type="checkbox"
        className="hidden"
        checked={checked}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
          setChecked(e.target.checked)
          if (e.target.checked && props.onSwitchOn) {
            props.onSwitchOn(e)
          } else if (props.onSwitchOff) {
            props.onSwitchOff(e)
          }
        }}
        id={props.htmlFor}
      />
    </>
  )
}

export default CheckboxWidget
