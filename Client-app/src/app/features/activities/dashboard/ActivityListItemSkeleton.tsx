import { observer } from "mobx-react-lite";
import { useStore } from "../../../stores/Store"

function ActivityListItemSkeleton() {
    const {activityStore:{activitiesPerPage}} = useStore();

    return (
        <>
            {Array.from({length: activitiesPerPage}).map((_, i) => (
                <div key={i} className="card w-full bg-base-100 card-md inset-ring inset-ring-gray-300 shadow-lg mb-3 mt-10">
                    <div className="card-body">
                        <div className="flex items-center">
                            <div className="skeleton w-15 h-15 rounded-full me-4"></div>
                            <div>
                                <div className="skeleton w-35 h-6 mb-2"></div>
                                <div className="skeleton w-20 h-3"></div>
                            </div>
                        </div>
                        <div className="flex justify-start mb-2">
                            <div className="skeleton me-3 w-20 h-3"></div>
                            <div className="skeleton w-20 h-3"></div>
                        </div>
                        <div className="flex my-2">
                            <div className="skeleton w-10 h-10 rounded-full me-3"></div>
                            <div className="skeleton w-10 h-10 rounded-full me-3"></div>
                            <div className="skeleton w-10 h-10 rounded-full me-3"></div>
                            <div className="skeleton w-10 h-10 rounded-full me-3"></div>
                        </div>
                        <div className="skeleton w-[50%] h-3"></div>
                        <div className="card-actions">
                            <div className="skeleton w-30 h-7 mt-3"></div>
                            <button className="btn btn-primary ms-auto disable" disabled >
                                View
                            </button>
                        </div>
                    </div>
                </div>
            ))}
        </>
    )
}

export default observer(ActivityListItemSkeleton)