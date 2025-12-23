import { observer } from "mobx-react-lite";
import ProfileContent from "./ProfileContent";
import ProfileHeader from "./ProfileHeader";
import { useParams } from "react-router";
import { useStore } from "../../stores/Store";
import { useEffect } from "react";
import LoadingComponent from "../../layout/LoadingComponent";

function ProfilePage() {
  const {username} = useParams();
  const {profileStore: {getProfile, profile, loadingProfile}} = useStore();

  useEffect(() => {
    if (!username) return;
    
    if (profile?.username === username) return;

    getProfile(username)
  }, [username, profile?.username])

  if (loadingProfile) return <LoadingComponent text="loading profile"/>;

  if (!profile) return null;

  return (
    <div className="container mx-auto pt-4">
      <ProfileHeader profile={profile!} />
      <ProfileContent />
    </div>
  )
}

export default observer(ProfilePage)