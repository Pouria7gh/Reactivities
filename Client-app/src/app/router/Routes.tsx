import { createBrowserRouter, Navigate, type RouteObject } from "react-router";
import App from "../layout/App";
import ActivitiyDashboard from "../features/activities/dashboard/ActivityDashboard";
import ActivityForm from "../features/activities/form/ActivityForm";
import Details from "../features/activities/details/ActivityDetails";
import TestErrors from "../features/errors/TestErrors";
import NotFound from "../features/errors/NotFound";
import ServerError from "../features/errors/ServerError";

const routes: RouteObject[] = [
    {
        path: "/",
        element: <App/>,
        children: [
            { path: "Activities", element: <ActivitiyDashboard/> },
            { path: "Activities/:id", element: <Details/> },
            { path: "CreateActivity", element: <ActivityForm key="Create" /> },
            { path: "Manage/:id", element: <ActivityForm key="Manage" /> },
            { path: "Errors", element: <TestErrors /> },
            { path: "not-found", element: <NotFound /> },
            { path: "server-error", element: <ServerError /> },
            { path: "*", element: <Navigate replace to="/not-found"/> }
        ]
    }
]

export default createBrowserRouter(routes);