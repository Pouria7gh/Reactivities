import { useState, type ChangeEvent } from "react";
import type { Activity } from "../../../app/models/activity";

interface props {
  closeForm: () => void;
  activity?: Activity;
  createOrEditActivity: (activity: Activity) => void;
}

function ActivityForm({ closeForm, activity: selectedActivity, createOrEditActivity }: props) {

    const initialData = selectedActivity ?? {
        id: "",
        title: "",
        date: "",
        description: "",
        category: "",
        city: "",
        venue: "",
    }

    const [activity, setActivity] = useState(initialData);

    function handleChange(event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
        const {name, value} = event.target;
        setActivity({...activity, [name]: value});
    }

    function handleSubmit() {
        console.log(activity);
    }

  return (
    <fieldset className="fieldset bg-base-200 border-base-300 rounded-box w-full p-4 inset-ring inset-ring-gray-300 shadow-lg">
      <legend className="fieldset-legend">Edit Activity</legend>

      <label className="label">Title</label>
      <input
        type="text"
        className="input w-full"
        value={activity.title}
        name="title"
        onChange={handleChange}
        placeholder="Title ..."
        autoComplete="false"
      />

      <label className="label">Description</label>
      <textarea
        className="textarea w-full"
        placeholder="Description"
        value={activity.description}
        name="description"
        onChange={handleChange}
        autoComplete="false"
      ></textarea>

      <label className="label">Category</label>
      <input
        type="text"
        className="input w-full"
        value={activity.category}
        name="category"
        onChange={handleChange}
        placeholder="Category ..."
        autoComplete="false"
      />

      <label className="label">Date</label>
      <input
        type="text"
        className="input w-full"
        value={activity.date}
        name="date"
        onChange={handleChange}
        placeholder="Date ..."
        autoComplete="false"
      />

      <label className="label">City</label>
      <input
        type="text"
        className="input w-full"
        value={activity.city}
        name="city"
        onChange={handleChange}
        placeholder="City ..."
        autoComplete="false"
      />

      <label className="label">Venue</label>
      <input
        type="text"
        className="input w-full"
        value={activity.venue}
        name="venue"
        onChange={handleChange}
        placeholder="Venue ..."
        autoComplete="false"
      />

      <div className="flex justify-end">
        <button className="btn btn-error me-2" onClick={closeForm}>
          Cancel
        </button>
        <button className="btn btn-success" onClick={() => createOrEditActivity(activity)}>
          Submit
        </button>
      </div>
    </fieldset>
  );
}

export default ActivityForm