import { observer } from 'mobx-react-lite';
import './App.css'

import Navbar from './Navbar';
import { Outlet, useLocation } from 'react-router';
import HomePage from '../features/home/HomePage';
import { Toaster } from 'react-hot-toast';

function App() {
  const location = useLocation();

  if (location.pathname === "/") {
    return <HomePage/>;
  }

  return (
    <>
      <Toaster position="bottom-right"/>
      <Navbar />
      <Outlet />
    </>
  );
}

export default observer(App);
