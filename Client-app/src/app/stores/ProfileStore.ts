import { makeAutoObservable, runInAction } from "mobx";
import type { Profile, ProfileFormValues } from "../models/Profile";
import agent from "../api/agent";
import { store } from "./Store";
import type Photo from "../models/Photo";

export default class ProfileStore {
    loadingProfile: boolean = false;
    profile: Profile | null = null;
    uploading = false;
    mainPhotoLoading = false;
    deletePhotoLoading = false;
    updateProfileLoading = false;

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

    // upload photo
    uploadPhoto = async (photo: Blob) => {
        this.setUploading(true);
        try {
            const responsePhoto = await agent.photos.add(photo);
            this.addPhoto(responsePhoto);
            this.setUploading(false);
        } catch (error) {
            console.log(error);
            this.setUploading(false);
        }
    }

    addPhoto = (photo: Photo) => {
        this.addPhotoToProfile(photo);
        if (photo.isMain) {
            this.updateMainPhoto(photo);
        }
    }

    addPhotoToProfile = (photo: Photo) => {
        if (this.profile!.photos) {
            this.profile!.photos = [photo, ...this.profile!.photos];
        } else {
            this.profile!.photos = [photo];
        }
    } 

    setUploading = (state: boolean) => {
        this.uploading = state;
    }

    // set main photo
    setMainPhoto = async (photo: Photo) => {
        this.setMainPhotoLoading(true);
        try {
            await agent.photos.setMainPhoto(photo.id);
            this.updateMainPhoto(photo);
            this.setMainPhotoLoading(false);
        } catch (error) {
            console.log(error);
            this.setMainPhotoLoading(false);
        }
    }

    updateMainPhoto = (photo: Photo) => {
        store.userStore.setUserImage(photo.url);
        this.updateProfileMainPhoto(photo);
        store.activityStore.updateActivityAttendeeImage(this.profile!.username, photo.url);
    }
    
    updateProfileMainPhoto = (photo: Photo) => {
        this.profile!.image = photo.url;
        const currentMainPhoto = this.profile!.photos!.find(p => p.isMain);
        if (currentMainPhoto) currentMainPhoto.isMain = false;
        this.profile!.photos!.find(p => p.id == photo.id)!.isMain = true;
    }
    
    setMainPhotoLoading(state: boolean) {
        this.mainPhotoLoading = state;
    }

    // delete photo
    deletePhoto = async (photo: Photo) => {
        this.setDeletePhotoLoading(true);
        try {
            await agent.photos.delete(photo.id);
            this.removeProfilePhoto(photo);
            await this.emptyOrReplaceMainPhoto(photo);
            this.setDeletePhotoLoading(false);
        } catch (error) {
            console.log(error);
            this.setDeletePhotoLoading(false);
        }
    }
    
    removeProfilePhoto = (photo: Photo) => {
        this.profile!.photos = this.profile!.photos!.filter(p => p.id !== photo.id);
    }

    emptyOrReplaceMainPhoto = async (deletedPhoto: Photo) => {
        if (!deletedPhoto.isMain) return;
        var newMainPhoto = this.getNewMainPhoto();
        if (newMainPhoto) {
            // replace
            await this.setMainPhoto(newMainPhoto);
        } else {
            //empty
            this.emptyMainPhoto();
        }
    }

    getNewMainPhoto = () => {
        return this.profile!.photos![0];
    }

    emptyMainPhoto = () => {
        this.profile!.image = "";
        store.userStore.setUserImage("");
        store.activityStore.updateActivityAttendeeImage(this.profile!.username, "");
    }

    setDeletePhotoLoading = (state: boolean) => {
        this.deletePhotoLoading = state;
    }

    // updating profile
    updateProfile = async (profile: ProfileFormValues) => {
        this.setUpdateProfileLoading(true);
        try {
            await agent.profile.update(profile);
            this.updateProfileInfo(profile);
            store.userStore.setUserInfoFromProfile();
            store.activityStore.setActivityAttendeeInfoFromProfile();
            this.setUpdateProfileLoading(false);
        } catch (error) {
            console.log(error);
            this.setUpdateProfileLoading(false);
        }
    }

    updateProfileInfo = (profile: ProfileFormValues) => {
        this.profile!.displayName = profile.displayName;
        this.profile!.bio = profile.bio;
    }

    setUpdateProfileLoading = (state: boolean) => {
        this.updateProfileLoading = state;
    }
}