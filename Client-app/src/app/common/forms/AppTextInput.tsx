import { useField } from "formik"

interface props {
  name: string;
  placeholder?: string;
  label?: string;
}

function AppTextInput(props: props) {
  const [field, meta] = useField(props.name);

  return (
    <fieldset className="fieldset">
        {props.label && 
          <legend className="fieldset-legend">{props.label}</legend>
        }
        <input type="text" {...field} {...props} className={`input w-full ${meta.error && meta.touched ? "input-error" : ""}`} placeholder={props.placeholder} />
        {meta.error && meta.touched &&
        <p className="label text-error">{meta.error}</p>}
    </fieldset>
  )
}

export default AppTextInput