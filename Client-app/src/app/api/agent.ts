import axios, { AxiosError, type AxiosResponse } from "axios";
import type { Activity, ActivityFormValues } from "../models/Activity";
import toast from "react-hot-toast";
import Routes from "../router/Routes";
import { store } from "../stores/Store";
import type { ServerError } from "../models/ServerError";
import { type User, type UserFormValues } from "../models/User";
import { Profile } from "../models/Profile";

axios.defaults.baseURL = "http://localhost:5000/api";

const sleep = (delay : number) => {
    return new Promise((resolve) => {
        setTimeout(resolve, delay)
    })
}

axios.interceptors.request.use(async request => {
    var token = store.commonStore.token;
    if (token) request.headers.Authorization = `Bearer ${token}`;
    return request;
})

axios.interceptors.response.use(async response => {
    await sleep(1000);
    return response;
}, (error : AxiosError) => {
    if (!error.response)
        return Promise.reject(error);
    const { data, status, config } = error.response as AxiosResponse;
    
    switch (status) {
        case 400 :
            if (config.method == 'get' && data.errors.hasOwnProperty('id')) {
                Routes.navigate('/not-found');
            } else {
                toast.error("Bad Request");
            }
            break;
        case 401 :
            toast.error("Unauthorized");
            Routes.navigate("/");
            break;
        case 404 :
            Routes.navigate("/not-found");
            break;
        case 500 :
            store.commonStore.setServerError(data as ServerError);
            Routes.navigate("/server-error");
            break;
    }

    return Promise.reject(error);
});

const responseBody = <T> (response: AxiosResponse<T>) => response.data;

const requests = {
    get: <T> (url: string) => axios.get(url).then(responseBody<T>),
    post: <T> (url: string, body: {}) => axios.post(url, body).then(responseBody<T>),
    put: <T> (url: string, body: {}) => axios.put(url, body).then(responseBody<T>),
    delete: <T> (url: string) => axios.delete(url).then(responseBody<T>)
}

const activities = {
    list: () => requests.get<Activity[]>("activities"),
    details: (id: string) => requests.get<Activity>(`activities/${id}`),
    create: (activity: ActivityFormValues) => requests.post<void>("activities", activity),
    update: (activity: ActivityFormValues) => requests.put<void>(`activities/${activity.id}`, activity),
    delete: (id: string) => requests.delete<void>(`activities/${id}`),
    attend: (id: string) => requests.post<void>(`activities/${id}/attend`, {})
}

const account = {
    current: () => requests.get<User>('/account'),
    register: (user: UserFormValues) => requests.post<User>('/account/register', user),
    login: (user: UserFormValues) => requests.post<User>('/account/login', user)
}

const profile = {
    get: (username: string) => requests.get<Profile>(`/profiles/${username}`)
}

const agent = {
    account,
    activities,
    profile
}

export default agent;