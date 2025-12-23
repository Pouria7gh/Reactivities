import { observer } from 'mobx-react-lite';
import './App.css'

import Navbar from './Navbar';
import { Outlet, useLocation } from 'react-router';
import { Toaster } from 'react-hot-toast';
import { useStore } from '../stores/Store';
import { useEffect } from 'react';
import LoadingComponent from './LoadingComponent';
import AppModal from '../common/modal/AppModal';
import { isAxiosError } from 'axios';

function App() {
  const location = useLocation();
  const {commonStore, userStore} = useStore()

  useEffect(() => {
    if (commonStore.token) {
      userStore.getUser().catch(error => {
        
        if (!isAxiosError(error)) 
          return;

        // remove token if it is wrong
        if (error.response?.status == 401)
          commonStore.token = null;
        
      }).finally(() => commonStore.setAppLoaded());
    } else {
      commonStore.setAppLoaded();
    }
  }, [commonStore, userStore]);

  if (!commonStore.appLoaded) return <LoadingComponent text='Loading App...' />

  return (
    <>
      <AppModal />
      <Toaster position="bottom-right"/>
      {!(location.pathname === "/") &&
      <Navbar />}
      <Outlet />
    </>
  );
}

export default observer(App);
