import { makeAutoObservable, runInAction } from "mobx";
import { Activity, type ActivityFormValues } from "../models/Activity";
import agent from "../api/agent";
import {v4 as uuid} from 'uuid';
import { format } from 'date-fns';
import { store } from "./Store";
import { Profile } from "../models/Profile";
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

    setLoadingInitial = (state: boolean) => {
        this.loadingInitial = state;
    }

    loadActivities = async () => {
        this.setLoadingInitial(true);
        try {
            const activities = await agent.activities.list();
            activities.forEach(activity => {
                this.initializeActivity(activity);
                this.setActivityToRegistry(activity);
            })
        } catch (error) {
            console.log(error);
        } finally {
            this.setLoadingInitial(false);
        }
    }

    loadActivity = async (activityId: string) => {

        if (this.hasActivity(activityId)) {
            this.selectActivity(activityId);
        } else {
            const activity = await this.fetchActivity(activityId);
            if(!activity) return;

            this.initializeActivity(activity);
            this.setSelectedActivity(activity);
            this.setActivityToRegistry(activity);
        }
    }

    private hasActivity = (activityId: string) => {
        return this.activityRegistry.has(activityId);
    }

    private selectActivity = (activityId: string) => {
        this.selectedActivity = this.getActivity(activityId);
    }

    private fetchActivity = async (activityId: string) => {
        this.setLoadingInitial(true);
        try {
            return await agent.activities.details(activityId);
        } catch (error) {
            console.log(error);
        } finally {
            this.setLoadingInitial(false);
        }
    }

    private setSelectedActivity = (activity: Activity | undefined) => {
        this.selectedActivity = activity;
    }

    private setActivityToRegistry = (activity : Activity) => {
        this.activityRegistry.set(activity.id, activity);
    }

    private initializeActivity(activity: Activity) {
        this.setActivityIsGoing(activity);
        this.setActivityIsHost(activity);
        this.setActivityHost(activity);
        this.setActivityDate(activity);
    }

    private setActivityIsGoing = (activity: Activity) => {
        const user = store.userStore.user;
        activity.isGoing = activity.attendees
            .some(attendee => attendee.username === user!.username);
    }

    private setActivityIsHost = (activity: Activity) => {
        const user = store.userStore.user;
        activity.isHost = activity.hostUsername === user!.username;
    }

    private setActivityHost = (activity: Activity) => {
        activity.host = activity.attendees
            .find(attendee => attendee.username === activity.hostUsername);
    }

    private setActivityDate = (activity: Activity) => {
        activity.date = new Date(activity.date);
    }

    private getActivity = (id: string) =>  this.activityRegistry.get(id);

    createActivity = async (activityValues: ActivityFormValues) => {
        const user = store.userStore.user;
        const attendee = new Profile(user!);
        if (!activityValues.id) {
            activityValues.id = uuid();
        }
        try {
            await agent.activities.create(activityValues);
            const activity = new Activity(activityValues);
            activity.hostUsername = user!.username;
            activity.attendees = [attendee];
            this.initializeActivity(activity);
            this.setActivityToRegistry(activity);
            runInAction(() => {
                this.selectedActivity = activity;
            })
        } catch (error) {
            console.log(error);
        }
    }

    editActivity = async (activity: ActivityFormValues) => {
        try {
            await agent.activities.update(activity);
            runInAction(() => {
                if (activity.id) {
                    const updatedActivity = {...this.getActivity(activity.id), ...activity};
                    this.activityRegistry.set(activity.id!, updatedActivity as Activity);
                    this.selectedActivity = updatedActivity as Activity;
                }
            });
        } catch (error) {
            console.log(error);
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

    updateAttendance = async () => {
        var user = store.userStore.user;
        var activity = this.selectedActivity;
        if (!user || !activity) return;
        try {
            this.updatingAttendance = true;
            await agent.activities.attend(activity.id);
            runInAction(() => {
                if (activity!.isGoing) {
                    this.selectedActivity!.isGoing = false;
                    this.selectedActivity!.attendees =
                    this.selectedActivity?.attendees?.filter(x => x.username !== user!.username)!;
                    this.activityRegistry.set(activity!.id, this.selectedActivity!);
                } else {
                    this.selectedActivity!.isGoing = true;
                    var profile = new Profile(user!);
                    this.selectedActivity?.attendees?.push(profile);
                    this.activityRegistry.set(activity!.id, this.selectedActivity!);
                }
            })
        } catch (error) {
            console.log(error);
        } finally {
            runInAction(() => {
                this.updatingAttendance = false;
            });
        }
    }

    cancelActivityToggle = async () => {
        this.cancelingActivity = true;
        try {
            await agent.activities.attend(this.selectedActivity!.id);
            runInAction(() => {
                this.selectedActivity!.isCancelled = !this.selectedActivity!.isCancelled;
                this.activityRegistry.set(this.selectedActivity!.id, this.selectedActivity!);
            });
        } catch (error) {
            console.log(error);
        } finally {
            runInAction(() => this.cancelingActivity = false);
        }
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