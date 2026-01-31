import { makeAutoObservable } from "mobx";
import { HubConnectionBuilder, LogLevel, type HubConnection } from "@microsoft/signalr"
import { store } from "./Store";
import type { Comment } from "../models/Comment";
import type { CommentFormValues } from "../models/CommentFormValues";

export class CommentStore {
    comments: Comment[] = [];
    private hubConnection: HubConnection | null = null;

    constructor() {
        makeAutoObservable(this);
    }

    createHubConnection = (activityId: string) => {
        if (!this.isThereSelectedActivity())
            return;

        this.initializeHubConnection(activityId);
        this.startHubConnection();
        this.configureEvents();
    }
    
    private isThereSelectedActivity = () => {
        var selectedActivity = store.activityStore.selectedActivity;
        return !!selectedActivity;
    }
    
    private initializeHubConnection = (activityId: string) => {
        this.hubConnection = this.createHubConnectionWithBuilder(activityId);
    }

    private createHubConnectionWithBuilder = (activityId: string) => {
        return new HubConnectionBuilder()
            .withUrl(`http://localhost:5000/chat?activityId=${activityId}`, {
                accessTokenFactory: () => store.userStore.user!.token
            })
            .withAutomaticReconnect()
            .configureLogging(LogLevel.Information)
            .build();
    }

    private startHubConnection = () => {
        if (!this.hubConnection)
            return;

        this.hubConnection.start().catch((error) => {
            console.log(error)
        })
    }

    private configureEvents = () => {
        this.configureLoadComments();
        this.configureRecieveComment();
    }

    private configureLoadComments = () => {
        if (!this.hubConnection)
            return;
        this.hubConnection.on("LoadComments", (comments: Comment[]) => {
            this.initializeComments(comments);
            this.setComments(comments);
        })
    }

    private initializeComments = (comments:Comment[]) => {
        comments.map((comment) => {
            this.initializeComment(comment);
        })
    }
    
    private initializeComment = (comment:Comment) => {
        this.normalizeCommentDate(comment);
        this.markIsCurrentUser(comment);
    }
    
    private normalizeCommentDate = (comment:Comment) => {
        comment.createdAt = new Date(comment.createdAt);
    }
    
    private markIsCurrentUser = (comment:Comment) => {
        const currentUser = store.userStore.user;
        if (currentUser) {
            comment.isCurrentUser = comment.username === currentUser.username;
        }
    }

    private setComments = (comments: Comment[]) => {
        this.comments = comments;
    }

    private configureRecieveComment = () => {
        if (!this.hubConnection)
            return;
        this.hubConnection.on("ReceiveComment", (comment: Comment) => {
            this.initializeComment(comment);
            this.addComment(comment);
        })
    }

    private addComment = (comment: Comment) => {
        this.comments.push(comment);
    }

    stopHubConnectionAndClearComments = () => {
        this.stopHubConnection();
        this.clearComments();
    }

    private stopHubConnection = () => {
        if (!this.hubConnection)
            return;
        this.hubConnection.stop().catch(error => {
            console.log(error);
        })
    }

    private clearComments = () => {
        this.comments = [];
    }

    sendComment = async (values: CommentFormValues) => {
        if (!this.hubConnection)
            return;
        await this.hubConnection.invoke("SendComment", values);
    }
}