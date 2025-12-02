import { makeAutoObservable, reaction } from "mobx";
import type { ServerError } from "../models/ServerError";

export default class CommonStore {
    serverError: ServerError | null = null;
    token: string | null = localStorage.getItem('jwt');
    appLoaded = false;

    constructor() {
        makeAutoObservable(this);

        reaction(() => this.token, token => {
            if (token) {
                localStorage.setItem('jwt', token);
            } else {
                localStorage.removeItem('jwt');
            }
        });
    }

    setServerError = (error : ServerError) => {
        this.serverError = error;
    }

    setToken = (token: string | null) => {
        this.token = token;
    }

    setAppLoaded = () => {
        this.appLoaded = true;
    }
}
