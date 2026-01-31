import { makeAutoObservable } from "mobx";
import { Activity, type ActivityFormValues } from "../models/Activity";
import agent from "../api/agent";
import {v4 as uuid} from 'uuid';
import { format } from 'date-fns';
import { store } from "./Store";
import { Profile } from "../models/Profile";
import type { User } from "../models/User";
import { ActivityAttendee } from "../models/ActivityAttendee";
export default class ActivityStore {
    activityRegistry: Map<string, Activity> = new Map();
    selectedActivity: Activity | undefined = undefined;
    loadingInitial = false;
    deleting = false;
    updatingAttendance = false;
    cancelingActivity = false;

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

    private setLoadingInitial = (state: boolean) => {
        this.loadingInitial = state;
    }
    

    loadActivities = async () => {
        this.setLoadingInitial(true);
        try {
            await this.performLoadActivities();
        } catch (error) {
            console.log(error);
        } finally {
            this.setLoadingInitial(false);
        }
    }

    private performLoadActivities = async () => {
        const activities = await agent.activities.list();
        this.registerActivities(activities);
    }

    private registerActivities = (activities: Activity[]) => {
        activities.forEach(activity => {
            this.initializeActivity(activity);
            this.addActivityToRegistry(activity);
        })
    }


    loadActivity = async (activityId: string) => {

        if (this.hasActivity(activityId)) {
            this.selectActivity(activityId);
            return;
        }

        this.setLoadingInitial(true);
        try {
            await this.performLoadActivity(activityId);

        } catch (error) {
            console.log(error);
        } finally {
            this.setLoadingInitial(false);
        }
    }

    private performLoadActivity = async (activityId: string) => {
        const activity = await agent.activities.details(activityId);

        this.initializeActivity(activity);
        this.setSelectedActivity(activity);
        this.addActivityToRegistry(activity);
    }

    private hasActivity = (activityId: string) => {
        return this.activityRegistry.has(activityId);
    }

    private selectActivity = (activityId: string) => {
        this.selectedActivity = this.getActivity(activityId);
    }

    private setSelectedActivity = (activity: Activity | undefined) => {
        this.selectedActivity = activity;
    }

    private addActivityToRegistry = (activity : Activity) => {
        this.activityRegistry.set(activity.id, activity);
    }

    private initializeActivity(activity: Activity) {
        this.markActivityAsGoing(activity);
        this.markActivityAsHost(activity);
        this.assignHost(activity);
        this.normalizeActivityDate(activity);
    }

    private markActivityAsGoing = (activity: Activity) => {
        const user = store.userStore.user;
        activity.isGoing = activity.attendees
            .some(attendee => attendee.username === user!.username);
    }

    private markActivityAsHost = (activity: Activity) => {
        const user = store.userStore.user;
        activity.isHost = activity.hostUsername === user!.username;
    }

    private assignHost = (activity: Activity) => {
        activity.host = activity.attendees
            .find(attendee => attendee.username === activity.hostUsername);
    }

    private normalizeActivityDate = (activity: Activity) => {
        activity.date = new Date(activity.date);
    }

    private getActivity = (id: string) =>  this.activityRegistry.get(id);


    createActivity = async (activityValues: ActivityFormValues) => {
        try {
            await this.performCreateActivity(activityValues);
        } catch (error) {
            console.log(error);
        }
    }

    private performCreateActivity = async (activityValues: ActivityFormValues) => {
        const activityValuesWithId = this.addId(activityValues);
        await this.createActivityOnServer(activityValuesWithId);
        this.registerAndSelectNewActivity(activityValuesWithId);
    }

    private createActivityOnServer = async (activityValues: ActivityFormValues) => {
        await agent.activities.create(activityValues);
    }

    private registerAndSelectNewActivity = (activityValues: ActivityFormValues) => {
        const activity = new Activity(activityValues);
        this.initializeNewActivity(activity);
        this.addActivityToRegistry(activity);
        this.setSelectedActivity(activity);
    }

    private addId(activityValues: ActivityFormValues) {
        if (activityValues.id) return activityValues;
        return {...activityValues, id: uuid()};
    }

    private initializeNewActivity = (activity: Activity) => {
        this.assignHostFromUser(activity);
        this.addInitialAttendee(activity);
        this.markActivityAsGoing(activity);
        this.markActivityAsHost(activity);
    }

    private assignHostFromUser = (activity: Activity) => {
        const user = store.userStore.user;
        activity.hostUsername = user!.username;
    }

