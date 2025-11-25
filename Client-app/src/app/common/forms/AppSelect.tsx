import { useField } from "formik"

interface props {
  name: string;
  label?: string;
  options: {text: string, value: string}[]
  placeholder: string;
}

function AppSelect(props: props) {
  const [field, meta, helpers] = useField(props.name);

  return (
    <fieldset className="fieldset">
        {props.label && 
          <legend className="fieldset-legend">{props.label}</legend>
        }
        <select
            {...field}
            {...props}
            className={`select w-full ${meta.error && meta.touched ? "select-error" : ""}`}
            onBlur={() => helpers.setTouched(true)}
        >
            <option value="" disabled hidden>{props.placeholder}</option>
            {props.options.map(({text, value}) => (
                <option 
                    key={value}
                    id={value}
                    value={value}
                >
                    {text}
                </option>
            ))}
        </select>
        {meta.error && meta.touched &&
        <p className="label text-error">{meta.error}</p>}
    </fieldset>
  )
}

export default AppSelect