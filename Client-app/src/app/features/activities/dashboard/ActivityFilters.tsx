
import { observer } from "mobx-react-lite";
import DatePicker from "react-datepicker";
import { FaFilter } from "react-icons/fa";
import { useStore } from "../../../stores/Store";
import { useState } from "react";

type Flag = "isGoing" | "isHost" | "all";

function ActivityFilters() {
  const {activityStore:{
    filterByDate, 
    filterIsGoing, 
    filterIsHost, 
    removeFilters
  }} = useStore();
  const [activeFlag, setActiveFlag] = useState<Flag>("all");

  function handleClick(flag:Flag) {
    if (activeFlag === flag) return;
    setActiveFlag(flag);

    switch (flag) {
      case "all":
        removeFilters();
        break;
      case "isGoing":
        filterIsGoing();
        break;
      case "isHost":
        filterIsHost();
        break;
    }
  }

  return (
    <>
      <div className="bg-base-200 p-3 inset-ring inset-ring-gray-300 shadow-lg mb-5">
        <div className="flex items-center text-accent">
          <FaFilter className="me-1" />
          Filters
        </div>
        <div className="divider m-0"></div>
        <div 
          className={`mb-2 text-sm cursor-pointer ${activeFlag === "all" ? "text-blue-500" : ""}`}
          onClick={() => handleClick("all")}
        >
          All activities
        </div>
        <div 
          className={`mb-2 text-sm cursor-pointer ${activeFlag === "isGoing" ? "text-blue-500" : ""}`}
          onClick={() => handleClick("isGoing")}
        >
          I'm going
        </div>
        <div 
          className={`mb-2 text-sm cursor-pointer ${activeFlag === "isHost" ? "text-blue-500" : ""}`}
          onClick={() => handleClick("isHost")}
        >
          I'm hosting
        </div>
      </div>
      <div className="w-full flex justify-center">
        <DatePicker
          inline
          onSelect={(date:Date|null) => filterByDate(date!)}
        />
      </div>
    </>
  );
}

export default observer(ActivityFilters)