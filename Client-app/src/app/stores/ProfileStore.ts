import { makeAutoObservable, reaction } from "mobx";
import { Profile, type ProfileFormValues } from "../models/Profile";
import agent from "../api/agent";
import { store } from "./Store";
import type Photo from "../models/Photo";
import type { ProfileActivity, ProfileActivityFilter } from "../models/ProfileActivity";

export default class ProfileStore {
    loadingProfile: boolean = false;
    profile: Profile | null = null;
    followers: Profile[] | null = null;
    followings: Profile[] | null = null;
    activities: ProfileActivity[] | null = null;
    uploading = false;
    mainPhotoLoading = false;
    deletePhotoLoading = false;
    updateProfileLoading = false;
    updatingFollowing = false;
    loadingActivities = false;

    constructor() {
        makeAutoObservable(this);
        reaction(() => this.profile, () => {
            this.followers = null;
            this.followings = null;
            this.activities = null;
        })  
    }

    get isCurrentUser() {
        const user = store.userStore.user;
        if (!user) return false;

        if (!this.profile) return false;

        if (user.username === this.profile.username) return true;

        return false;
    }

    get photosByDate() {
        if (!this.profile!.photos) return undefined;

        const photos = this.profile!.photos.slice();
        
        return photos.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    }

    getProfile = async (username: string) => {
        this.setLoadingProfile(true);
        try {
            await this.fetchAndSetProfile(username);
        } catch (error) {
            console.log(error);
        } finally {
            this.setLoadingProfile(false);
        }
    }
    
    private fetchAndSetProfile = async (username: string) => {
        var profile = await agent.profile.get(username);
        this.normalizePhotosDate(profile);
        this.setProfile(profile);    
    }

    private setLoadingProfile = (state: boolean) => {
        this.loadingProfile = state;
    }

    private setProfile = (profile: Profile) => {
        this.profile = profile;
    }

    private normalizePhotosDate = (profile: Profile) => {
        if (!profile.photos) return;
        profile.photos.forEach((photo) => {
            photo.createdAt = new Date(photo.createdAt);
        })
    }

    uploadPhoto = async (photo: Blob) => {
        this.setUploading(true);
        try {
            await this.performUploadPhoto(photo);
        } catch (error) {
            console.log(error);
        } finally {
            this.setUploading(false);
        }
    }
    
    private performUploadPhoto = async (photo: Blob) => {
        const responsePhoto = await agent.photos.add(photo);
        this.addPhotoToProfile(responsePhoto);
        if (responsePhoto.isMain) {
            this.updateMainPhoto(responsePhoto);
        }
    }

    private addPhotoToProfile = (photo: Photo) => {
        photo.createdAt = new Date(photo.createdAt);
        if (this.profile!.photos) {
            this.profile!.photos = [photo, ...this.profile!.photos];
        } else {
            this.profile!.photos = [photo];
        }
    } 

    private setUploading = (state: boolean) => {
        this.uploading = state;
    }

    setMainPhoto = async (photo: Photo) => {
        this.setMainPhotoLoading(true);
        try {
            await this.setMainPhotoAndUpdateProfile(photo);
        } catch (error) {
            console.log(error);
        } finally {
            this.setMainPhotoLoading(false);
        }
    }
    
    private setMainPhotoAndUpdateProfile = async (photo: Photo) => {
        await agent.photos.setMainPhoto(photo.id);
        this.updateMainPhoto(photo);
    }
    
    private updateMainPhoto = (photo: Photo) => {
        this.updateProfileMainPhoto(photo);
        this.updateMainPhotoInStores(photo);
    }

    private updateMainPhotoInStores = (photo: Photo) => {
        store.userStore.setUserImage(photo.url);
        store.activityStore.updateActivityAttendeeImage(this.profile!.username, photo.url);
    }
    
    private updateProfileMainPhoto = (photo: Photo) => {
        this.profile!.image = photo.url;
        const currentMainPhoto = this.profile!.photos!.find(p => p.isMain);
        if (currentMainPhoto) currentMainPhoto.isMain = false;
        this.profile!.photos!.find(p => p.id == photo.id)!.isMain = true;
    }
    
    private setMainPhotoLoading(state: boolean) {
        this.mainPhotoLoading = state;
    }

    deletePhoto = async (photo: Photo) => {
        this.setDeletePhotoLoading(true);
        try {
            await this.performDeletePhoto(photo);
        } catch (error) {
            console.log(error);
        } finally {
            this.setDeletePhotoLoading(false);
        }
    }
    
    private performDeletePhoto = async (photo: Photo) => {
        await agent.photos.delete(photo.id);
        this.removeProfilePhoto(photo);
        if (photo.isMain) {
            await this.emptyOrReplaceMainPhoto();
        }
    }

    private removeProfilePhoto = (photo: Photo) => {
        this.profile!.photos = this.profile!.photos!.filter(p => p.id !== photo.id);
    }

    private emptyOrReplaceMainPhoto = async () => {
        var newMainPhoto = this.getNewMainPhoto();
        if (newMainPhoto) {
            await this.setMainPhoto(newMainPhoto);
        } else {
            this.emptyMainPhoto();
        }
    }

