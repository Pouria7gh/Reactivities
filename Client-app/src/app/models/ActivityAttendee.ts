import type { User } from "./User";

export interface ActivityAttendee {
    username: string;
    displayName: string;
    image?: string;
    bio?: string;
    followersCount: number;
    following: boolean;
}

export class ActivityAttendee implements ActivityAttendee {
    constructor(user: User) {
        this.username = user.username,
        this.displayName = user.displayName,
        this.image = user.image
    }
}