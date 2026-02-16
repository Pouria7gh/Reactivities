import { useEffect, useState } from 'react';
import { observer } from 'mobx-react-lite';
import InfiniteScroll from 'react-infinite-scroller';

import { useStore } from '../../../stores/Store';
import ActivityList from './ActivityList'
import ActivityFilters from './ActivityFilters';
import ActivityListItemSkeleton from './ActivityListItemSkeleton';

function ActivitiyDashboard() {
  const {activityStore} = useStore();
  const [loadingMore, setLoadingMore] = useState(false);
  
  useEffect(() => {
    if (activityStore.activityRegistry.size <= 1) {
      activityStore.loadActivities()
    }
  }, []);

  function handleLoadMore() {
    if (loadingMore) return;
    setLoadingMore(true);
    activityStore.loadNextActivities().then(() => {
      setLoadingMore(false);
    });
  }

  return (
    <div className='container mx-auto px-4 grid grid-cols-18 gap-5'>
      
      <div className="col-span-12">
        {!activityStore.loadingInitial &&
        <InfiniteScroll
          loadMore={handleLoadMore}
          pageStart={1}
          hasMore={activityStore.hasMoreActivities}
          loader={(
            <div key="12" className='flex justify-center items-center p-5'>
              <span className='loading loading-lg loading-primary'></span>
            </div>
          )}
        >
          <ActivityList />
        </InfiniteScroll>}

        {activityStore.loadingInitial &&
        <ActivityListItemSkeleton/>}

      </div>
      <div className='col-span-6 mt-10'>
        <ActivityFilters />
      </div>
    </div>
  )
}

export default observer(ActivitiyDashboard)