import { Link } from "react-router";
import type { Profile } from "../../../models/Profile";
import { observer } from "mobx-react-lite";
import ProfileCardPopover from "../../profiles/ProfileCardPopover";

interface props {
  attendees: Profile[] | undefined;
}


function ActivityListItemAttendee({attendees}: props) {
  if(!attendees) return null;

  return (
    <div className="flex justify-start items-center">
      {attendees.map(attendee => (
        <Link
          to={`/profiles/${attendee.username}`}
          className="me-2 rounded-full group relative"
          key={attendee.username}
        >
          <img
            alt={attendee.displayName}
            src={attendee.image || "/assets/user.png"}
            className="w-10 rounded-full"
          />
          <ProfileCardPopover profile={attendee}/>
        </Link>
      ))}
    </div>
  );
}

export default observer(ActivityListItemAttendee)