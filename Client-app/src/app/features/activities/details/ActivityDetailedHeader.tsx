import { Link } from "react-router";
import { format } from 'date-fns';

import type { Activity } from "../../../models/activity";

interface props {
    activity: Activity
}

function ActivityDetailedHeader({ activity }: props) {
  return (
    <>
    <div className="card image-full w-full shadow-sm rounded-none rounded-t-lg shadow-gray-300">
      <figure>
        <img
          src={`/assets/categoryImages/${activity.category}.jpg`}
          alt="Category"
        />
      </figure>
      <div className="card-body self-end gap-0 pb-3">
        <h2 className="card-title text-2xl">{ activity.title }</h2>
        <p className="mb-2">{ format(activity.date!, "dd MMM yyyy") }</p>
        <p>Hosted by Bob</p>
      </div>
    </div>
    <div className="flex py-3 px-3 bg-base-200 rounded-b-lg mb-4 shadow-lg shadow-gray-300 inset-ring inset-ring-gray-300">
        <button className="btn btn-sm btn-accent me-1">Join Activity</button>
        <button className="btn btn-sm me-auto">Cancel Attendance</button>
        <Link to={`/Manage/${activity.id}`} className="btn btn-sm btn-warning">Manage Event</Link>
    </div>
    </>
  );
}

export default ActivityDetailedHeader;
