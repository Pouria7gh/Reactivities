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
            await this.tryLogin(creds);
        } catch (err) {
            throw err;
        }
    }
    
    private tryLogin = async (creds:UserFormValues) => {
        var user = await agent.account.login(creds);
        store.commonStore.setToken(user.token);
        this.setUser(user);
    }

    private setUser = (user:User) => {
        this.user = user;
    }

    register = async (creds: UserFormValues) => {
        try {
            await this.tryRegister(creds);
        } catch (err) {
            throw err;
        }
    }
    
    private tryRegister = async (creds:UserFormValues) => {
        var user = await agent.account.register(creds);
        store.commonStore.setToken(user.token);
        this.setUser(user);
    }

    logout = () => {
        this.user = null;
        store.commonStore.setToken(null);
        store.activityStore.activityRegistry.clear();
    }

    getUser = async () => {
        try {
            const user = await agent.account.current();
            this.setUser(user);
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
