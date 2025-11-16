import { observer } from 'mobx-react-lite';
import './App.css'

import Navbar from './Navbar';
import { Outlet, useLocation } from 'react-router';
import HomePage from '../../features/home/HomePage';

function App() {
  const location = useLocation();

  if (location.pathname === "/") {
    return <HomePage/>;
  }

  return (
    <>
      <Navbar />
      <Outlet />
    </>
  );
}

export default observer(App);
