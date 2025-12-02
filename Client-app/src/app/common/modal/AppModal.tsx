import { useStore } from "../../stores/Store"
import { observer } from "mobx-react-lite";

function AppModal() {
  const {modalStore} = useStore();
  const Content = modalStore.modal.content;

  return (
    <dialog id="global-modal" className="modal" open={modalStore.modal.open}>
      <div className="modal-box">
        {Content && <Content/>}
      </div>
    </dialog>
  )
}

export default observer(AppModal)