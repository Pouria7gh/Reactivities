import { observer } from "mobx-react-lite";
import type Photo from "../../models/Photo";
import { IoMdPhotos } from "react-icons/io";
import { useStore } from "../../stores/Store";

interface Props {
  photos: Photo[] | undefined;
}

function ProfilePhotosTab({ photos }: Props) {
  const { profileStore } = useStore();
  if (!photos || photos?.length === 0)
    return (
      <div className="flex items-center justify-center h-50">
        There are no photos
      </div>
    );

  return (
    <div className="grid grid-cols-12 gap-3 p-4">
      <div className="flex col-span-12 items-center mb-1">
        <IoMdPhotos className="inline-block me-2 text-xl text-blue-600" />
        <p className="text-lg col-span-12 inline-bock me-auto">Photos</p>
        {profileStore.isCurrentUser && (
          <button className="btn btn-info">add photo</button>
        )}
      </div>
      {photos.map((photo) => (
        <img
          className="col-span-6 sm:col-span-4 lg:col-span-3 2xl:col-span-2 rounded-sm"
          key={photo.id}
          src={photo.url}
        />
      ))}
    </div>
  );
}

export default observer(ProfilePhotosTab);
