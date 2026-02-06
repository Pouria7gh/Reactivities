import { observer } from "mobx-react-lite";
import { useEffect, useState } from "react";
import type { ActivityAttendee } from "../../models/ActivityAttendee";

interface props {
  attendee : ActivityAttendee;
}

function ProfileCardPopover({attendee}: props) {
  const [bio, setBio] = useState<string>();

  useEffect(() => {
    const truncateAt = 50;

    if (!attendee.bio) {
      setBio(attendee.bio);
      return;
    }

    if (attendee.bio.length > truncateAt) {
      setBio(attendee.bio.slice(0, truncateAt).concat("..."));
    } else {
      setBio(attendee.bio);
    }
  }, [attendee.bio])

  return (
    <div
      className="
        absolute left-1/2 top-full mt-2
        w-48 p-4 rounded-xl shadow-lg bg-white
        opacity-0 translate-y-2
        pointer-events-none
        transition-all duration-200
        group-hover:opacity-100
        group-hover:translate-y-0
        group-hover:pointer-events-auto
        z-100
        break-all
      "
    >
      <p className="text-lg">{attendee.displayName}</p>
      <p>{bio ? bio : <span className="text-gray-400">no bio.</span>}</p>
      <p className="mt-2">{attendee.followersCount} | followers</p>
    </div>
  )
}

export default observer(ProfileCardPopover)