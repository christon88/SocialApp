import { action, computed, observable, runInAction } from "mobx";
import { User, UserFormValues } from "../models/user";
import agent from "app/api/agent";
import { RootStore } from "./rootStore";
import { history } from "index";

class UserStore {
  rootStore: RootStore;
  constructor(rootStore: RootStore) {
    this.rootStore = rootStore;
  }
  @observable user: User | null = null;

  @computed get isLoggedIn() {
    return !!this.user;
  }

  @action login = async (values: UserFormValues) => {
    try {
      const user = await agent.Users.login(values);
      runInAction(() => {
        this.user = user;
        this.rootStore.commonStore.setToken(user.token);
        history.push("/activities");
        this.rootStore.modalStore.closeModal();
      });
    } catch (error) {
      throw error;
    }
  };

  @action logout = () => {
    this.user = null;
    this.rootStore.commonStore.removeToken();
    history.push("/");
  };

  @action getUser = async () => {
    try {
      const user = await agent.Users.current();
      runInAction(() => {
        this.user = user;
      });
    } catch (error) {
      console.log(error);
    }
  };

  @action register = async (values: UserFormValues) => {
    try {
      const user = await agent.Users.register(values);
      runInAction(() => {
        this.user = user;
        this.rootStore.commonStore.setToken(user.token);
        history.push("/activities");
        this.rootStore.modalStore.closeModal();
      });
    } catch (error) {
      throw error;
    }
  };
}

export default UserStore;
