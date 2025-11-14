import { makeAutoObservable, runInAction } from "mobx";
import type { Activity } from "../models/activity";
import agent from "../api/agent";
import {v4 as uuid} from 'uuid';

export default class ActivityStore {
    activityRegistry: Map<string, Activity> = new Map();
    selectedActivity: Activity | undefined = undefined;
    loadingInitial = false;
    editMode = false;
    submitting = false;
    deleting = false;

    constructor() {
        makeAutoObservable(this);
    }

    get activitiesByDate() {
        return Array.from(this.activityRegistry.values()).sort((a, b) => Date.parse(b.date) - Date.parse(a.date));
    }

    setLoadingInitial = (state: boolean) => {
        this.loadingInitial = state;
    }

    loadActivities = async () => {
        this.setLoadingInitial(true);
        try {
            const activities = await agent.activities.list();
            activities.forEach(activity => {
                activity.date = activity.date.split("T")[0];
                runInAction(() => {
                    this.activityRegistry.set(activity.id, activity);
                })
            })
            this.setLoadingInitial(false);
        } catch (error) {
            console.log(error);
            this.setLoadingInitial(false);
        }
    }

    selectActivity = (id: string) => {
        const activity = this.activityRegistry.get(id);
        this.selectedActivity = activity;
    }

    cancelSelectActivity = () => {
        this.selectedActivity = undefined;
    }

    openForm = (id?: string) => {
        id ? this.selectActivity(id) : this.cancelSelectActivity();
        this.editMode = true;
    }

    closeForm = () => {
        this.editMode = false;
    }

    setSubmitting = (state: boolean) => {
        this.submitting = state;
    }

    createActivity = async (activity: Activity) => {
        activity.id = uuid();
        this.setSubmitting(true);
        try {
            await agent.activities.create(activity);
            runInAction(() => {
                this.activityRegistry.set(activity.id, activity);
            })
            this.selectActivity(activity.id);
            this.setSubmitting(false);
            this.closeForm();
        } catch (error) {
            console.log(error);
            this.setSubmitting(false);
            this.closeForm();
        }
    }

    editActivity = async (activity: Activity) => {
        this.setSubmitting(true);
        try {
            await agent.activities.update(activity);
            runInAction(() => {
                this.activityRegistry.set(activity.id, activity);
            });
            this.selectActivity(activity.id); 
            this.setSubmitting(false);
            this.closeForm();
        } catch (error) {
            console.log(error);
            this.setSubmitting(false);
            this.closeForm();
        }
    }

    setDeleting = (state: boolean) => {
        this.deleting = state;
    }

    deleteActivity = async (id : string) => {
        this.setDeleting(true);
        try {
            await agent.activities.delete(id);
            runInAction(() => {
                this.activityRegistry.delete(id);
            });
            if (this.selectedActivity && this.selectedActivity.id === id)
                this.cancelSelectActivity();
            this.setDeleting(false);
        } catch (error) {
            console.log(error);
            this.setDeleting(false);
        }
    }
}