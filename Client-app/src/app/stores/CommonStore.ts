import { makeAutoObservable } from "mobx";
import type { ServerError } from "../models/ServerError";

export default class CommonStore {
    serverError: ServerError | null = null;

    constructor() {
        makeAutoObservable(this);      
    }

    setServerError = (error : ServerError) => {
        this.serverError = error;
    }
}
