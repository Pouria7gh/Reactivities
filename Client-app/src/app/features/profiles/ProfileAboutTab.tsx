import { useState } from "react"
import { IoMdInformationCircle } from "react-icons/io";
import ProfileInfo from "./ProfileInfo";
import ProfileInfoForm from "./ProfileInfoForm";
import { observer } from "mobx-react-lite";
import { useStore } from "../../stores/Store";

function ProfileAboutTab() {
  const [editMode, setEditMode] = useState(false);
  const {profileStore} = useStore();

  return (
    <div className="grid grid-cols-12 gap-3 p-4">
      <div className="flex col-span-12 items-center mb-1">
        <IoMdInformationCircle className="inline-block me-2 text-2xl text-blue-600" />
        <p className="text-lg col-span-12 inline-bock me-auto" >About</p>

        {profileStore.isCurrentUser &&
        <button
          className={`btn ${!editMode && "btn-info"}`}
          onClick={() => setEditMode(!editMode)}
        >
          {!editMode && "Edit"}
          {editMode && "Cancel"}
        </button>}
      </div>
      
      {!editMode &&
      <ProfileInfo className="col-span-12" />}

      {editMode &&
      <ProfileInfoForm className="col-span-12" setEditMode={setEditMode} />}
    </div>
  )
}

export default observer(ProfileAboutTab)