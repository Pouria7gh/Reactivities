import type { Activity } from '../../../app/models/activity'

import ActivityList from './ActivityList'
import Details from '../details/Details'
import ActivityForm from '../form/ActivityForm'

interface props {
  activities: Activity[];
  selectedActivity: Activity | undefined;
  handleSelectActivity: (id : string) => void;
  handleCancelSelectActivity: () => void;
  editMode: boolean;
  openForm: (id?: string) => void;
  closeForm: () => void;
  createOrEditActivity: (activity: Activity) => void;
  deleteActivity: (id: string) => void;
}

function ActivitiyDashboard({ activities, selectedActivity, handleCancelSelectActivity,
  handleSelectActivity, editMode, openForm, closeForm, createOrEditActivity, deleteActivity }: props) {

  return (
    <div className='container mx-auto px-2 grid grid-cols-12'>

      <div className="col-span-7">
        <ActivityList
          activities={activities}
          handleSelectActivity={handleSelectActivity}
          deleteActivity={deleteActivity}
        />
      </div>

      <div className='col-span-5 ps-5 mt-10'>

        { selectedActivity && !editMode &&
        <Details 
          activity={selectedActivity}
          handleCancelSelectActivity={ handleCancelSelectActivity }
          openForm={openForm}
        />}

        { editMode &&
        <ActivityForm
          closeForm={closeForm}
          activity={selectedActivity}
          createOrEditActivity={createOrEditActivity}
        />}
      </div>

    </div>
  )
}

export default ActivitiyDashboard