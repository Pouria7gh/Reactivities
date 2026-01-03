import type Photo from "./Photo";
import type { User } from "./User";

export interface Profile {
    username: string;
    displayName: string;
    image?: string;
    bio?: string;
    photos?: Photo[];
}

export class Profile implements Profile {
    constructor(user: User) {
        this.username = user.username,
        this.displayName = user.displayName,
        this.image = user.image
    }
}

export interface ProfileFormValues {
    displayName: string;
    bio?: string;
}