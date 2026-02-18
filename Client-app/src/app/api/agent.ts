import axios, { AxiosError, type AxiosResponse } from "axios";
import type { Activity, ActivityFormValues } from "../models/Activity";
import toast from "react-hot-toast";
import Routes from "../router/Routes";
import { store } from "../stores/Store";
import type { ServerError } from "../models/ServerError";
import { type User, type UserFormValues } from "../models/User";
import { Profile, type ProfileFormValues } from "../models/Profile";
import type Photo from "../models/Photo";
import { PaginatedResult } from "../models/Pagination";
import { type ProfileActivity } from "../models/ProfileActivity";

axios.defaults.baseURL = import.meta.env.VITE_API_URL;

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
    if (import.meta.env.DEV) {
        await sleep(1000);
    }
    if (isResponsePaginated(response)) {
        return createPaginatedResult(response);
    }
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

const isResponsePaginated = (response:AxiosResponse<any>) => {
    return !!response.headers["pagination"];
}

const createPaginatedResult = (response:AxiosResponse<any>) => {
    const pagination = response.headers["pagination"];
    const paginatedResult = new PaginatedResult(response.data, JSON.parse(pagination));

    return {
        ...response,
        data: paginatedResult
    } as AxiosResponse<PaginatedResult<any>>;
}

const responseBody = <T> (response: AxiosResponse<T>) => response.data;

const requests = {
    get: <T> (url: string) => axios.get(url).then(responseBody<T>),
    getWithParams: <T> (url:string, params:URLSearchParams) => axios.get(url, {params}).then(responseBody<T>),
    post: <T> (url: string, body: {}) => axios.post(url, body).then(responseBody<T>),
    put: <T> (url: string, body: {}) => axios.put(url, body).then(responseBody<T>),
    delete: <T> (url: string) => axios.delete(url).then(responseBody<T>)
}

const activities = {
    list: (params: URLSearchParams) => requests.getWithParams<PaginatedResult<Activity[]>>("activities", params),
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
    get: (username: string) => requests.get<Profile>(`/profiles/${username}`),
    update: (profile: ProfileFormValues) => requests.post<void>('/profiles/updateProfile', profile),
    getActivities: (username:string, params:URLSearchParams) => 
        requests.getWithParams<ProfileActivity[]>(`profiles/${username}/activities/`, params)
}

const photos = {
    add: async (photo: Blob) => {
        let formData = new FormData();
        formData.append("photo", photo);
        const response = await axios.post<Photo>("/Photos", formData, {
            headers: {"Content-Type": "multipart/form-data"}
        });
        return response.data;
    },
    delete: (photoId: string) => requests.delete<void>(`/Photos/${photoId}`),
    setMainPhoto: (photoId: string) => requests.post<void>(`/Photos/${photoId}/setMain`, {})
}

const following = {
    followToggle: (username:string) => requests.post(`Follow/${username}`, {}),
    listFollowings: (username:string) => requests.get<Profile[]>(`Follow/${username}/Followings`),
    listFollowers: (username:string) => requests.get<Profile[]>(`Follow/${username}/Followers`),
}

const agent = {
    account,
    activities,
    following,
    photos,
    profile,
}

export default agent;