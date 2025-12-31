import { observer } from "mobx-react-lite"
import { useStore } from "../../stores/Store"

function EditPhoto() {
    const {modalStore: {closeModal, modal: {props: photo}}, profileStore} = useStore();

    function handleDeletePhoto() {
        profileStore.deletePhoto(photo).then(() => {
            closeModal();
        });
    }

  return (
    <div>
        <img src={photo.url} alt="photo" className="mb-3" />
        <div className="flex">
            <button 
                onClick={() => profileStore.setMainPhoto(photo)}
                className="btn btn-info me-1"
                disabled={photo.isMain || profileStore.mainPhotoLoading}
            >
                {!profileStore.mainPhotoLoading && "SetMain"}
                {profileStore.mainPhotoLoading &&
                <span className="loading loading-sm loading-info"></span>}
            </button>

            <button 
                onClick={handleDeletePhoto}
                className="btn btn-error me-auto"
                disabled={profileStore.deletePhotoLoading}
            >
                {!profileStore.deletePhotoLoading && "Delete"}
                {profileStore.deletePhotoLoading &&
                <span className="loading loading-sm loading-error"></span>}
            </button>

            <button onClick={closeModal} className="btn btn-outline btn-error">
                close
            </button>
        </div>
    </div>
  )
}

export default observer(EditPhoto)