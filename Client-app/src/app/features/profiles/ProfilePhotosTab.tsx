import { observer } from "mobx-react-lite";
import type Photo from "../../models/Photo";
import { IoMdPhotos } from "react-icons/io";
import { useStore } from "../../stores/Store";
import { useState } from "react";

interface Props {
  photos: Photo[] | undefined;
}

function ProfilePhotosTab({ photos }: Props) {
  const { profileStore } = useStore();
  const [editMode, setEditMode] = useState(false);

  return (
    <div className="grid grid-cols-12 gap-3 p-4">
      <div className="flex col-span-12 items-center mb-1">
        <IoMdPhotos className="inline-block me-2 text-xl text-blue-600" />
        <p className="text-lg col-span-12 inline-bock me-auto">Photos</p>
        {profileStore.isCurrentUser && (
          <button 
            className={`btn ${!editMode && "btn-info"}`}
            onClick={() => setEditMode(!editMode)}
          >
            {editMode ? "Cancel": "Add Photo"}
          </button>
        )}
      </div>

      {!editMode && (!photos || photos.length === 0) && (
        <p className="col-span-12">There are no photos</p>
      )}

      {!editMode && photos!.map((photo) => (
        <img
          className="col-span-6 sm:col-span-4 lg:col-span-3 2xl:col-span-2 rounded-sm"
          key={photo.id}
          src={photo.url}
        />
      ))}

      {editMode && (
        <>
        <div className="col-span-4">drop photo</div>
        <div className="col-span-4">crop photo</div>
        <div className="col-span-4">upload photo</div>
        </>
      )}
    </div>
  );
}

export default observer(ProfilePhotosTab);
