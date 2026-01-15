import { Form, Formik } from "formik"
import AppTextInput from "../../common/forms/AppTextInput"
import AppSubmitButton from "../../common/forms/AppSubmitButton"
import { useStore } from "../../stores/Store"
import { observer } from "mobx-react-lite"
import { SlLogin } from "react-icons/sl"
import { MdOutlineMail } from "react-icons/md"
import { BsKey } from "react-icons/bs"
import { useNavigate } from "react-router"

function LoginForm() {
  const {userStore, modalStore} = useStore()
  const navigate = useNavigate();

  function handleSubmit(values:any, setErrors:any, setSubmitting:any) {
    userStore.login(values).then(() => {
      modalStore.closeModal();
      navigate("/Activities");
    }).catch(() => {
      setErrors({error: "Wrong username or password"});
    }).finally(() => {
      setSubmitting(false);
    });
  }

  return (
    <>
      <div className="flex flex-col items-center text-center">
        <div className="mb-3 text-blue-600 bg-base-200 shadow-sm inset-ring inset-ring-gray-200 p-3 rounded">
          <SlLogin />
        </div>
        <h1 className="text-2xl mb-3">Login with email</h1>
        <p className="text-sm text-gray-500 mb-3">Explore activities that is happening in your nighberhood</p>
      </div>
      <Formik initialValues={{email: "", password : "", error: null}} 
        onSubmit={(values, {setErrors , setSubmitting}) => 
          handleSubmit(values, setErrors, setSubmitting)}
      >
        {({isSubmitting , errors}) => (
          <Form>
            <AppTextInput
              name="email"
              label="Email :"
              placeholder="email..." 
              icon={<MdOutlineMail />}
            />
            <AppTextInput
              name="password"
              label="Password :"
              placeholder="password..."
              type="password"
              icon={<BsKey fontSize={16} />}
            />
            {errors.error && 
            <span className="text-sm block text-error">{errors.error}</span>}
            <AppSubmitButton isSubmitting={isSubmitting} text="Login" className="mt-6 me-2"/>
            <button type="button" className="btn btn-base mt-6" onClick={modalStore.closeModal}>Cancel</button>
          </Form>
        )}
      </Formik>
    </>
  )
}

export default observer(LoginForm)