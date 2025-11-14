import { useStore } from "../../../app/stores/Store";

function Details() {

  const {activityStore} = useStore();

  if (!activityStore.selectedActivity)
    return;

  return (
    <div className="card bg-base-100 w-full inset-ring inset-ring-gray-300 shadow-lg">
      <figure>
        <img
          src={`/assets/categoryImages/${activityStore.selectedActivity.category}.jpg`}
          alt="category"
        />
      </figure>
      <div className="card-body">
        <h2 className="card-title">{activityStore.selectedActivity.title}</h2>
        <p className="text-blue-500 mb-1">{activityStore.selectedActivity.date}</p>
        <p>{activityStore.selectedActivity.description}</p>
        <div className="card-actions justify-end">
          <button className="btn btn-error" onClick={activityStore.cancelSelectActivity}>Cancel</button>
          <button className="btn btn-info" onClick={() => activityStore.openForm(activityStore.selectedActivity!.id)}>Edit</button>
        </div>
      </div>
    </div>
  );
}

export default Details