    private addInitialAttendee = (activity: Activity) => {
        const user = store.userStore.user;
        const attendee = new Profile(user!);
        activity.attendees = [attendee];
    }

    editActivity = async (activityValues: ActivityFormValues) => {
        try {
            await this.performEditActivity(activityValues);
        } catch (error) {
            console.log(error);
        }
    }

    private performEditActivity = async (activityValues: ActivityFormValues) => {
        await agent.activities.update(activityValues);
        this.registerAndSelectUpdatedActivity(activityValues);
    }

    private registerAndSelectUpdatedActivity = (activityValues: ActivityFormValues) => {
        const updatedActivity = this.createUpdatedActivity(activityValues);
        this.addActivityToRegistry(updatedActivity);
        this.setSelectedActivity(updatedActivity);
    }

    private createUpdatedActivity = (activityValues: ActivityFormValues) => {
        return {...this.getActivity(activityValues.id!), ...activityValues} as Activity;
    }

    
    deleteActivity = async (activityId : string) => {
        this.setDeleting(true);
        try {
            await this.performDeleteActivity(activityId);
        } catch (error) {
            console.log(error);
        } finally {
            this.setDeleting(false);
        }
    }

    private performDeleteActivity = async (activityId: string) => {
        await agent.activities.delete(activityId);
        this.deleteActivityFromRegistry(activityId);
    }

    private deleteActivityFromRegistry = (activityId: string) => {
        this.activityRegistry.delete(activityId);
    }
    
    private setDeleting = (state: boolean) => {
        this.deleting = state;
    }


    updateAttendance = async () => {
        var user = store.userStore.user;
        var activity = this.selectedActivity;
        if (!user || !activity) return;

        this.setUpdatingAttendance(true);
        try {
            await this.performUpdateAttendance(activity, user);
        } catch (error) {
            console.log(error);
        } finally {
            this.setUpdatingAttendance(false);
        }
    }

    private performUpdateAttendance = async (activity: Activity, user: User) => {
        await agent.activities.attend(activity.id);

        if (activity.isGoing) {
            this.cancelAttendance(activity, user);
        } else {
            this.confirmAttendance(activity, user);
        }
        this.addActivityToRegistry(activity);
    }

    private cancelAttendance = (activity: Activity, user: User) => {
        activity.isGoing = false;
        activity.attendees =
            activity.attendees?.filter(x => x.username !== user.username);
    }

    private confirmAttendance = (activity: Activity, user: User) => {
        activity.isGoing = true;
        var profile = new ActivityAttendee(user);
        activity.attendees = [...activity.attendees, profile]
    }

    private setUpdatingAttendance = (state: boolean) => {
        this.updatingAttendance = state;
    }

    toggleActivityStatus = async () => {
        const activity = this.selectedActivity;
        if (!activity) return;

        this.setCancelingActivity(true);
        try {
            await this.performToggleActivityStatus(activity);
        } catch (error) {
            console.log(error);
        } finally {
            this.setCancelingActivity(false);
        }
    }

    private performToggleActivityStatus = async (activity: Activity) => {
        await agent.activities.attend(activity.id);
        this.updateActivityStatus(activity);
        this.addActivityToRegistry(activity);
    }

    private updateActivityStatus = (activity: Activity) => {
        activity.isCancelled = !activity.isCancelled;
    }

    private setCancelingActivity = (state: boolean) => {
        this.cancelingActivity = state;
    }

    updateActivityAttendeeImage = (username: string, newPhotoUrl: string) => {
        if (!this.activityRegistry.size) return;
        this.activityRegistry.forEach((activity) => {
            if (activity.hostUsername === username) {
                activity.host!.image = newPhotoUrl;
            }
            const attendee = activity.attendees.find(a => a.username === username);
            if (attendee) {
                attendee.image = newPhotoUrl;
            }
        })
    }

    setActivityAttendeeInfoFromProfile = () => {
        const profile = store.profileStore.profile;
        if (!this.activityRegistry.size || !profile) return;
        this.activityRegistry.forEach((activity) => {
            if (activity.hostUsername === profile.username) {
                activity.host!.displayName = profile.displayName;
                activity.host!.bio = profile.bio;
            }
            const attendee = activity.attendees.find(a => a.username === profile.username);
            if (attendee) {
                attendee.bio = profile.bio;
                attendee.displayName = profile.displayName;
            }
        })
    }
}