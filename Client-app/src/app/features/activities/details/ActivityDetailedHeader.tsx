import { Link } from "react-router";
import { format } from "date-fns";

import type { Activity } from "../../../models/Activity";
import { useStore } from "../../../stores/Store";
import { observer } from "mobx-react-lite";

interface props {
  activity: Activity;
}

function ActivityDetailedHeader({ activity }: props) {
  const {
    activityStore: {
      updateAttendance,
      updatingAttendance,
      cancelActivityToggle,
      cancelingActivity,
    },
  } = useStore();

  return (
    <>
      <div className="card image-full w-full shadow-sm rounded-none rounded-t-lg shadow-gray-300">
        <figure>
          <img
            src={`/assets/categoryImages/${activity.category}.jpg`}
            alt="Category"
            className="w-full"
          />
        </figure>
        {activity.isCancelled && (
          <div className="card-body">
            <div className="badge badge-error badge-lg">Cancelled</div>
          </div>
        )}
        <div className="card-body self-end gap-0 pb-3">
          <h2 className="card-title text-2xl">{activity.title}</h2>
          <p className="mb-2">{format(activity.date!, "dd MMM yyyy")}</p>
          <p>
            Hosted by{" "}
            <Link
              to={`/profiles/${activity.hostUsername}`}
              className="text-orange-300"
            >
              {activity.host?.displayName}
            </Link>
          </p>
        </div>
      </div>
      <div className="flex py-3 px-3 bg-base-200 rounded-b-lg mb-4 shadow-lg shadow-gray-300 inset-ring inset-ring-gray-300">
        {!activity!.isHost && (
          <button
            disabled={updatingAttendance || activity.isCancelled}
            onClick={updateAttendance}
            className={`btn btn-sm ${
              activity!.isGoing ? "btn-outline btn-error" : "btn-accent"
            }`}
          >
            {activity.isGoing && !updatingAttendance && "Cancel Attendance"}
            {!activity.isGoing && !updatingAttendance && "Join Activity"}
            {updatingAttendance && (
              <span
                className={`loading loading-sm ${
                  activity.isGoing ? "text-error" : "text-success"
                }`}
              ></span>
            )}
          </button>
        )}
        {activity!.isHost && (
          <>
            <button
              onClick={cancelActivityToggle}
              className={`btn btn-sm btn-outline ${
                activity.isCancelled ? "btn-success" : "btn-error"
              }`}
            >
              {!cancelingActivity && !activity.isCancelled && "Cancel Activity"}
              {!cancelingActivity && activity.isCancelled && "Re-activate"}
              {cancelingActivity && (
                <span
                  className={`loading loading-sm ${
                    activity.isCancelled ? "text-success" : "text-error"
                  }`}
                ></span>
              )}
            </button>
            <Link
              to={`/Manage/${activity.id}`}
              className={`btn btn-sm btn-warning ms-auto ${
                activity.isCancelled ? "btn-disabled" : ""
              }`}
            >
              Manage Event
            </Link>
          </>
        )}
      </div>
    </>
  );
}

export default observer(ActivityDetailedHeader);
