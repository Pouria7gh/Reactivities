import { IoIosInformationCircleOutline } from "react-icons/io"
import { CiCalendarDate, CiLocationOn } from "react-icons/ci"
import { format } from 'date-fns';

import type { Activity } from "../../../models/activity"

interface props {
    activity: Activity
}

function ActivityDetailedInfo({ activity }: props) {
  return (
    <div className="rounded-lg bg-base-200 p-3 shadow-lg shadow-gray-300 inset-ring inset-ring-gray-300 mb-4">
      <p><IoIosInformationCircleOutline className="inline mb-[2px] text-xl text-accent" /> { activity.description }</p>
      <div className="divider m-0"></div>
      <p><CiCalendarDate className="inline mb-[2px] text-xl text-accent" /> { format(activity.date!, "dd MMM yyyy h:mm aa") }</p>
      <div className="divider m-0"></div>
      <p><CiLocationOn className="inline mb-[2px] text-xl text-accent" /> { activity.city }, { activity.venue }</p>
    </div>
  )
}

export default ActivityDetailedInfo