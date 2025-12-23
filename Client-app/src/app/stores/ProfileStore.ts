import { makeAutoObservable, runInAction } from "mobx";
import type { Profile } from "../models/Profile";
import agent from "../api/agent";
import { store } from "./Store";

export default class ProfileStore {
    loadingProfile: boolean = false;
    profile: Profile | null = null;

    constructor() {
        makeAutoObservable(this);        
    }

    get isCurrentUser() {
        const user = store.userStore.user;
        if (!user) return false;

        if (!this.profile) return false;

        if (user.username === this.profile.username) return true;

        return false;
    }

    getProfile = async (username: string) => {
        this.loadingProfile = true;
        try {
            var profile = await agent.profile.get(username);
            runInAction(() => {
                this.profile = profile;
                this.loadingProfile = false;
            })
        } catch (error) {
            console.log(error);
            runInAction(() => {
                this.loadingProfile = false;
            })
        }
    }
}