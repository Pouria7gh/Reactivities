
interface props {
  dirty?: boolean;
  isValid?: boolean;
  isSubmitting?: boolean;
  text: string;
  className?: string
}

function AppSubmitButton(props: props) {
  return (
    <button
      type="submit"
      className={`btn btn-success ${props.className}`}
      disabled={
        (props.dirty !== undefined ? !props.dirty : false) ||
        (props.isValid !== undefined ? !props.isValid : false) ||
        props.isSubmitting
      }
    >
      {props.isSubmitting && <span className="loading loading-sm text-success"></span>}
      {!props.isSubmitting && props.text}
    </button>
  )
}

export default AppSubmitButton