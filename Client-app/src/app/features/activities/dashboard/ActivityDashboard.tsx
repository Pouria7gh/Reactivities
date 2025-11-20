import { useEffect } from 'react';
import { observer } from 'mobx-react-lite';

import { useStore } from '../../../stores/Store';
import ActivityList from './ActivityList'
import LoadingComponent from '../../../layout/LoadingComponent';
import ActivityFilters from './ActivityFilters';

function ActivitiyDashboard() {

  const {activityStore} = useStore();
  
  useEffect(() => {
    if (activityStore.activityRegistry.size <= 1)
    activityStore.loadActivities();
  }, []);

  return (
    <div className='container mx-auto px-2 grid grid-cols-18 gap-5'>
      
      {activityStore.loadingInitial && <LoadingComponent />}
      
      <div className="col-span-12">
        <ActivityList />
      </div>
      <div className='col-span-6 mt-10'>
        <ActivityFilters />
      </div>
    </div>
  )
}

export default observer(ActivitiyDashboard)