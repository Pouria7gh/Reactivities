import { Link } from "react-router";
import type { Activity } from "../../../models/Activity";
import { format } from "date-fns";

import { CiCalendarDate, CiLocationOn } from "react-icons/ci";
import ActivityListItemAttendee from "./ActivityListItemAttendee";
import { observer } from "mobx-react-lite";

interface props {
  activity: Activity;
}

function ActivityListItem({ activity }: props) {
  return (
    <div className="card w-full bg-base-100 card-md inset-ring inset-ring-gray-300 shadow-lg mb-3">
      {activity.isCancelled &&
        <div className="text-center text-red-900 p-1 bg-error rounded-t-lg">Cancelled</div>}
      <div className="card-body">
        <div className="flex">
          <img
            src={activity.host?.image || "/assets/user.png" }
            alt="User"
            className="w-15 rounded-full me-4"
          />
          <div>
            <h2 className="card-title">{activity.title}</h2>
            <p className="inline me-1">
              Hosted by 
            </p>
            <Link className="inline-block text-blue-500" to={`/profiles/${activity.host?.username}`}>
              {activity.host?.displayName}
            </Link>
          </div>
        </div>
        <div className="flex justify-start">
          <span className="me-3">
            <CiCalendarDate className="inline text-lg text-indigo-800" />{" "}
            {format(activity.date!, "dd MMM yyyy h:mm aa")}
          </span>
          <span>
            <CiLocationOn className="inline-block text-lg text-indigo-800" />{" "}
            {activity.city}, {activity.venue}
          </span>
        </div>
        <div>
          <ActivityListItemAttendee attendees={activity.attendees} />
        </div>
        <p>{activity.description}</p>
        <div className="card-actions">
          {activity.isHost && (
            <div className="badge badge-lg badge-warning self-center">
              You are hosting
            </div>
          )}
          {activity.isGoing && !activity.isHost && (
            <div className="badge badge-lg badge-success self-center">
              You are going
            </div>
          )}
          <Link
            to={`/Activities/${activity.id}`}
            className="btn btn-primary ms-auto"
          >
            View
          </Link>
        </div>
      </div>
    </div>
  );
}

export default observer(ActivityListItem);
