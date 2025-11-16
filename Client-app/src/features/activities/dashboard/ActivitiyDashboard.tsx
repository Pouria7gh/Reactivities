import { useEffect } from 'react';
import { observer } from 'mobx-react-lite';

import { useStore } from '../../../app/stores/Store';
import ActivityList from './ActivityList'
import LoadingComponent from '../../../app/layout/LoadingComponent';

function ActivitiyDashboard() {

  const {activityStore} = useStore();
  
  useEffect(() => {
    if (activityStore.activityRegistry.size <= 1)
    activityStore.loadActivities();
  }, []);

  return (
    <div className='container mx-auto px-2 grid grid-cols-12'>
      
      {activityStore.loadingInitial && <LoadingComponent />}
      
      <div className="col-span-7">
        <ActivityList />
      </div>
    </div>
  )
}

export default observer(ActivitiyDashboard)