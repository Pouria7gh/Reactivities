import { createBrowserRouter, type RouteObject } from "react-router";
import App from "../layout/App";
import HomePage from "../../features/home/HomePage";
import ActivitiyDashboard from "../../features/activities/dashboard/ActivitiyDashboard";
import ActivityForm from "../../features/activities/form/ActivityForm";

const routes: RouteObject[] = [
    {
        path: "/",
        element: <App/>,
        children: [
            { path: "", element: <HomePage/> },
            { path: "Activities", element: <ActivitiyDashboard/> },
            { path: "CreateActivity", element: <ActivityForm/> }
        ]
    }
]

export default createBrowserRouter(routes);