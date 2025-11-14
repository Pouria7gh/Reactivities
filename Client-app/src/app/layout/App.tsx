import { useEffect } from 'react'
import { observer } from 'mobx-react-lite';
import './App.css'

import { useStore } from '../stores/Store';
import Navbar from './Navbar';
import LoadingComponent from './LoadingComponent';
import { Outlet } from 'react-router';

function App() {
  return (
    <>
      <Navbar />
      <Outlet />
    </>
  );
}

export default observer(App);
