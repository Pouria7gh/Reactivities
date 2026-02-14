import { useEffect, useState } from 'react';
import { observer } from 'mobx-react-lite';
import InfiniteScroll from 'react-infinite-scroller';

import { useStore } from '../../../stores/Store';
import ActivityList from './ActivityList'
import LoadingComponent from '../../../layout/LoadingComponent';
import ActivityFilters from './ActivityFilters';
import { PagingParams } from '../../../models/Pagination';

function ActivitiyDashboard() {
  const {activityStore} = useStore();
  const [loadingNext, setLoadingNext] = useState(false);

  function handleLoadMore() {
    if (loadingNext) return;
    setLoadingNext(true);
    activityStore.setPagingParams(new PagingParams(activityStore.pagination!.currentPage + 1));
    activityStore.loadActivities().then(() => setLoadingNext(false));
  }

  function hasMore() {
    if (!activityStore.pagination) return false;
    const hasMorePages = activityStore.pagination.currentPage < activityStore.pagination.totalPages;
    return hasMorePages;
  }
  
  useEffect(() => {
    if (activityStore.activityRegistry.size <= 1)
    activityStore.loadActivities();
  }, []);

  return (
    <div className='container mx-auto px-4 grid grid-cols-18 gap-5'>
      
      {activityStore.loadingInitial && !loadingNext && <LoadingComponent text='Loading Activities...' />}
      
      <div className="col-span-12">
        <InfiniteScroll
          loadMore={handleLoadMore}
          pageStart={1}
          hasMore={hasMore()}
          loader={(
            <div key="12" className='flex justify-center items-center p-5'>
              <span className='loading loading-lg loading-primary'></span>
            </div>
          )}
        >
          <ActivityList />
        </InfiniteScroll>

      </div>
      <div className='col-span-6 mt-10'>
        <ActivityFilters />
      </div>
    </div>
  )
}

export default observer(ActivitiyDashboard)