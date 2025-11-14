import { useEffect } from 'react';
import { observer } from 'mobx-react-lite';

import { useStore } from '../../../app/stores/Store';
import ActivityList from './ActivityList'
import Details from '../details/Details'
import ActivityForm from '../form/ActivityForm'
import LoadingComponent from '../../../app/layout/LoadingComponent';

function ActivitiyDashboard() {

  const {activityStore} = useStore();
  
  useEffect(() => {
    activityStore.loadActivities();
  }, [activityStore]);

  return (
    <div className='container mx-auto px-2 grid grid-cols-12'>
      
      {activityStore.loadingInitial && <LoadingComponent />}
      
      <div className="col-span-7">
        <ActivityList />
      </div>

      <div className='col-span-5 ps-5 mt-10'>
        { activityStore.selectedActivity && !activityStore.editMode &&
        <Details />}
        { activityStore.editMode &&
        <ActivityForm />}
      </div>
    </div>
  )
}

export default observer(ActivitiyDashboard)