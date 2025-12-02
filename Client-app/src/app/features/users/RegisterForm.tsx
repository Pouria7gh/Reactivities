import { Form, Formik } from "formik"
import AppTextInput from "../../common/forms/AppTextInput"
import AppSubmitButton from "../../common/forms/AppSubmitButton"
import { useStore } from "../../stores/Store"
import { observer } from "mobx-react-lite"
import { MdOutlineMail } from "react-icons/md"
import { BsKey } from "react-icons/bs"
import { CgProfile } from "react-icons/cg"
import { RiFileUserLine } from "react-icons/ri"
import { FaUsers } from "react-icons/fa"
import * as Yup from 'yup'

function RegisterForm() {
  const {userStore, modalStore} = useStore()

  return (
    <>
      <div className="flex flex-col items-center text-center">
        <div className="mb-3 text-blue-600 bg-base-200 shadow-sm inset-ring inset-ring-gray-200 p-3 rounded">
          <FaUsers className="text-xl" />
        </div>
        <h1 className="text-2xl mb-3">Sign up to Reactivities</h1>
        <p className="text-sm text-gray-500 mb-3">See what's happening around you</p>
      </div>
      <Formik initialValues={{email: "", displayName:"", username: "", password : ""}} 
        onSubmit={(values, {setErrors , setSubmitting}) => {
          userStore.register(values).catch((error) => {

            const errors: {key:string, value:string[]} = error.response.data.errors;
            const flatErrors = Object.fromEntries(
              Object.entries(errors).map(([k, v]) => {
                var lowerK = k.replace(k[0], k[0].toLocaleLowerCase())
                return [lowerK, v[0]]
              })
            );
            setErrors(flatErrors)
          }).then(() => {
            setSubmitting(false);
          });
        }}
        validationSchema={Yup.object({
            email: Yup.string().required(),
            displayName: Yup.string().required(),
            username: Yup.string().required(),
            password: Yup.string().required()
        })}
      >
        {({isSubmitting , dirty, isValid}) => (
          <Form>
            <AppTextInput
              name="email"
              label="Email :"
              placeholder="email..." 
              icon={<MdOutlineMail />}
            />
            <AppTextInput
              name="displayName"
              label="Display Name :"
              placeholder="display name..." 
              icon={<CgProfile />}
            />
            <AppTextInput
              name="username"
              label="Username :"
              placeholder="Username..." 
              icon={<RiFileUserLine />}
            />
            <AppTextInput
              name="password"
              label="Password :"
              placeholder="password..."
              type="password"
              icon={<BsKey fontSize={16} />}
            />
            <AppSubmitButton isSubmitting={isSubmitting} dirty={dirty} isValid={isValid} text="Register" className="mt-6 me-2"/>
            <button type="button" className="btn btn-base mt-6" onClick={modalStore.closeModal}>Cancel</button>
          </Form>
        )}
      </Formik>
    </>
  )
}

export default observer(RegisterForm)