import { makeAutoObservable, runInAction } from "mobx";
import type { User, UserFormValues } from "../models/User";
import agent from "../api/agent";
import { store } from "./Store";
import Routes from "../router/Routes";

export default class UserStore {
    user: User | null = null;
    
    constructor() {
        makeAutoObservable(this);    
    }

    get isLoggedIn() {
        return !!this.user;
    }

    login = async (creds: UserFormValues) => {
        try {
            var user = await agent.account.login(creds);
            store.commonStore.setToken(user.token);
            runInAction(() => this.user = user);
            store.modalStore.closeModal();
            Routes.navigate('/Activities');
        } catch (err) {
            throw err;
        }
    }

    register = async (creds: UserFormValues) => {
        try {
            var user = await agent.account.register(creds);
            store.commonStore.setToken(user.token);
            runInAction(() => this.user = user);
            store.modalStore.closeModal();
            Routes.navigate('/Activities');
        } catch (err) {
            throw err;
        }
    }

    logout = () => {
        this.user = null;
        store.commonStore.setToken(null);
        Routes.navigate('/');
    }

    getUser = async () => {
        try {
            const user = await agent.account.current();
            runInAction(() => this.user = user);
        } catch (error) {
            console.log(error);
        }
    }
}
