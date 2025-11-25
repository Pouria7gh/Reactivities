
import { FaFilter } from "react-icons/fa";

function ActivityFilters() {
  return (
    <>
      <div className="bg-base-200 p-3 inset-ring inset-ring-gray-300 shadow-lg mb-5">
        <div className="flex items-center text-accent">
          <FaFilter className="me-1" />
          Filters
        </div>
        <div className="divider m-0"></div>
        <div className="mb-2 text-sm">All activities</div>
        <div className="mb-2 text-sm">I'm going</div>
        <div className="text-sm">I'm hosting</div>
      </div>
      <div className="w-full flex justify-center">
      </div>
    </>
  );
}

export default ActivityFilters