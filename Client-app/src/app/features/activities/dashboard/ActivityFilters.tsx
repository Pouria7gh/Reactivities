
import { observer } from "mobx-react-lite";
import DatePicker from "react-datepicker";
import { FaFilter } from "react-icons/fa";
import { useStore } from "../../../stores/Store";

function ActivityFilters() {
  const {activityStore:{predicate, setPredicate}} = useStore();

  return (
    <>
      <div className="bg-base-200 p-3 inset-ring inset-ring-gray-300 shadow-lg mb-5">
        <div className="flex items-center text-accent">
          <FaFilter className="me-1" />
          Filters
        </div>
        <div className="divider m-0"></div>
        <div 
          className={`mb-2 text-sm cursor-pointer ${predicate.has("all") ? "text-blue-500" : ""}`}
          onClick={() => setPredicate("all", "true")}
        >
          All activities
        </div>
        <div 
          className={`mb-2 text-sm cursor-pointer ${predicate.has("isGoing") ? "text-blue-500" : ""}`}
          onClick={() => setPredicate("isGoing", "true")}
        >
          I'm going
        </div>
        <div 
          className={`mb-2 text-sm cursor-pointer ${predicate.has("isHost") ? "text-blue-500" : ""}`}
          onClick={() => setPredicate("isHost", "true")}
        >
          I'm hosting
        </div>
      </div>
      <div className="w-full flex justify-center">
        <DatePicker
          inline
          onSelect={(date:Date|null) => setPredicate('startDate', date!)}
        />
      </div>
    </>
  );
}

export default observer(ActivityFilters)