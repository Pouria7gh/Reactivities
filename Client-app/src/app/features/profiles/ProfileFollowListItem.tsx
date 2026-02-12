import { useNavigate } from "react-router";
import type { Profile } from "../../models/Profile"

interface props {
    profile: Profile;
}

function ProfileFollowListItem({profile}:props) {
    const navigate = useNavigate();


  return (
    <li 
        className="list-row hover:bg-gray-200 transition duration-300 cursor-pointer"
        onClick={() => navigate(`/profiles/${profile.username}`)}
    >
        <div>
            <img className="size-10 rounded-full" src={profile.image || "/assets/user.png"}/>
        </div>
        <div>
            <div>{profile.displayName}</div>
            <div className="text-xs font-semibold opacity-60">
                {profile.bio ||
                    (<span className="text-gray-400">no bio.</span>)}
            </div>
        </div>
    </li>
  )
}

export default ProfileFollowListItem