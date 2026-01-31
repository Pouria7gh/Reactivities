import { Field, Form, Formik } from "formik";
import { observer } from "mobx-react-lite"
import * as Yup from "yup";

import { useStore } from "../../../../stores/Store";
import type { CommentFormValues } from "../../../../models/CommentFormValues";

interface props {
    activityId: string;
}

function ChatForm({activityId}: props) {
    const {commentStore} = useStore();

    function handleSubmit(values:{body: string}, resetForm:any, setSubmitting:any) {
        const comment: CommentFormValues = {
            body : values.body.trim(),
            activityId: activityId
        };
        commentStore.sendComment(comment).finally(() => {
            setSubmitting(false);
            resetForm();
        });
    }

    const validationSchema = Yup.object({
        body: Yup.string().required()
    });

  return (
    <Formik 
        initialValues={{body: ""}}
        onSubmit={(values, {resetForm, setSubmitting}) => handleSubmit(values, resetForm, setSubmitting)}
        validationSchema={validationSchema}
    >
        {({isValid, handleSubmit}) => (
            <Form>
                <Field
                    as="textarea"
                    name="body"
                    className="input w-full min-h-20 overflow-x-hidden"
                    onKeyDown={(ev: any) => {
                        if (ev.key === "Enter" && ev.shiftKey) return;

                        if (ev.key === "Enter") {
                            ev.preventDefault();
                            isValid && handleSubmit();
                        }
                    }}
                />
            </Form>
        )}
    </Formik>
  )
}

export default observer(ChatForm)