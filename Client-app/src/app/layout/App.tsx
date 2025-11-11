import { useEffect, useState } from 'react'
import './App.css'
import axios from 'axios';
import {v4 as uuid} from 'uuid';

import type { Activity } from '../models/activity';

import Navbar from './Navbar';
import ActivitiyDashboard from '../../features/activities/dashboard/ActivitiyDashboard';

function App() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [selectedActivity, setSelectedActivity] = useState<Activity | undefined>(undefined);
  const [editMode, setEditMode] = useState(false);
  
  useEffect(() => {
    axios.get<Activity[]>("http://localhost:5000/api/Activities")
      .then(response => {
        console.log(response);
        setActivities(response.data);
      });
  }, []);

  function handleSelectActivity(id : string) {
    setSelectedActivity(activities.find(x => x.id === id));
  }

  function handleCancelSelectActivity() {
    setSelectedActivity(undefined);
  }

  function handleFormOpen(id?: string) {
    id ? handleSelectActivity(id) : handleCancelSelectActivity();
    setEditMode(true);
  }

  function handleFormClose() {
    setEditMode(false);
  }

  function handleCreateOrEditActivity(activity: Activity) {

    if (activity.id) {
      setActivities([activity, ...activities.filter(x => x.id !== activity.id)]);
    } else {
      activity.id = uuid();
      setActivities(prev => [activity, ...prev])
    }
    setSelectedActivity(activity);
    setEditMode(false);
  }

  function handleDeleteActivity(id: string) {
    setActivities(prev => [...prev.filter(x => x.id !== id)]);
    if (selectedActivity && selectedActivity.id === id) {
      setSelectedActivity(undefined);
    }
  }

  return (
    <>
      <Navbar openForm={handleFormOpen} />

      <ActivitiyDashboard 
        activities={activities}
        selectedActivity={selectedActivity}
        handleSelectActivity={handleSelectActivity}
        handleCancelSelectActivity={handleCancelSelectActivity}
        editMode={editMode}
        openForm={handleFormOpen}
        closeForm={handleFormClose}
        createOrEditActivity={handleCreateOrEditActivity}
        deleteActivity={handleDeleteActivity}
      />
    </>
  )
}

export default App
