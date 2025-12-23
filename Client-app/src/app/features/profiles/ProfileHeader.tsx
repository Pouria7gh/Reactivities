import { observer } from "mobx-react-lite";
import type { Profile } from "../../models/Profile"

interface Props {
    profile: Profile;
}

function ProfileHeader({profile}: Props) {
  return (
    <div className="bg-base-100 inset-ring inset-ring-gray-300 shadow-lg py-3 px-6 rounded rounded-lg flex items-center">
        <img 
            src={profile.image || "/assets/user.png"}
            alt="User"
            className="w-30 rounded-full"
        />
        <p className="text-2xl ms-3 me-auto">{profile.displayName}</p>
        <div className="grid grid-cols-10 gap-x-5 text-center">
            <div className="col-span-5">
                <p className="text-4xl">52</p>
                <p>Followers</p>
            </div>
            <div className="col-span-5">
                <p className="text-4xl">100</p>
                <p>Following</p>
            </div>
            <div className="divider col-span-10 my-2"></div>
            <button className="btn btn-info col-span-10">Following</button>
        </div>
    </div>
  )
}

export default observer(ProfileHeader)