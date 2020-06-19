import { RootStore } from "./rootStore";
import { observable, action, runInAction, computed } from "mobx";
import { Profile, Photo } from "app/models/profile";
import agent from "app/api/agent";
import { toast } from "react-toastify";

class ProfileStore {
  rootStore: RootStore;
  constructor(rootStore: RootStore) {
    this.rootStore = rootStore;
  }

  @observable profile: Profile | null = null;
  @observable loadingProfile = false;
  @observable uploadingPhoto = false;
  @observable settingMainPhoto: string | null = null;
  @observable deletingPhoto: string | null = null;
  @computed get isCurrentUser() {
    return this.profile?.username === this.rootStore.userStore.user?.username;
  }

  @action loadProfile = async (username: string) => {
    this.loadingProfile = true;
    try {
      const profile = await agent.Profiles.get(username);
      runInAction(() => {
        this.profile = profile;
        this.loadingProfile = false;
      });
    } catch (error) {
      runInAction(() => {
        this.loadingProfile = false;
      });
      console.log(error);
    }
  };

  @action uploadPhoto = async (file: Blob) => {
    this.uploadingPhoto = true;
    try {
      const photo = await agent.Profiles.uploadPhoto(file);
      runInAction(() => {
        if (this.profile) {
          this.profile.photos.push(photo);
          if (photo.isMain && this.rootStore.userStore.user) {
            this.rootStore.userStore.user.image = photo.url;
            this.profile.image = photo.url;
          }
        }
        this.uploadingPhoto = false;
      });
    } catch (error) {
      console.log(error);
      toast.error("Error uploading photo");
      runInAction(() => {
        this.uploadingPhoto = false;
      });
    }
  };

  @action setMainPhoto = async (photo: Photo) => {
    this.settingMainPhoto = photo.id;
    try {
      await agent.Profiles.setMainPhoto(photo.id);
      runInAction(() => {
        this.rootStore.userStore.user!.image = photo.url;
        this.profile!.photos.find(
          (profilePhoto) => profilePhoto.isMain
        )!.isMain = false;
        this.profile!.photos.find(
          (profilePhoto) => profilePhoto.id === photo.id
        )!.isMain = true;
        this.profile!.image = photo.url;
        this.settingMainPhoto = null;
      });
    } catch (error) {
      console.log(error);
      toast.error("Problem setting main photo");
      runInAction(() => {
        this.settingMainPhoto = null;
      });
    }
  };

  @action deletePhoto = async (photo: Photo) => {
    this.deletingPhoto = photo.id;
    try {
      await agent.Profiles.deletePhoto(photo.id);
      runInAction(() => {
        this.profile!.photos = this.profile!.photos.filter(
          (profilePhoto) => profilePhoto.id !== photo.id
        );
        this.deletingPhoto = null;
      });
    } catch (error) {
      console.log(error);
      toast.error("Problem deleting photo");
      runInAction(() => {
        this.deletingPhoto = null;
      });
    }
  };
}

export default ProfileStore;
