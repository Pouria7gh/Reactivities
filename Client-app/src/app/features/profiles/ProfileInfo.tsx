import { observer } from "mobx-react-lite";
import { useStore } from "../../stores/Store"

interface props {
  className?: string;
}

function ProfileInfo({className}: props) {
  const {profileStore: {profile}} = useStore();

  return (
    <div className={className + " mb-3 break-all"}>
      <p className="text-blue-500 text-sm">Name:</p>
      <p>{profile?.displayName}</p>

      <p className="text-blue-500 text-sm mt-3">Bio:</p>
      <p>{profile?.bio || <span className="text-gray-500">no bio</span>}</p>
    </div>
  )
}

export default observer(ProfileInfo)