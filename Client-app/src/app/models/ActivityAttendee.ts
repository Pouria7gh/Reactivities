import type { Profile } from "./Profile";

export interface ActivityAttendee {
    username: string;
    displayName: string;
    image?: string;
    bio?: string;
}

export class ActivityAttendee implements ActivityAttendee {
    constructor(profile?: Profile) {
        Object.assign(this, profile);
    }
}