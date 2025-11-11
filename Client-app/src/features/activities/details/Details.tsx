import type { Activity } from "../../../app/models/activity";

interface props {
  activity: Activity;
  handleCancelSelectActivity: () => void;
  openForm: (id: string) => void;
}

function Details({ activity, handleCancelSelectActivity, openForm }: props) {
  return (
    <div className="card bg-base-100 w-full inset-ring inset-ring-gray-300 shadow-lg">
      <figure>
        <img
          src={`/assets/categoryImages/${activity.category}.jpg`}
          alt="category"
        />
      </figure>
      <div className="card-body">
        <h2 className="card-title">{activity.title}</h2>
        <p className="text-blue-500 mb-1">{activity.date}</p>
        <p>{activity.description}</p>
        <div className="card-actions justify-end">
          <button className="btn btn-error" onClick={handleCancelSelectActivity}>Cancel</button>
          <button className="btn btn-info" onClick={() => openForm(activity.id)}>Edit</button>
        </div>
      </div>
    </div>
  );
}

export default Details