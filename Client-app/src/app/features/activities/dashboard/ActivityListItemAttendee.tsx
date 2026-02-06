import { Link } from "react-router";
import { observer } from "mobx-react-lite";
import ProfileCardPopover from "../../profiles/ProfileCardPopover";
import type { ActivityAttendee } from "../../../models/ActivityAttendee";

interface props {
  attendees: ActivityAttendee[] | undefined;
}


function ActivityListItemAttendee({attendees}: props) {
  if(!attendees) return null;

  return (
    <div className="flex justify-start items-center">
      {attendees.map(attendee => (
        <Link
          to={`/profiles/${attendee.username}`}
          className={`me-2 rounded-full group relative ${attendee.following ? "border border-2 border-orange-400" :""}`}
          key={attendee.username}
        >
          <img
            alt={attendee.displayName}
            src={attendee.image || "/assets/user.png"}
            className="w-10 rounded-full"
          />
          <ProfileCardPopover attendee={attendee}/>
        </Link>
      ))}
    </div>
  );
}

export default observer(ActivityListItemAttendee)