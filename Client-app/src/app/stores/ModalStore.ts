import { makeAutoObservable } from "mobx"

interface Modal {
    open: boolean,
    content: React.ComponentType<any> | null,
    props?: any
}

export default class ModalStore {
    modal: Modal = {
        open: false,
        content: null,
        props: null
    }

    constructor() {
        makeAutoObservable(this);        
    }

    openModal = (content: React.ComponentType<any>, props?: any) => {
        this.modal.open = true;
        this.modal.content = content;
        this.modal.props = props;
    }

    closeModal = () => {
        this.modal.open = false;
    }
}
