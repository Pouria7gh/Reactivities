export interface Comment {
    id: string;
    createdAt: Date;
    body: string;
    username: string;
    displayName: string;
    image?: string;
    isCurrentUser: boolean;
}