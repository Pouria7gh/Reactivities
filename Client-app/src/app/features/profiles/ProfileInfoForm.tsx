import { Form, Formik } from "formik";
import { useStore } from "../../stores/Store";
import AppTextInput from "../../common/forms/AppTextInput";
import { observer } from "mobx-react-lite";
import * as Yup from "yup";
import AppTextarea from "../../common/forms/AppTextarea";
import AppSubmitButton from "../../common/forms/AppSubmitButton";
import type { ProfileFormValues } from "../../models/Profile";

interface props {
  className?: string;
  setEditMode?: any;
}

function ProfileInfoForm({className, setEditMode}: props) {
  const {profileStore: {profile, updateProfile}} = useStore();

  const initialValues = {
    displayName: profile?.displayName || "",
    bio: profile?.bio || ""
  }

  const validationSchema = Yup.object({
    displayName: Yup.string().min(2).max(100).required(),
    bio: Yup.string().max(300)
  })

  function handleSubmit(values: ProfileFormValues, setSubmitting: any) {
    updateProfile(values).then(() => {
      setSubmitting(false);
      if (setEditMode) setEditMode(false);
    });
  }

  return (
    <div className={className}>
      <Formik
        initialValues={initialValues}
        onSubmit={(values, {setSubmitting}) => handleSubmit(values, setSubmitting)}
        validationSchema={validationSchema}
      >
        {({dirty, isSubmitting, isValid}) => (
          <Form>
            <AppTextInput
              name="displayName"
              label="Name"
              placeholder="Enter your name"
            />
  
            <AppTextarea
              name="bio"
              label="Bio"
              rows={7}
              placeholder="Enter your bio"
            />

            <AppSubmitButton text="Submit" className="mt-2" dirty={dirty} isSubmitting={isSubmitting} isValid={isValid} />
          </Form>
        )}
      </Formik>
    </div>
  )
}

export default observer(ProfileInfoForm)