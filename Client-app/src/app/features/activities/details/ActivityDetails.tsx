import { useParams } from "react-router";
import { useStore } from "../../../stores/Store";
import { useEffect } from "react";
import { observer } from "mobx-react-lite";
import LoadingComponent from "../../../layout/LoadingComponent";
import ActivityDetailedHeader from "./ActivityDetailedHeader";
import ActivityDetailedInfo from "./ActivityDetailedInfo";
import ActivityDetailedChat from "./ActivityDetailedChat";
import ActivityDetailedSideBar from "./ActivityDetailedSidebar";

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
    <div className="grid grid-cols-16 gap-5 container mx-auto mt-3">
      <div className="col-span-10">
        <ActivityDetailedHeader activity={selectedActivity} />
        <ActivityDetailedInfo activity={selectedActivity} />
        <ActivityDetailedChat />
      </div>
      <div className="col-span-6">
        <ActivityDetailedSideBar activity={selectedActivity} />
      </div>
    </div>
  );
}

export default observer(Details)