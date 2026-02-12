import { useEffect, useState } from "react";
import { useStore } from "../../stores/Store";
import { observer } from "mobx-react-lite";
import ProfileFollowListItem from "./ProfileFollowListItem";

interface props {
    username:string;
    displayName:string;
    predicate:string;
}

function ProfileFollowTabContent({username, displayName, predicate}:props) {
    const {profileStore:{followers, followings, listFollowers, listFollowings}} = useStore();
    const [loading, setLoading] = useState(false);
    const isFollowers = predicate === "followers";
    const isFollowings = predicate === "followings";

    useEffect(() => {
        if (isFollowings) {
            loadFollowings();
        }
        else if (isFollowers) {
            loadFollowers();
        }
    },[username, predicate])

    function loadFollowings() {
        if (followings !== null) return;
        setLoading(true);
        listFollowings(username).then(() => {
            setLoading(false);
        })
    }

    function loadFollowers() {
        if (followers !== null) return;
        setLoading(true);
        listFollowers(username).then(() => {
            setLoading(false);
        })
    }

    if (loading) {
        return (
            <div className="absolute top-0 bottom-0 right-0 left-0 flex items-center justify-center">
                <span className="loading loading-primary"></span>
            </div>
        );
    }

    return (
        <ul className="list bg-base-100 rounded-box m-2">
  
            <li className="p-4 pb-2 text-xs opacity-60 tracking-wide">{displayName}'s Followers:</li>
            
            {isFollowers && followers && followers.map(followers => (
                <ProfileFollowListItem key={followers.username} profile={followers}/>
            ))}
            {isFollowers && followers && followers.length === 0 && (
                <div className="p-5 text-gray-500 text-base">
                    no followers.
                </div>
            )}

            {isFollowings && followings && followings.map(following => (
                <ProfileFollowListItem key={following.username} profile={following}/>
            ))}
            {isFollowings && followings && followings.length === 0 && (
                <div className="p-5 text-gray-500 text-base">
                    no followings.
                </div>
            )}

        </ul>
    )
}

export default observer(ProfileFollowTabContent)