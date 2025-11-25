import { makeAutoObservable, runInAction } from "mobx";
import type { Activity } from "../models/activity";
import agent from "../api/agent";
import {v4 as uuid} from 'uuid';
import { format } from 'date-fns';

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
        return Array.from(this.activityRegistry.values()).sort((a, b) => b.date!.getTime() - a.date!.getTime());
    }

    get groupedActivitiesByDate() {
        return Object.entries(
            this.activitiesByDate.reduce((activities, activity) => {
                const date = format(activity.date!, "dd MMM yyyy");
                activities[date] = activities[date] ? [...activities[date], activity] : [activity];
                return activities;
            }, {} as {[key: string]: Activity[]})
        );
    }

    setLoadingInitial = (state: boolean) => {
        this.loadingInitial = state;
    }

    loadActivities = async () => {
        this.setLoadingInitial(true);
        try {
            const activities = await agent.activities.list();
            activities.forEach(activity => {
                activity.date = new Date(activity.date!);
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

    loadActivity = async (id: string) => {
        let activity = this.getActivity(id);
        if (activity) this.selectedActivity = activity;
        else {
            this.setLoadingInitial(true);
            try {
                activity = await agent.activities.details(id);
                this.formatActivityDate(activity);
                runInAction(() => {
                    this.selectedActivity = activity;
                    if (activity) {
                        this.activityRegistry.set(activity.id, activity)
                    }
                });
                this.setLoadingInitial(false);
            } catch (error) {
                console.log(error);
                this.setLoadingInitial(false);
            }
        }
    }

    private formatActivityDate = (activity : Activity) => activity.date = new Date(activity.date!);
    private getActivity = (id: string) =>  this.activityRegistry.get(id);

    setSubmitting = (state: boolean) => {
        this.submitting = state;
    }

    createActivity = async (activity: Activity) => {
        if (!activity.id) {
            activity.id = uuid();
        }
        this.setSubmitting(true);
        try {
            await agent.activities.create(activity);
            runInAction(() => {
                this.activityRegistry.set(activity.id, activity);
            })
            this.setSubmitting(false);
        } catch (error) {
            console.log(error);
            this.setSubmitting(false);
        }
    }

    editActivity = async (activity: Activity) => {
        this.setSubmitting(true);
        try {
            await agent.activities.update(activity);
            runInAction(() => {
                this.activityRegistry.set(activity.id, activity);
            });
            this.setSubmitting(false);
        } catch (error) {
            console.log(error);
            this.setSubmitting(false);
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
            this.setDeleting(false);
        } catch (error) {
            console.log(error);
            this.setDeleting(false);
        }
    }
}