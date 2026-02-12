import { observer } from "mobx-react-lite";
import type { Profile } from "../../models/Profile";
import { useStore } from "../../stores/Store";

interface props {
    profile: Profile;
    className?: string;
}

function ProfileFollowButton({profile, className}:props) {
    const {profileStore: {updatingFollowing, updateFollowing}} = useStore();

    function handleClick() {
        updateFollowing(profile.username, !profile.following);
    }

    return (
    <button
        className={`btn btn-primary ${className}`}
        onClick={handleClick}
    >
        { !updatingFollowing &&
        <span>
            {profile.following ? "Unfollow" : "Follow"}
        </span>}

        {updatingFollowing &&
        <span className="loading loading-sm loading-primary"></span>}
    </button>
  )
}

export default observer(ProfileFollowButton)