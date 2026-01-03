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
        store.activityStore.activityRegistry.clear();
        Routes.navigate('/');
    }

    getUser = async () => {
        try {
            const user = await agent.account.current();
            runInAction(() => this.user = user);
        } catch (error) {
            throw error;
        }
    }

    setUserImage(image: string) {
        if (this.user) this.user.image = image;
    }

    setUserInfoFromProfile = () => {
        const profile = store.profileStore.profile;
        if (!profile || !this.user) return;
        this.user.displayName = profile.displayName;
    }
}