    private getNewMainPhoto = () => {
        return this.profile!.photos![0];
    }

    private emptyMainPhoto = () => {
        this.emptyProfileMainPhoto();
        this.emptyMainPhotoInStores();
    }
    
    private emptyProfileMainPhoto = () => {
        this.profile!.image = "";
    }
    
    private emptyMainPhotoInStores = () => {
        store.userStore.setUserImage("");
        store.activityStore.updateActivityAttendeeImage(this.profile!.username, "");
    }

    private setDeletePhotoLoading = (state: boolean) => {
        this.deletePhotoLoading = state;
    }

    updateProfile = async (profileValues: ProfileFormValues) => {
        this.setUpdateProfileLoading(true);
        try {
            await this.performUpdateProfile(profileValues);
        } catch (error) {
            console.log(error);
        } finally {
            this.setUpdateProfileLoading(false);
        }
    }
    
    private performUpdateProfile = async (profileValues: ProfileFormValues) => {
        await agent.profile.update(profileValues);
        this.updateProfileInfo(profileValues);
        this.updateProfileInfoInStores();
    }
    
    private updateProfileInfoInStores = () => {
        store.userStore.setUserInfoFromProfile();
        store.activityStore.setActivityAttendeeInfoFromProfile();    
    }

    private updateProfileInfo = (profile: ProfileFormValues) => {
        this.profile!.displayName = profile.displayName;
        this.profile!.bio = profile.bio;
    }

    private setUpdateProfileLoading = (state: boolean) => {
        this.updateProfileLoading = state;
    }

    updateFollowing = async (username:string, shouldFollow:boolean) => {
        if (this.checkIsCurrentUser(username)) {
            return;
        }

        this.setUpdatingFollowing(true);
        try {
            await this.handleUpdateFollowing(username, shouldFollow);
        } catch (error) {
            console.log(error);
        } finally {
            this.setUpdatingFollowing(false);
        }
    }

    checkIsCurrentUser = (username:string) => {
        const user = store.userStore.user;
        if (!user) {
            return false;
        }
        return username === user.username;
    }

    private setUpdatingFollowing = (state:boolean) => {
        this.updatingFollowing = state;
    }

    private handleUpdateFollowing = async (username:string, shouldFollow:boolean) => {
        await agent.following.followToggle(username);
        store.activityStore.updateFollowingAttendee(username, shouldFollow);
        this.updateProfileFollowing(username, shouldFollow);
        this.updateFollowersList(shouldFollow);
    }

    private updateProfileFollowing = (username:string, shouldFollow:boolean) => {
        const profile = this.profile;
        if (!profile || profile.username !== username || profile.following === shouldFollow) return;
        profile.following = shouldFollow;
        shouldFollow ? profile.followersCount++ : profile.followersCount--;
    }

    private updateFollowersList = (shouldFollow:boolean) => {
        if (shouldFollow) {
            this.addUserToFollowersList();
        } else {
            this.removeUserFromFollowersList();
        }
    }

    private addUserToFollowersList = () => {
        const user = store.userStore.user;
        if (!user || !this.followers) return;
        this.followers = [new Profile(user), ...this.followers];
    }

    private removeUserFromFollowersList = () => {
        const username = store.userStore.user?.username;
        if (!this.followers || !username) return;
        this.followers = this.followers.filter(x => x.username !== username);
    }

    listFollowings = async (username:string) => {
        try {
            const followings = await agent.following.listFollowings(username);
            this.setFollowings(followings);
        } catch (error) {
            console.log(error);
        }
    }
    
    private setFollowings = (followings:Profile[]) => {
        this.followings = followings;
    }

    listFollowers = async (username:string) => {
        try {
            const followers = await agent.following.listFollowers(username);
            this.setFollowers(followers);
        } catch (error) {
            console.log(error);
        }
    }
    
    private setFollowers = (followers:Profile[]) => {
        this.followers = followers;
    }

    loadActivities = async (predicate:ProfileActivityFilter = "futureEvents") => {
        this.setLoadingActivities(true);
        try {
            const username = this.profile?.username;
            await this.handleLoadActivities(username!, predicate);
        } catch(error) {
            console.log(error);
        } finally{
            this.setLoadingActivities(false);
        }
    }

    private setLoadingActivities = (state:boolean) => {
        this.loadingActivities = state;
    }

    private handleLoadActivities = async (username:string, predicate:ProfileActivityFilter = "futureEvents") => {
        this.clearActivities();
        const query = this.createActivitySearchParams(predicate);
        const activities = await agent.profile.getActivities(username, query);
        this.normalizeActivitiesDate(activities);
        this.setActivities(activities);
    }

    private clearActivities = () => {
        this.activities = null;
    }

    private createActivitySearchParams = (predicate:ProfileActivityFilter) => {
        const query = new URLSearchParams();
        query.append("predicate", predicate);
        return query;
    }

    private normalizeActivitiesDate = (activities:ProfileActivity[]) => {
        activities.forEach(activity => {
            activity.date = new Date(activity.date);
        })
    }

    private setActivities = (activities:ProfileActivity[]) => {
        this.activities = activities;
    }
}