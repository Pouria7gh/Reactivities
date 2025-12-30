import { observer } from "mobx-react-lite"
import { useStore } from "../../stores/Store"

function EditPhoto() {
    const {modalStore: {closeModal, modal: {props}}, profileStore} = useStore();
  return (
    <div>
        <img src={props.url} alt="photo" className="mb-3" />
        <div className="flex">
            <button 
                onClick={() => profileStore.setMainPhoto(props)}
                className="btn btn-info me-1"
                disabled={props.isMain || profileStore.setMainPhotoLoading}
            >
                {!profileStore.setMainPhotoLoading && "SetMain"}
                {profileStore.setMainPhotoLoading &&
                <span className="loading loading-sm loading-info"></span>}
            </button>
            <button onClick={closeModal} className="btn btn-error me-auto">
                Delete
            </button>
            <button onClick={closeModal} className="btn btn-outline btn-error">
                close
            </button>
        </div>
    </div>
  )
}

export default observer(EditPhoto)