import axios, { type AxiosResponse } from "axios";
import type { Activity } from "../models/activity";

axios.defaults.baseURL = "http://localhost:5000/api";

const sleep = (delay : number) => {
    return new Promise((resolve) => {
        setTimeout(resolve, delay)
    })
}

axios.interceptors.response.use(async response => {
    try {
        await sleep(1000);
        return response;
    } catch (error) {
        console.log(error);
        return await Promise.reject(error);
    }
})

const responseBody = <T> (response: AxiosResponse<T>) => response.data;

const requests = {
    get: <T> (url: string) => axios.get(url).then(responseBody<T>),
    post: <T> (url: string, body: {}) => axios.post(url, body).then(responseBody<T>),
    put: <T> (url: string, body: {}) => axios.put(url, body).then(responseBody<T>),
    delete: <T> (url: string) => axios.delete(url).then(responseBody<T>)
}

const activities = {
    list: () => requests.get<Activity[]>("activities"),
    details: (activity: Activity) => requests.get<Activity>(`activities/${activity.id}`),
    create: (activity: Activity) => requests.post<void>("activities", activity),
    update: (activity: Activity) => requests.put<void>(`activities/${activity.id}`, activity),
    delete: (id: string) => requests.delete<void>(`activities/${id}`)
}

const agent = {
    activities,
}

export default agent;