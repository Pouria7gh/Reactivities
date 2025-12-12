import { observer } from "mobx-react-lite";
import { Profile } from "../../models/Profile"

interface props {
    profile : Profile;
}

function ProfileCard({profile}: props) {
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
      "
    >
      <p className="text-lg">{profile.displayName}</p>
      <p>{profile.bio ? profile.bio : "bio goes here"}</p>
      <p className="mt-2">20 | followers</p>
    </div>
  )
}

export default observer(ProfileCard)