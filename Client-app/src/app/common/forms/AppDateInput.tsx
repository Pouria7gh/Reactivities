import { useField } from "formik";
import DatePicker from "react-datepicker";

interface props {
  name: string;
  label?: string;
  placeholderText?: string;
  showTimeSelect?: boolean;
  timeCaption?: string;
  dateFormat?: string;
}

function AppDateInput(props: props) {
    const [field, meta, helpers] = useField(props.name);
  return (
    <fieldset className="fieldset">
      {props.label && 
        <legend className="fieldset-legend">{props.label}</legend>
      }
      <DatePicker
        {...field}
        onChange={value => helpers.setValue(value)}
        selected={field.value}
        autoComplete="off"
        className={`input w-full ${meta.error ? 'input-error' : ''}`}
        placeholderText={props.placeholderText}
        showTimeSelect={props.showTimeSelect}
        timeCaption={props.timeCaption}
        dateFormat={props.dateFormat}
      />

      {meta.error && meta.touched &&
      <p className="label text-error">{meta.error}</p>}
    </fieldset>
  )
}

export default AppDateInput