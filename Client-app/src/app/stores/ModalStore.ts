import { makeAutoObservable } from "mobx"

interface Modal {
    open: boolean,
    content: React.ComponentType<any> | null
}

export default class ModalStore {
    modal: Modal = {
        open: false,
        content: null
    }

    constructor() {
        makeAutoObservable(this);        
    }

    openModal = (content: React.ComponentType<any>) => {
        this.modal.open = true;
        this.modal.content = content;
    }

    closeModal = () => {
        this.modal.open = false;
    }
}
