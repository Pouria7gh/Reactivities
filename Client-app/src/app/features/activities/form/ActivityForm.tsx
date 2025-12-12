import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router";
import { observer } from "mobx-react-lite";
import { Form, Formik } from 'formik';
import * as Yup from 'yup';
import { v4 as uuid } from 'uuid';

import { useStore } from "../../../stores/Store";
import { ActivityFormValues } from "../../../models/Activity";
import LoadingComponent from "../../../layout/LoadingComponent";
import AppTextInput from "../../../common/forms/AppTextInput";
import AppTextarea from "../../../common/forms/AppTextarea";
import AppSelect from "../../../common/forms/AppSelect";
import { categoryOptions } from "../../../common/options/categoryOptions";
import AppDateInput from "../../../common/forms/AppDateInput";
import AppSubmitButton from "../../../common/forms/AppSubmitButton";

function ActivityForm() {
  const navigate = useNavigate();
  const {activityStore} = useStore()
  const {id} = useParams();
  const [activity, setActivity] = useState<ActivityFormValues>(new ActivityFormValues());

  useEffect(() => {
    if(id) {
      activityStore.loadActivity(id).then(() => {
        if (activityStore.selectedActivity) {
          setActivity(new ActivityFormValues(activityStore.selectedActivity));
        }
      })
    }
  }, [id]);

  function handleFormSubmit(activity: ActivityFormValues) {
    if(activity.id) {
      activityStore.editActivity(activity).then(() => navigate(`/activities/${activity.id}`));
    } else {
      activity.id = uuid();
      activityStore.createActivity(activity).then(() => navigate(`/activities/${activity.id}`));
    }
  }

  if (activityStore.loadingInitial) return <LoadingComponent />

  var validation = Yup.object({
    title: Yup.string().required(),
    date: Yup.string().required(),
    description: Yup.string().required(),
    category: Yup.string().required(),
    city: Yup.string().required(),
    venue: Yup.string().required(),
  });
    
  return (
    <div className="container mx-auto grid grid-cols-12">
      <div className="col-span-8 col-start-3 shadow-lg p-5 my-5 bg-base-200 inset-ring inset-ring-gray-300 rounded">
        <Formik enableReinitialize validationSchema={validation} initialValues={activity} onSubmit={handleFormSubmit}>
          {({dirty , isSubmitting, isValid}) => (
            <Form>
              <AppTextInput name="title" label="Title" placeholder="title" />
              <AppDateInput
                name="date"
                label="Date"
                placeholderText="Date"
                timeCaption="time"
                showTimeSelect
                dateFormat="MMMM d, yyyy h:mm aa"
              />
              <AppTextarea rows={3} name="description" label="Description" placeholder="description" />
              <AppSelect options={categoryOptions} placeholder="Select Category" name="category" label="Category" />
              <AppTextInput name="city" label="Enter city" placeholder="City" />
              <AppTextInput name="venue" label="Enter venue" placeholder="Venue" />
              <AppSubmitButton
                text={activity.id ? "Edit" : "Create"}
                dirty={dirty}
                isValid={isValid}
                isSubmitting={isSubmitting}
                className="mt-2 me-2"
              />
              <Link
                to={id ? `/Activities/${id}` : '/Activities'}
                className="btn btn-error mt-2"
              >
                Cancel
              </Link>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}

export default observer(ActivityForm)