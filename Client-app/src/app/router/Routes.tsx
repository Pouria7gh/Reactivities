import { createBrowserRouter, type RouteObject } from "react-router";
import App from "../layout/App";
import ActivitiyDashboard from "../../features/activities/dashboard/ActivitiyDashboard";
import ActivityForm from "../../features/activities/form/ActivityForm";
import Details from "../../features/activities/details/Details";

const routes: RouteObject[] = [
    {
        path: "/",
        element: <App/>,
        children: [
            { path: "Activities", element: <ActivitiyDashboard/> },
            { path: "Activities/:id", element: <Details/> },
            { path: "CreateActivity", element: <ActivityForm key="Create" /> },
            { path: "Manage/:id", element: <ActivityForm key="Manage" /> }
        ]
    }
]

export default createBrowserRouter(routes);