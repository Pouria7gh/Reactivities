import { useField } from "formik"
import { cloneElement } from "react";

interface props {
  name: string;
  placeholder?: string;
  label?: string;
  type?: string;
  icon?: any;
}

function AppTextInput(props: props) {
  const [field, meta] = useField(props.name);

  return (
    <fieldset className="fieldset">
        {props.label && 
          <legend className="fieldset-legend">{props.label}</legend>
        }
        <label
          className={`input w-full 
            ${meta.error && meta.touched ? "input-error" : ""}
            ${!props.icon ? "px-0" : "pe-0"}
          `}
        >
          {props.icon &&
            cloneElement(props.icon, {
              className: "text-blue-600"
            })}
          <input
            {...field}
            {...props}
            placeholder={props.placeholder}
            autoComplete="off"
            className={!props.icon ? "px-3" : "px-1"}
          />
        </label>
        {meta.error && meta.touched &&
        <p className="label text-error">{meta.error}</p>}
    </fieldset>
  )
}

export default AppTextInput