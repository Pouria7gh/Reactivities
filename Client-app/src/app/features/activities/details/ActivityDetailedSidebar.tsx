import { observer } from "mobx-react-lite";
import type { Activity } from "../../../models/Activity";
import { Link } from "react-router";

interface props {
  activity: Activity;
}

function ActivityDetailedSideBar({activity : {attendees, host}}: props) {

  if (!attendees) return null;

  return (
    <div className="rounded-lg shadow-lg bg-base-200 shadow-gray-300 inset-ring inset-ring-gray-300">
      <div className="text-center rounded-t-lg bg-accent p-3 text-white">
        {attendees.length} {attendees.length == 1 ? "Person" : "People"} going
      </div>
      {attendees.map(attendee => (
        <div
          className="flex mb-2 hover:bg-gray-200 rounded-sm p-2 transition-all"
          key={attendee.username}
        >
          <img src={attendee.image || "/assets/user.png"} alt={attendee.displayName} className="w-15 rounded-full" />
          <div className="ms-2 me-auto">
            <Link to={`/profiles/${attendee.username}`} className="mt-1">{attendee.displayName}</Link>
            {attendee.following &&
            <p className="text-warning text-sm">following</p>}
          </div>
          {attendee.username == host?.username &&
          <div className="badge badge-warning mt-4">host</div>}
        </div>
      ))}
    </div>
  )
}

export default observer(ActivityDetailedSideBar)