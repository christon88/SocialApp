import { RootStore } from "./rootStore";
import { observable, action, reaction } from "mobx";

class CommonStore {
  rootStore: RootStore;

  constructor(rootStore: RootStore) {
    this.rootStore = rootStore;

    reaction(
      () => this.token,
      (token) => {
        if (token) {
          window.localStorage.setItem("jwt", token);
        } else {
          window.localStorage.removeItem("jwt");
        }
      }
    );
  }

  @observable token: string | null = window.localStorage.getItem("jwt");
  @observable appLoaded = false;

  @action setToken = (token: string) => {
    this.token = token;
  };

  @action removeToken = () => {
    this.token = null;
  };

  @action setAppLoaded = (loaded: boolean) => {
    this.appLoaded = loaded;
  };
}

export default CommonStore;
