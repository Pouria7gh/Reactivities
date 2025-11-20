import { Link } from "react-router"
import type { Activity } from "../../../models/activity"
import { useState, type SyntheticEvent } from "react";

import { useStore } from "../../../stores/Store";
import { CiCalendarDate, CiLocationOn } from "react-icons/ci";

interface props {
    activity: Activity
}

function ActivityListItem({ activity }: props) {
    const [target, setTarget] = useState("");
    const {activityStore} = useStore();
    const { deleteActivity, deleting } = activityStore;

    function handleDeleteActivity(ev: SyntheticEvent<HTMLButtonElement>, id: string) {
        setTarget(ev.currentTarget.name);
        deleteActivity(id);
    }

  return (
    <div className="card w-full bg-base-100 card-md inset-ring inset-ring-gray-300 shadow-lg mb-3">
    <div className="card-body">
        <div className="flex">
            <img src="/assets/user.png" alt="User" className="w-15 rounded-full me-4" />
            <div>
                <h2 className="card-title">{activity.title}</h2>
                <p>Hosted by Bob</p>
            </div>
        </div>
        <div className="flex justify-start">
            <span className="me-3"><CiCalendarDate className="inline text-lg text-indigo-800" /> {activity.date}</span>
            <span><CiLocationOn className="inline-block text-lg text-indigo-800" /> {activity.city}, {activity.venue}</span>
        </div>
        <div>
            attendies go here
        </div>
        <p>{activity.description}</p>
        <div className="justify-end card-actions">
            <button className="btn btn-error" name={activity.id} onClick={(ev) => { handleDeleteActivity(ev, activity.id) }}>
                { deleting && activity.id === target &&
                <span className="loading loading-spinner loading-xs"></span>}
                { activity.id !== target && "Delete"}
            </button>
            <Link to={`/Activities/${activity.id}`} className="btn btn-primary">View</Link>
        </div>
    </div>
    </div>
  )
}

export default ActivityListItem