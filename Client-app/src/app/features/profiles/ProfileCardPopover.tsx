import { observer } from "mobx-react-lite";
import { Profile } from "../../models/Profile"
import { useEffect, useState } from "react";

interface props {
    profile : Profile;
}

function ProfileCardPopover({profile}: props) {
  const [bio, setBio] = useState<string>();

  useEffect(() => {
    const truncateAt = 50;

    if (!profile.bio) {
      setBio(profile.bio);
      return;
    }

    if (profile.bio.length > truncateAt) {
      setBio(profile.bio.slice(0, truncateAt).concat("..."));
    } else {
      setBio(profile.bio);
    }
  }, [profile.bio])

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
      <p className="text-lg">{profile.displayName}</p>
      <p>{bio ? bio : <span className="text-gray-400">no bio.</span>}</p>
      <p className="mt-2">20 | followers</p>
    </div>
  )
}

export default observer(ProfileCardPopover)