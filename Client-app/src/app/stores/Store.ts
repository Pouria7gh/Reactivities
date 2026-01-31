import { createContext, useContext } from "react";
import ActivityStore from "./ActivityStore";
import CommonStore from "./CommonStore";
import UserStore from "./UserStore";
import ModalStore from "./ModalStore";
import ProfileStore from "./ProfileStore";
import { CommentStore } from "./CommentStore";

interface Store {
    activityStore: ActivityStore;
    commentStore: CommentStore;
    commonStore: CommonStore;
    modalStore: ModalStore;
    profileStore: ProfileStore;
    userStore: UserStore;
}

export const store: Store = {
    activityStore: new ActivityStore(),
    commonStore: new CommonStore(),
    commentStore: new CommentStore(),
    userStore: new UserStore(),
    modalStore: new ModalStore(),
    profileStore: new ProfileStore()
}

export const StoreContext = createContext(store);

export function useStore() {
    return useContext(StoreContext);
}