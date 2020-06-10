import { RootStore } from "./rootStore";
import { observable, action } from "mobx";

interface Modal {
  open: boolean;
  body: JSX.Element | null;
}

class ModalStore {
  rootStore: RootStore;

  constructor(rootStore: RootStore) {
    this.rootStore = rootStore;
  }

  @observable.shallow modal: Modal = {
    open: false,
    body: null,
  };

  @action openModal = (content: JSX.Element) => {
    this.modal.open = true;
    this.modal.body = content;
  };

  @action closeModal = () => {
    this.modal.open = false;
    this.modal.body = null;
  };
}

export default ModalStore;
