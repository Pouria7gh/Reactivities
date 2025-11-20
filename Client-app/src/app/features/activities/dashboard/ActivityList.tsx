import { observer } from "mobx-react-lite";

import { useStore } from "../../../stores/Store";
import ActivityListItem from "./ActivityListItem";

function ActivityList() {
  
  const {activityStore} = useStore();
  const { groupedActivitiesByDate } = activityStore;

  return (
    <ul className="list bg-base-100 rounded-box shadow-md">
      {groupedActivitiesByDate.map(([group, activities]) => (
        <div key={group}>
          <li className="p-4 pb-2 text-xs text-blue-900 tracking-wide">
            {group}
          </li>
          {activities.map(activity => (
            <ActivityListItem key={activity.id} activity={activity} />
          ))}
        </div>
      ))}
    </ul>
  );
}

export default observer(ActivityList);
