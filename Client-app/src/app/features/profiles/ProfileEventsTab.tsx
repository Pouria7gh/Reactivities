import { useEffect, useState } from "react"
import { observer } from "mobx-react-lite";

import { useStore } from "../../stores/Store";
import ProfileEventsList from "./ProfileEventsList";
import type { ProfileActivityFilter } from "../../models/ProfileActivity";

function ProfileEventsTab() {
  const {profileStore:{loadActivities}} = useStore();
  const [activeFilter, setActiveFilter] = useState<ProfileActivityFilter>("futureEvents");

  useEffect(() => {
    loadActivities(activeFilter);
  }, [activeFilter, loadActivities])

  function handleClick(filter:ProfileActivityFilter) {
    if (activeFilter === filter) return;
    setActiveFilter(filter);
  }

  return (
    <>
    <div className="p-5 text-lg">
      Activities
    </div>
    <div className="tabs tabs-lift ms-2">
      <input
        type="radio"
        name="my_tabs_3"
        className="tab"
        aria-label="Future Events"
        onClick={() => handleClick("futureEvents")}
        defaultChecked
      />
      <div className="tab-content bg-base-100 border-base-300 p-6">
        <ProfileEventsList />
      </div>

      <input
        type="radio"
        name="my_tabs_3"
        className="tab"
        aria-label="Past Events"
        onClick={() => handleClick("pastEvents")}
      />
      <div className="tab-content bg-base-100 border-base-300 p-6">
        <ProfileEventsList />
      </div>

      <input
        type="radio"
        name="my_tabs_3"
        className="tab"
        aria-label="Hosting Events"
        onClick={() => handleClick("hosting")}
      />
      <div className="tab-content bg-base-100 border-base-300 p-6">
        <ProfileEventsList />
      </div>
    </div>
    </>
  )
}

export default observer(ProfileEventsTab)