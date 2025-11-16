import { Link, useParams } from "react-router";
import { useStore } from "../../../app/stores/Store";
import { useEffect } from "react";
import { observer } from "mobx-react-lite";
import LoadingComponent from "../../../app/layout/LoadingComponent";

function Details() {
  const {activityStore} = useStore();
  const {selectedActivity, loadActivity, loadingInitial} = activityStore;
  const { id } = useParams();

  useEffect(() => {
    if(id)
      loadActivity(id);
  }, [id])

  if (!selectedActivity || loadingInitial)
    return <LoadingComponent/>;

  return (
    <div className="card bg-base-100 w-[90%] md:w-[70%] lg:w-[50%] mx-auto mt-5 inset-ring inset-ring-gray-300 shadow-lg">
      <figure>
        <img
          src={`/assets/categoryImages/${selectedActivity?.category}.jpg`}
          alt="category"
        />
      </figure>
      <div className="card-body">
        <h2 className="card-title">{selectedActivity?.title}</h2>
        <p className="text-blue-500 mb-1">{selectedActivity?.date}</p>
        <p>{selectedActivity?.description}</p>
        <div className="card-actions justify-end">
          <Link to={`/Activities`} className="btn btn-error" >Cancel</Link>
          <Link to={`/Manage/${selectedActivity.id}`} className="btn btn-info" >Edit</Link>
        </div>
      </div>
    </div>
  );
}

export default observer(Details)