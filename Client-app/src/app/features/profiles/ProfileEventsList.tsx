import { format } from "date-fns";
import { useStore } from "../../stores/Store"
import { observer } from "mobx-react-lite";
import { Link } from "react-router";

function ProfileEventsList() {
    const {profileStore:{activities, loadingActivities}} = useStore();
  

    if (loadingActivities){
        return (
            <div className="flex justify-center align-center">
                <span className="loading loading-lg loading-primary"></span>
            </div>
        );
    }

    return (
        <div className="grid xl:grid-cols-5 lg:grid-cols-4 md:grid-cols-2 gap-3">
            {activities?.map((activity) => (
                <div 
                    key={activity.id} 
                    className="card bg-base-100 shadow-sm"
                >
                    <figure>
                        <img
                        src={`/assets/categoryImages/${activity.category}.jpg`}
                        alt="activity image" />
                    </figure>
                    <div className="card-body p-2">
                        <h2 className="card-title text-base">{activity.title}</h2>
                        <p>{format(activity.date, "dd MMM yyyy")}</p>
                        <div className="card-actions justify-end">
                            <Link
                                to={`/activities/${activity.id}`}
                                className="btn btn-sm btn-primary"
                            >
                                View
                            </Link>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    )
}

export default observer(ProfileEventsList)