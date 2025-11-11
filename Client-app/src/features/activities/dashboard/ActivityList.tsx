import type { Activity } from "../../../app/models/activity";

interface props {
  activities: Activity[];
  handleSelectActivity: (id: string) => void;
  deleteActivity: (id: string) => void;
}

function ActivityList({ activities, handleSelectActivity, deleteActivity } : props) {
  return (
    <ul className="list bg-base-100 rounded-box shadow-md">
      <li className="p-4 pb-2 text-xs opacity-60 tracking-wide">
        Most popular activities
      </li>
      {activities.map((activity) => (
        <li
          className="list-row inset-ring inset-ring-gray-300 shadow-lg mb-3"
          key={activity.id}
        >
          <div></div>

          <div>
            <div className="text-lg me-1">{activity.title}</div>

            <div className="text-sm uppercase text-blue-500 mb-3">
              {activity.date}
            </div>

            <div className="self-end text-base mb-4">
              {activity.description}
            </div>

            <div className="flex">
              <div className="badge badge-outline me-4 badge-primary text-base">
                {activity.category}
              </div>

              <div className="text-blue-500 flex items-center">
                {activity.city + ", " + activity.venue}
              </div>
            </div>
          </div>

          <div className="self-end flex align-end">
            <button className="btn btn-error me-1" onClick={() => deleteActivity(activity.id)}>Delete</button>
            <button className="btn btn-primary" onClick={() => handleSelectActivity(activity.id)}>View</button>
          </div>
        </li>
      ))}
    </ul>
  );
}

export default ActivityList;
